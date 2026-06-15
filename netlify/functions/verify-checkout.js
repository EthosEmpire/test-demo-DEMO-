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

// Stage 33-B-4: mirror the same plan / status normalisation used by
// stripe-webhook.js so the two write paths cannot disagree about what a
// paid subscription means. If the price id cannot be resolved here, we do
// NOT silently mark the user as paid - they get 'free' until the webhook
// reconciles them.
const ALLOWED_PLANS = ['empire-core', 'empire-pro'];
const ACTIVE_STATUSES = ['active', 'trialing'];

function planFromPriceId(priceId) {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_EMPIRE_CORE) return 'empire-core';
  if (priceId === process.env.STRIPE_PRICE_EMPIRE_PRO)  return 'empire-pro';
  return null;
}

function normalizePlanForStatus(status, planId) {
  if (ACTIVE_STATUSES.indexOf(status) >= 0 && ALLOWED_PLANS.indexOf(planId) >= 0) {
    return planId;
  }
  return 'free';
}

function getSubscriptionPriceId(subscription) {
  return subscription
      && subscription.items
      && subscription.items.data
      && subscription.items.data[0]
      && subscription.items.data[0].price
      && subscription.items.data[0].price.id
      ? subscription.items.data[0].price.id
      : null;
}

function periodEndTimestamp(subscription) {
  const seconds = subscription && subscription.current_period_end;
  if (typeof seconds !== 'number' || !isFinite(seconds)) return null;
  return admin.firestore.Timestamp.fromMillis(seconds * 1000);
}

// Called after the user creates their account — links the Stripe
// checkout session to their new Firebase UID and writes the real plan.
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

    const stripeCustomerId = session.customer || null;

    // Stage 33-B-4: pull the actual subscription so price + status are not
    // guessed. The old code hardcoded plan: 'empire-builder' here; the new
    // code derives plan from the price id and falls back to session metadata
    // (the planId Stage 33-B-2 wrote) only when the price mapping fails.
    let subscription = null;
    if (session.subscription) {
      try {
        subscription = await stripe.subscriptions.retrieve(session.subscription);
      } catch (e) {
        console.error('verify-checkout: subscription retrieve failed');
      }
    }
    const metadataPlanFallback = (session.metadata && session.metadata.planId) || null;
    const priceId = getSubscriptionPriceId(subscription);
    let planId = planFromPriceId(priceId);
    if (!planId && metadataPlanFallback && ALLOWED_PLANS.indexOf(metadataPlanFallback) >= 0) {
      planId = metadataPlanFallback;
    }
    const status = (subscription && subscription.status) || 'active';
    const plan = normalizePlanForStatus(status, planId);

    const write = {
      subscriptionStatus: status,
      plan,
      stripeSubscriptionId: session.subscription || null,
      stripePriceId: priceId || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    if (stripeCustomerId) write.stripeCustomerId = stripeCustomerId;
    const periodEnd = periodEndTimestamp(subscription);
    if (periodEnd) write.currentPeriodEnd = periodEnd;

    // Update Firestore — only the backend can write these restricted fields
    await db.collection('users').doc(uid).set(write, { merge: true });

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
