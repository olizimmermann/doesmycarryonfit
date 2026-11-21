// Usage beacon: GET /status?event=...  ->  204, one sanitised JSON log line.
// Replaces the nginx `location = /status` + access-log pipeline.
// Only /status reaches this Worker (see run_worker_first in wrangler.jsonc).

const ENUMS = {
  event:  ['pageview', 'check', 'preset', 'unit', 'class', 'filter', 'copy_link'],
  unit:   ['cm', 'in'],
  cls:    ['economy', 'business'],
  filter: ['all', 'pass', 'fail'],
};
// name -> [min, max]; anything outside is dropped
const NUMBERS = {
  h: [0, 500], w: [0, 500], d: [0, 500], weight: [0, 200],
  pass: [0, 1000], fail: [0, 1000],
};
const PRESET_RE = /^[a-z0-9_-]{1,40}$/i;

const NO_STORE = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

// Whitelist-only parsing: unknown keys and malformed values never reach the log,
// so the query string cannot be used for log injection or to stuff arbitrary data.
function sanitise(params) {
  const out = {};
  for (const [key, allowed] of Object.entries(ENUMS)) {
    const v = params.get(key);
    if (v !== null && allowed.includes(v)) out[key] = v;
  }
  for (const [key, [min, max]] of Object.entries(NUMBERS)) {
    const raw = params.get(key);
    if (raw === null || !/^\d{1,4}(\.\d{1,3})?$/.test(raw)) continue;
    const n = Number(raw);
    if (n >= min && n <= max) out[key] = n;
  }
  const preset = params.get('preset');
  if (preset !== null && PRESET_RE.test(preset)) out.preset = preset;
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Defensive: if routing ever sends something else here, serve the asset.
    if (url.pathname !== '/status') return env.ASSETS.fetch(request);

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response(null, { status: 405, headers: { ...NO_STORE, Allow: 'GET, HEAD' } });
    }

    // The IP is used only as the rate-limit key; it is never logged.
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (env.BEACON_LIMITER) {
      const { success } = await env.BEACON_LIMITER.limit({ key: ip });
      if (!success) return new Response(null, { status: 429, headers: NO_STORE });
    }

    const data = sanitise(url.searchParams);
    if (data.event) {
      // Country is coarse, non-identifying, and added by Cloudflare's edge.
      const country = request.cf?.country;
      if (typeof country === 'string' && /^[A-Z0-9]{2}$/.test(country)) data.country = country;
      console.log(JSON.stringify(data));
    }

    return new Response(null, { status: 204, headers: NO_STORE });
  },
};
