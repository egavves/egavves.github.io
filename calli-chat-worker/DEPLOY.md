# Calli Chat — Cloudflare Worker Deployment

One-time setup. Takes about 5 minutes.

## 1. Install Wrangler

```bash
npm install -g wrangler
wrangler login   # opens browser to authenticate with Cloudflare
```

## 2. Deploy the worker

```bash
cd calli-chat-worker
wrangler deploy
```

This gives you a URL like `https://calli-chat.YOUR_SUBDOMAIN.workers.dev`.

## 3. Set your Anthropic API key

```bash
wrangler secret put ANTHROPIC_API_KEY
# Paste your key when prompted — it's stored encrypted, never in code
```

## 4. Update the widget URL

Open `dashboards/calli-chat.js` and replace the placeholder on line 13:

```js
const WORKER_URL = 'https://calli-chat.YOUR_SUBDOMAIN.workers.dev';
```

## 5. Push to GitHub

```bash
git add dashboards/ calli-chat-worker/
git commit -m "Add Calli chatbot widget"
git push
```

## Notes

- The worker uses **Claude Haiku** (fast, cheap — ~$0.001 per conversation)
- Allowed origins are restricted to egavves.com and egavves.github.io
- The API key is stored as a Cloudflare secret, never exposed to the browser
- Cloudflare free tier allows 100,000 requests/day — more than enough
