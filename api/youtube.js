// Vercel Node.js serverless function — proxies YouTube Data API v3 requests.
// YOUTUBE_API_KEY must be set in Vercel → Project Settings → Environment Variables.

const ALLOWED_ORIGINS = [
  'https://egavves.github.io',
  'https://www.egavves.com',
  'https://egavves.com',
];

const YT_API = 'https://www.googleapis.com/youtube/v3';

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return res.status(500).json({ error: 'YOUTUBE_API_KEY not configured' });

  // Parse body
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = JSON.parse(Buffer.concat(chunks).toString());

  const { type, value, maxResults = 50 } = body;
  if (!type || !value) return res.status(400).json({ error: 'Missing type/value' });

  try {
    // Step 1: Resolve channel ID
    let channelId = '';
    let channelTitle = '';

    if (type === 'id') {
      channelId = value;
    } else if (type === 'handle') {
      // @handle → use forHandle parameter
      const handle = value.startsWith('@') ? value : `@${value}`;
      const r = await fetch(`${YT_API}/channels?part=snippet&forHandle=${encodeURIComponent(handle)}&key=${key}`);
      const d = await r.json();
      if (!d.items || !d.items.length) return res.status(404).json({ error: `Channel not found for handle ${handle}` });
      channelId = d.items[0].id;
      channelTitle = d.items[0].snippet.title;
    } else {
      // custom name or user — search for it
      const r = await fetch(`${YT_API}/search?part=snippet&type=channel&q=${encodeURIComponent(value)}&maxResults=1&key=${key}`);
      const d = await r.json();
      if (!d.items || !d.items.length) return res.status(404).json({ error: `Channel not found for ${value}` });
      channelId = d.items[0].snippet.channelId;
      channelTitle = d.items[0].snippet.channelTitle;
    }

    // Get channel title if we don't have it yet
    if (!channelTitle) {
      const r = await fetch(`${YT_API}/channels?part=snippet&id=${channelId}&key=${key}`);
      const d = await r.json();
      if (d.items && d.items.length) channelTitle = d.items[0].snippet.title;
    }

    // Step 2: Get uploads playlist ID
    const chResp = await fetch(`${YT_API}/channels?part=contentDetails&id=${channelId}&key=${key}`);
    const chData = await chResp.json();
    if (!chData.items || !chData.items.length) return res.status(404).json({ error: 'Channel not found' });
    const uploadsId = chData.items[0].contentDetails.relatedPlaylists.uploads;

    // Step 3: Paginate through uploads playlist
    const allVideoIds = [];
    let pageToken = '';
    const cap = Math.min(maxResults, 500); // safety cap
    while (allVideoIds.length < cap) {
      const pageSize = Math.min(50, cap - allVideoIds.length);
      let url = `${YT_API}/playlistItems?part=contentDetails&playlistId=${uploadsId}&maxResults=${pageSize}&key=${key}`;
      if (pageToken) url += `&pageToken=${pageToken}`;
      const r = await fetch(url);
      const d = await r.json();
      if (!d.items) break;
      for (const item of d.items) {
        allVideoIds.push(item.contentDetails.videoId);
      }
      pageToken = d.nextPageToken || '';
      if (!pageToken) break;
    }

    // Step 4: Get video details in batches of 50
    const videos = [];
    for (let i = 0; i < allVideoIds.length; i += 50) {
      const batch = allVideoIds.slice(i, i + 50);
      const r = await fetch(`${YT_API}/videos?part=snippet,statistics,contentDetails&id=${batch.join(',')}&key=${key}`);
      const d = await r.json();
      if (d.items) {
        for (const v of d.items) {
          videos.push({
            id: v.id,
            title: v.snippet.title,
            publishedAt: v.snippet.publishedAt,
            thumbnail: (v.snippet.thumbnails.high || v.snippet.thumbnails.medium || v.snippet.thumbnails.default || {}).url || '',
            views: v.statistics.viewCount || '0',
            likes: v.statistics.likeCount || '0',
            comments: v.statistics.commentCount || '0',
            duration: v.contentDetails.duration || '',
          });
        }
      }
    }

    res.status(200).json({ channelId, channelTitle, videos });
  } catch (e) {
    console.error('YouTube API error:', e);
    res.status(500).json({ error: e.message || 'Internal error' });
  }
};
