// ═══════════════════════════════════════════════════════════════
// ETHOS EMPIRE — Cloudflare Worker
// Proxies HTTPS requests from the frontend to HTTP n8n server
// Deploy at: Workers & Pages → Create Worker → paste this code
// Route:     api.ethosempire.org/* → this worker
//
// DNS REQUIRED: Add an A record in Cloudflare DNS:
//   Name: n8n  |  Value: 163.192.34.151  |  Proxy: OFF (gray cloud)
// Cloudflare Workers cannot fetch raw IP addresses — must use hostname.
// ═══════════════════════════════════════════════════════════════

const N8N_BASE = 'http://n8n.ethosempire.org:5678';

// Only allow proxying images from these domains (prevents abuse)
const ALLOWED_IMAGE_HOSTS = ['image.pollinations.ai', 'pollinations.ai'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    // Image proxy: GET /img?url=https://image.pollinations.ai/...
    if (request.method === 'GET' && url.pathname === '/img') {
      const imageUrl = url.searchParams.get('url');
      if (!imageUrl) {
        return new Response('Missing url parameter', { status: 400 });
      }
      let parsed;
      try {
        parsed = new URL(imageUrl);
      } catch {
        return new Response('Invalid url parameter', { status: 400 });
      }
      if (!ALLOWED_IMAGE_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h))) {
        return new Response('Image host not allowed', { status: 403 });
      }
      try {
        const upstream = await fetch(imageUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EthosEmpireBot/1.0)' }
        });
        if (!upstream.ok) {
          return new Response('Image fetch failed', { status: 502 });
        }
        const contentType = upstream.headers.get('content-type') || 'image/jpeg';
        return new Response(upstream.body, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (err) {
        return new Response('Gateway error: ' + err.message, { status: 502 });
      }
    }

    // Only proxy POST to /webhook/*
    if (request.method !== 'POST' || !url.pathname.startsWith('/webhook/')) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      });
    }

    const target = N8N_BASE + url.pathname;

    let body;
    try {
      body = await request.text();
    } catch {
      return new Response(JSON.stringify({ error: 'Bad request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      });
    }

    try {
      const upstream = await fetch(target, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Gateway error', detail: err.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      });
    }
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
