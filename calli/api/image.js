// Vercel Edge Function — proxies fal.ai image generation requests server-side
// so the fal.ai key never touches the browser.
//
// Set FAL_API_KEY in Vercel → Project Settings → Environment Variables.

export const config = { runtime: 'edge' };

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  'https://egavves.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await req.text();

  const upstream = await fetch('https://fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Key ${process.env.FAL_API_KEY}`,
    },
    body,
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      ...CORS_HEADERS,
    },
  });
}
