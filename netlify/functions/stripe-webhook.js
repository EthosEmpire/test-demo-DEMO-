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

// Find a user document by their Stripe customer ID
async function getUserByCustomer(customerId) {
  const snap = await db.collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();
  return snap.empty ? null : snap.docs[0];
}

// Write only the allowed fields — admin bypasses Firestore security rules
async function updateUser(uid, data) {
  await db.collection('users').doc(uid).set(
    { ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
}

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    switch (stripeEvent.type) {

      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        const uid = session.client_reference_id;
        if (uid) {
          await updateUser(uid, {
            subscriptionStatus: 'active',
            plan: 'empire-builder',
            stripeSubscriptionId: session.subscription
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = stripeEvent.data.object;
        const userDoc = await getUserByCustomer(sub.customer);
        if (userDoc) {
          await updateUser(userDoc.id, { subscriptionStatus: sub.status });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = stripeEvent.data.object;
        const userDoc = await getUserByCustomer(sub.customer);
        if (userDoc) {
          await updateUser(userDoc.id, { subscriptionStatus: 'canceled' });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object;
        const userDoc = await getUserByCustomer(invoice.customer);
        if (userDoc) {
          await updateUser(userDoc.id, { subscriptionStatus: 'past_due' });
        }
        break;
      }

      default:
        break;
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('Webhook handler error:', err);
    return { statusCode: 500, body: 'Handler failed' };
  }
};
