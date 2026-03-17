/**
 * Calli Chat — Cloudflare Worker
 * Proxies Claude API calls for the Calli Labs dashboard chatbot.
 *
 * Deploy with: wrangler deploy
 * Set secret:  wrangler secret put ANTHROPIC_API_KEY
 */

const ALLOWED_ORIGINS = [
  'https://egavves.com',
  'https://www.egavves.com',
  'https://egavves.github.io',
  'http://localhost',
  'http://127.0.0.1',
  'null', // file:// origins (local HTML testing)
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.some(o => origin?.startsWith(o));
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    // ── Preflight ──────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // ── Parse body ─────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    const { messages, systemContext } = body;
    if (!messages || !Array.isArray(messages)) {
      return new Response('Missing messages', { status: 400 });
    }

    // ── Build system prompt ────────────────────────────────────
    const system = buildSystemPrompt(systemContext || {});

    // ── Call Claude (streaming) ────────────────────────────────
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        stream: true,
        system,
        messages,
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      return new Response(`Anthropic error: ${err}`, {
        status: anthropicResponse.status,
        headers: corsHeaders(origin),
      });
    }

    // ── Stream back SSE ────────────────────────────────────────
    return new Response(anthropicResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
        ...corsHeaders(origin),
      },
    });
  },
};

// ── System prompt builder ──────────────────────────────────────
function buildSystemPrompt({ dashboard, feature, format, metric, correlations, description }) {
  const dashboardDescriptions = {
    cut: 'CUT Channel Dashboard — performance analytics for the CUT YouTube channel (482 videos, 22 caption/sentiment features, 6 formats: Button, Truth or Drink, Lineup, Fear Pong, etc.)',
    cinematheque: 'Cinematheque Explorer — feature distribution inspector for a movie collection (11 extracted features, 6 genres: Horror, Sci-Fi, Drama, Comedy, Thriller, Action)',
    vault: 'Feature Vault — master taxonomy of 170+ signals Calli Labs can measure across scripted features, unscripted social video, awards content, and universal formats',
    index: 'Calli Labs Intelligence Hub — overview of all dashboards and collections',
  };

  const dashboardContext = dashboardDescriptions[dashboard] || dashboard || 'Calli Labs dashboard';

  let contextBlock = '';
  if (feature) contextBlock += `\nCurrently selected feature: ${feature}`;
  if (format && format !== 'ALL') contextBlock += `\nActive format filter: ${format}`;
  if (metric) contextBlock += `\nActive performance metric (Y-axis): ${metric}`;
  if (correlations) {
    const entries = Object.entries(correlations)
      .map(([k, v]) => `  ${k}: r=${v.r > 0 ? '+' : ''}${v.r.toFixed(3)} (n=${v.n})`)
      .join('\n');
    contextBlock += `\nCorrelations for "${feature}" vs all metrics:\n${entries}`;
  }
  if (description) contextBlock += `\nFeature description: ${description}`;

  return `You are Calli, an AI analyst embedded in Calli Labs' creative intelligence platform. Calli Labs extracts ML-derived signals from video content to help creators and studios understand what drives viewer engagement.

CURRENT DASHBOARD: ${dashboardContext}
${contextBlock}

YOUR ROLE:
- Explain what features mean and how they're computed from video/audio/caption data
- Interpret correlation values and distributions — including what weak correlations actually tell us
- Surface non-obvious insights and patterns
- Guide users through the analysis without overwhelming them
- Be honest about the limits of the data (sample sizes, confounds, etc.)

TONE: Concise, precise, data-grounded. No filler phrases. Think like a research scientist who also understands creative production. When asked about a specific feature, always connect it back to the creative/production reality behind the numbers.`;
}
