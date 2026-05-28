const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
    )
  });
}
const db = admin.firestore();

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { uid, action, state } = body;
  if (!uid) return { statusCode: 400, headers, body: JSON.stringify({ error: 'uid required' }) };

  try {
    const ref = db.collection('users').doc(uid);

    if (action === 'read') {
      const doc = await ref.get();
      const planBuilderState = (doc.exists && doc.data().planBuilderState) ? doc.data().planBuilderState : null;
      return { statusCode: 200, headers, body: JSON.stringify({ state: planBuilderState }) };
    }

    if (action === 'write') {
      if (!state) return { statusCode: 400, headers, body: JSON.stringify({ error: 'state required' }) };
      await ref.set({ planBuilderState: state }, { merge: true });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (action === 'clear') {
      await ref.update({ planBuilderState: admin.firestore.FieldValue.delete() });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'action must be read, write, or clear' }) };
  } catch (err) {
    console.error('plan-state error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
