const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Guest checkout — no Firebase account required yet.
// The session_id is passed back in the success URL so we can link
// the payment to a Firebase user after they create their account.
//
// Stage 33-B-2: same plan-id → price env-var map as create-checkout.js so
// $30 Core and $40 Pro stay in lockstep across both entry points. Legacy
// STRIPE_PRICE_ID is intentionally NOT used as a fallback - silent fallback
// would charge the wrong amount for the wrong plan.
//
// NOTE: this function is unauthenticated by design (pre-signup checkout).
// Account linking happens later via verify-checkout.js after the user
// creates a Firebase account. Not recommended for production unless that
// linking path is end-to-end verified.
const PLAN_PRICE_ENV = {
  'empire-core': process.env.STRIPE_PRICE_EMPIRE_CORE,
  'empire-pro':  process.env.STRIPE_PRICE_EMPIRE_PRO
};
const ALLOWED_PLANS = Object.keys(PLAN_PRICE_ENV);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

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
    console.error('create-checkout-guest: price env missing for plan', planId);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Checkout price is not configured' })
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      metadata: { planId, checkoutType: 'guest' },
      subscription_data: {
        metadata: { planId, checkoutType: 'guest' }
      },
      success_url: `${process.env.URL}/login.html?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/plan.html`
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error('guest-checkout error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unable to create checkout session' })
    };
  }
};
