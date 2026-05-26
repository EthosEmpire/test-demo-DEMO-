const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

// Initialize Firebase Admin once across warm function invocations
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
    )
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Verify Firebase ID token from Authorization header
  const authHeader = event.headers.authorization || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!idToken) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // Read user document once
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    let stripeCustomerId = userSnap.exists ? userSnap.data().stripeCustomerId : null;

    // Create Stripe customer if this is their first checkout
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: decoded.email,
        name: decoded.name || '',
        metadata: { firebaseUID: uid }
      });
      stripeCustomerId = customer.id;
      // Admin writes the restricted field (frontend cannot do this)
      await userRef.set({ stripeCustomerId }, { merge: true });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      client_reference_id: uid,
      success_url: `${process.env.URL}/dashboard.html?checkout=success`,
      cancel_url: `${process.env.URL}/plan.html`
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error('create-checkout error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
