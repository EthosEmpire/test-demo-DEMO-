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

// Stage 33-B-4: single source of truth for plan / status writes. Everything
// the dashboard reads (Stage 33-B-5) flows through these helpers, so there
// is exactly one way to decide what `plan` and `subscriptionStatus` mean.
const ALLOWED_PLANS = ['empire-core', 'empire-pro'];
const ACTIVE_STATUSES = ['active', 'trialing'];

// Map a Stripe price id to our plan key. Returns null when the price is not
// one of the configured plans (env var missing OR genuinely unknown). We
// never silently fall back to a paid plan when the mapping fails.
function planFromPriceId(priceId) {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_EMPIRE_CORE) return 'empire-core';
  if (priceId === process.env.STRIPE_PRICE_EMPIRE_PRO)  return 'empire-pro';
  return null;
}

// Only grants the paid plan when the subscription is in an active billing
// state. Anything else (canceled, past_due, unpaid, incomplete, etc.)
// downgrades to 'free' so dashboard gates can trust a single field.
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

// Stripe sends current_period_end as unix seconds. Convert to a Firestore
// Timestamp when present; return null when missing so the field is omitted
// rather than written as an invalid value.
function periodEndTimestamp(subscription) {
  const seconds = subscription && subscription.current_period_end;
  if (typeof seconds !== 'number' || !isFinite(seconds)) return null;
  return admin.firestore.Timestamp.fromMillis(seconds * 1000);
}

// Look up the user document by Stripe customer id for subscription.* events
// where we don't have a uid directly. checkout.session.completed has a
// client_reference_id / metadata.uid, so it skips this path.
async function getUserByCustomer(customerId) {
  if (!customerId) return null;
  const snap = await db.collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();
  return snap.empty ? null : snap.docs[0];
}

// Admin writes bypass Firestore rules so the protected plan/billing fields
// (blocked from client writes in firestore.rules) are only set here.
async function updateUser(uid, data) {
  await db.collection('users').doc(uid).set(
    Object.assign({}, data, { updatedAt: admin.firestore.FieldValue.serverTimestamp() }),
    { merge: true }
  );
}

// Build the plan/status payload from a Stripe Subscription object. Optional
// `metadataPlanFallback` is only consulted when the price id cannot be
// resolved (env var missing). We still require the status to be active or
// trialing before granting the paid plan, so a stale metadata value cannot
// upgrade a canceled subscription.
function buildSubscriptionWrite(subscription, opts) {
  opts = opts || {};
  const priceId = getSubscriptionPriceId(subscription);
  let planId = planFromPriceId(priceId);
  if (!planId && opts.metadataPlanFallback && ALLOWED_PLANS.indexOf(opts.metadataPlanFallback) >= 0) {
    planId = opts.metadataPlanFallback;
  }
  const status = (subscription && subscription.status) || 'none';
  const plan = normalizePlanForStatus(status, planId);

  const out = {
    subscriptionStatus: status,
    plan,
    stripeSubscriptionId: subscription && subscription.id ? subscription.id : null,
    stripePriceId: priceId || null
  };
  if (subscription && subscription.customer) {
    out.stripeCustomerId = subscription.customer;
  }
  const periodEnd = periodEndTimestamp(subscription);
  if (periodEnd) out.currentPeriodEnd = periodEnd;
  return out;
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
        // Prefer metadata.uid (Stage 33-B-2 wrote it) but fall back to the
        // long-standing client_reference_id so this still works for any
        // sessions created before the metadata change rolled out.
        const uid = (session.metadata && session.metadata.uid) || session.client_reference_id;
        if (!uid) {
          console.error('checkout.session.completed: missing uid');
          break;
        }
        // Retrieve the subscription so price id + real status + period end
        // come from Stripe rather than guesses. The old code wrote
        // status: 'active' + plan: 'empire-builder' here; this replaces both.
        let subscription = null;
        if (session.subscription) {
          try {
            subscription = await stripe.subscriptions.retrieve(session.subscription);
          } catch (e) {
            console.error('checkout.session.completed: subscription retrieve failed');
          }
        }
        const metadataPlanFallback = (session.metadata && session.metadata.planId) || null;
        const write = subscription
          ? buildSubscriptionWrite(subscription, { metadataPlanFallback })
          : {
              subscriptionStatus: 'active',
              plan: normalizePlanForStatus('active', metadataPlanFallback),
              stripeSubscriptionId: session.subscription || null,
              stripePriceId: null
            };
        if (session.customer && !write.stripeCustomerId) {
          write.stripeCustomerId = session.customer;
        }
        await updateUser(uid, write);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = stripeEvent.data.object;
        const metadataPlanFallback = (sub.metadata && sub.metadata.planId) || null;
        let uid = sub.metadata && sub.metadata.uid;
        if (!uid) {
          const userDoc = await getUserByCustomer(sub.customer);
          if (userDoc) uid = userDoc.id;
        }
        if (!uid) {
          console.error('customer.subscription.updated: no uid resolved');
          break;
        }
        await updateUser(uid, buildSubscriptionWrite(sub, { metadataPlanFallback }));
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = stripeEvent.data.object;
        let uid = sub.metadata && sub.metadata.uid;
        if (!uid) {
          const userDoc = await getUserByCustomer(sub.customer);
          if (userDoc) uid = userDoc.id;
        }
        if (!uid) {
          console.error('customer.subscription.deleted: no uid resolved');
          break;
        }
        // normalizePlanForStatus('canceled', anything) → 'free', so this
        // also handles the case where a downstream race had already written
        // an empire-core/pro plan.
        const priceId = getSubscriptionPriceId(sub);
        const write = {
          subscriptionStatus: 'canceled',
          plan: 'free',
          stripeSubscriptionId: sub.id || null,
          stripePriceId: priceId || null
        };
        if (sub.customer) write.stripeCustomerId = sub.customer;
        const periodEnd = periodEndTimestamp(sub);
        if (periodEnd) write.currentPeriodEnd = periodEnd;
        await updateUser(uid, write);
        break;
      }

      case 'invoice.payment_failed': {
        // Keep the existing past_due signal but also re-derive the plan
        // because past_due must not retain the paid plan in the dashboard.
        const invoice = stripeEvent.data.object;
        const userDoc = await getUserByCustomer(invoice.customer);
        if (!userDoc) {
          console.error('invoice.payment_failed: user not found');
          break;
        }
        await updateUser(userDoc.id, {
          subscriptionStatus: 'past_due',
          plan: 'free'
        });
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
