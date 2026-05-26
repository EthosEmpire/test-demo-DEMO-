const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Guest checkout — no Firebase account required yet.
// The session_id is passed back in the success URL so we can link
// the payment to a Firebase user after they create their account.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
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
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
