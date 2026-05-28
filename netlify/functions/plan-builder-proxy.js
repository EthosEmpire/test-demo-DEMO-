const http = require('http');

const N8N_WEBHOOK = 'http://163.192.34.151:5678/webhook/plan-builder';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const result = await new Promise((resolve) => {
    const data = JSON.stringify(body);
    const url = new URL(N8N_WEBHOOK);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => { raw += c; });
      res.on('end', () => {
        try { resolve({ ok: true, body: raw, status: res.statusCode }); }
        catch { resolve({ ok: false, body: '{}', status: 500 }); }
      });
    });
    req.on('error', (err) => resolve({ ok: false, body: JSON.stringify({ error: err.message }), status: 502 }));
    req.setTimeout(25000, () => { req.destroy(); resolve({ ok: false, body: JSON.stringify({ error: 'timeout' }), status: 504 }); });
    req.write(data);
    req.end();
  });

  return {
    statusCode: result.status,
    headers,
    body: result.body
  };
};
