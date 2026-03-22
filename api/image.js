// Vercel Node.js serverless function — proxies fal.ai image generation.
// FAL_API_KEY must be set in Vercel → Project Settings → Environment Variables.

const ALLOWED_ORIGINS = [
  'https://egavves.github.io',
  'https://www.egavves.com',
  'https://egavves.com',
];

module.exports = async function handler(req, res) {
  // CORS headers on every response
  const origin = req.headers.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString();

  const upstream = await fetch('https://fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Key ${process.env.FAL_API_KEY}`,
    },
    body,
  });

  const data = await upstream.json();
  res.status(upstream.status).json(data);
};
