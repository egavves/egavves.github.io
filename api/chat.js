// Vercel Node.js serverless function — proxies Anthropic API requests.
// ANTHROPIC_API_KEY must be set in Vercel → Project Settings → Environment Variables.

module.exports = async function handler(req, res) {
  // CORS headers on every response
  res.setHeader('Access-Control-Allow-Origin',  'https://egavves.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, anthropic-version');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Collect request body
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString();

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':       'application/json',
      'x-api-key':          process.env.ANTHROPIC_API_KEY,
      'anthropic-version':  '2023-06-01',
    },
    body,
  });

  res.status(upstream.status);
  res.setHeader('Content-Type', upstream.headers.get('Content-Type') || 'application/json');

  // Pipe response — handles both streaming SSE and plain JSON
  const reader = upstream.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(value);
  }
  res.end();
};
