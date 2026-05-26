const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
    )
  });
}

const db = admin.firestore();

// Called after the user creates their account — links the Stripe
// checkout session to their new Firebase UID.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const authHeader = event.headers.authorization || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!idToken) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const { sessionId } = JSON.parse(event.body || '{}');
  if (!sessionId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing sessionId' }) };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // Retrieve the Stripe session to confirm it was paid
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return { statusCode: 402, body: JSON.stringify({ error: 'Payment not completed' }) };
    }

    // Get or create Stripe customer for this user
    let stripeCustomerId = session.customer;

    // Update Firestore — only the backend can write these restricted fields
    await db.collection('users').doc(uid).set({
      stripeCustomerId,
      stripeSubscriptionId: session.subscription,
      subscriptionStatus: 'active',
      plan: 'empire-builder',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Update Stripe customer with Firebase UID for future webhook lookups
    if (stripeCustomerId) {
      await stripe.customers.update(stripeCustomerId, {
        metadata: { firebaseUID: uid }
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error('verify-checkout error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
