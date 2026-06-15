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

// Stage 33-B-2: plan-id → Stripe price env-var map. Source of truth for the
// $30 Empire Core vs $40 Empire Pro split. Adding a new plan only requires
// adding an entry here + the matching env var in the Netlify dashboard.
// Legacy STRIPE_PRICE_ID is intentionally NOT used as a fallback - silently
// falling back would send Core/Pro to the wrong price.
const PLAN_PRICE_ENV = {
  'empire-core': process.env.STRIPE_PRICE_EMPIRE_CORE,
  'empire-pro':  process.env.STRIPE_PRICE_EMPIRE_PRO
};
const ALLOWED_PLANS = Object.keys(PLAN_PRICE_ENV);

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

  // Stage 33-B-2: parse + validate planId before any Stripe / Firestore work.
  // Body is optional historically, so a missing body is a 400 with a safe
  // message rather than a 500 crash.
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }
  const planId = body && body.planId;
  if (!planId || ALLOWED_PLANS.indexOf(planId) < 0) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid plan selected' })
    };
  }
  const priceId = PLAN_PRICE_ENV[planId];
  if (!priceId) {
    // Env var missing in this environment. Do not log the value - just the
    // plan key so ops can fix the matching env var.
    console.error('create-checkout: price env missing for plan', planId);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Checkout price is not configured' })
    };
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
    // Stage 33-B-2: line item uses the per-plan price; metadata + subscription
    // metadata carry uid + planId so the webhook (Stage 33-B-4) can read the
    // plan from the subscription object instead of guessing.
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      client_reference_id: uid,
      metadata: { uid, planId },
      subscription_data: {
        metadata: { uid, planId }
      },
      success_url: `${process.env.URL}/dashboard/dashboard.html?checkout=success`,
      cancel_url: `${process.env.URL}/plan.html`
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error('create-checkout error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unable to create checkout session' })
    };
  }
};
