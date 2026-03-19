/**
 * calli-tour.js — Calli Labs Interactive Guided Tour System
 * ──────────────────────────────────────────────────────────
 * Provides a step-by-step spotlight tour for every dashboard.
 * Three detail levels: quick (~2 min) · standard (~5 min) · deep dive (~10 min).
 *
 * Public API:
 *   CALLI_TOUR.launch()          — show level-picker modal, then start
 *   CALLI_TOUR.start('standard') — skip picker, start at given level
 *   CALLI_TOUR.next()            — advance to next step
 *   CALLI_TOUR.prev()            — go to previous step
 *   CALLI_TOUR.finish()          — close tour
 */

(function (global) {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  //  STYLES  (injected once into <head>)
  // ─────────────────────────────────────────────────────────────────────────
  const TOUR_CSS = `
/* ── Spotlight overlay ──────────────────────────────────────────── */
.ct-overlay {
  position: fixed; inset: 0; z-index: 9000;
  pointer-events: all; transition: background .25s;
}
.ct-highlight {
  position: fixed; z-index: 9001; pointer-events: none;
  border-radius: 8px;
  border: 2px solid rgba(167,139,250,.8);
  box-shadow: 0 0 0 9999px rgba(6,10,18,.78),
              0 0 0 4px rgba(167,139,250,.18);
  transition: top .28s cubic-bezier(.4,0,.2,1),
              left .28s cubic-bezier(.4,0,.2,1),
              width .28s cubic-bezier(.4,0,.2,1),
              height .28s cubic-bezier(.4,0,.2,1);
}

/* ── Tooltip card ───────────────────────────────────────────────── */
.ct-tooltip {
  position: fixed; z-index: 9002;
  width: 340px; max-width: calc(100vw - 32px);
  background: #1a1d2e;
  border: 1px solid rgba(167,139,250,.32);
  border-radius: 14px;
  padding: 20px 22px 16px;
  box-shadow: 0 16px 56px rgba(0,0,0,.65), 0 0 0 1px rgba(167,139,250,.1);
  pointer-events: all;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #e2e4f0;
  transition: top .28s cubic-bezier(.4,0,.2,1),
              left .28s cubic-bezier(.4,0,.2,1),
              opacity .18s;
}
.ct-progress-row {
  display: flex; align-items: center; gap: 8px;
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: #7a7f9a; margin-bottom: 11px;
}
.ct-dots { display: flex; gap: 4px; margin-left: auto; flex-wrap: wrap; max-width: 130px; }
.ct-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #2d3155; flex-shrink: 0; transition: background .2s;
}
.ct-dot.done   { background: #4c4480; }
.ct-dot.active { background: #a78bfa; box-shadow: 0 0 0 2px rgba(167,139,250,.35); }

.ct-tooltip-title {
  font-size: 14px; font-weight: 700; color: #a78bfa; margin-bottom: 9px;
  line-height: 1.35;
}
.ct-tooltip-text {
  font-size: 12px; line-height: 1.7; color: #c4c7da; margin-bottom: 0;
}
.ct-tooltip-tip {
  font-size: 11px; color: #7a7f9a; line-height: 1.6;
  padding: 7px 9px; margin-top: 11px;
  background: rgba(45,212,191,.05);
  border-left: 2px solid rgba(45,212,191,.4);
  border-radius: 0 5px 5px 0;
}
.ct-tooltip-footer {
  display: flex; align-items: center; gap: 7px; margin-top: 15px;
  border-top: 1px solid rgba(167,139,250,.1); padding-top: 12px;
}
.ct-btn {
  padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700;
  cursor: pointer; font-family: inherit; border: 1px solid; transition: all .15s;
  white-space: nowrap;
}
.ct-btn-skip {
  background: transparent; border-color: transparent;
  color: #7a7f9a; font-size: 11px; font-weight: 400; padding: 6px 4px;
}
.ct-btn-skip:hover { color: #e2e4f0; }
.ct-btn-prev {
  background: transparent; border-color: rgba(167,139,250,.3); color: #7a7f9a;
}
.ct-btn-prev:hover { color: #a78bfa; border-color: rgba(167,139,250,.6); }
.ct-btn-next {
  background: linear-gradient(135deg, #7c6af7, #a78bfa);
  border-color: transparent; color: #fff; margin-left: auto;
}
.ct-btn-next:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(124,106,247,.5);
}
.ct-btn-next:active { transform: scale(.97); }

/* ── Level picker modal ─────────────────────────────────────────── */
.ct-picker-wrap {
  position: fixed; inset: 0; z-index: 9100;
  display: flex; align-items: center; justify-content: center;
  background: rgba(6,10,18,.84);
  pointer-events: all;
  font-family: 'Segoe UI', system-ui, sans-serif;
  animation: ct-fade-in .2s ease;
}
@keyframes ct-fade-in { from { opacity:0 } to { opacity:1 } }
.ct-picker-card {
  background: #1a1d2e; border: 1px solid rgba(167,139,250,.28);
  border-radius: 18px; padding: 32px 36px;
  width: 420px; max-width: calc(100vw - 32px);
  box-shadow: 0 28px 72px rgba(0,0,0,.6), 0 0 0 1px rgba(167,139,250,.1);
}
.ct-picker-title {
  font-size: 17px; font-weight: 700; color: #a78bfa; margin-bottom: 3px;
}
.ct-picker-sub { font-size: 12px; color: #7a7f9a; margin-bottom: 22px; line-height: 1.55; }
.ct-level-options { display: flex; flex-direction: column; gap: 9px; margin-bottom: 22px; }
.ct-level-opt {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 16px; border-radius: 11px; cursor: pointer;
  border: 1px solid #2d3155; background: #232638; transition: all .15s;
  user-select: none;
}
.ct-level-opt:hover { border-color: rgba(167,139,250,.4); background: rgba(167,139,250,.07); }
.ct-level-opt.selected {
  border-color: rgba(167,139,250,.55);
  background: rgba(167,139,250,.1);
  box-shadow: 0 0 0 1px rgba(167,139,250,.2);
}
.ct-level-icon { font-size: 22px; flex-shrink: 0; }
.ct-level-name { font-size: 13px; font-weight: 700; color: #e2e4f0; }
.ct-level-desc { font-size: 11px; color: #7a7f9a; margin-top: 2px; }
.ct-picker-footer { display: flex; gap: 10px; justify-content: flex-end; }
.ct-picker-start {
  padding: 9px 24px; border-radius: 20px; font-size: 13px; font-weight: 700;
  cursor: pointer; font-family: inherit;
  background: linear-gradient(135deg,#7c6af7,#a78bfa);
  border: none; color: #fff; transition: all .15s;
}
.ct-picker-start:hover {
  transform: translateY(-1px); box-shadow: 0 4px 18px rgba(124,106,247,.55);
}
.ct-picker-cancel {
  padding: 9px 18px; border-radius: 20px; font-size: 13px; cursor: pointer;
  font-family: inherit; background: transparent;
  border: 1px solid rgba(167,139,250,.28); color: #7a7f9a; transition: all .15s;
}
.ct-picker-cancel:hover { color: #e2e4f0; border-color: rgba(167,139,250,.5); }

/* ── Nav tour button ────────────────────────────────────────────── */
.nav-tour-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 3px 11px; border-radius: 12px; font-size: 11px; font-weight: 600;
  cursor: pointer; font-family: inherit;
  border: 1px solid rgba(167,139,250,.35);
  background: rgba(167,139,250,.08); color: #a78bfa;
  transition: all .15s; white-space: nowrap; flex-shrink: 0;
}
.nav-tour-btn:hover {
  background: rgba(167,139,250,.18); border-color: rgba(167,139,250,.6);
  box-shadow: 0 0 10px rgba(167,139,250,.2);
}
`;

  // ─────────────────────────────────────────────────────────────────────────
  //  TOUR STEP DEFINITIONS  (per dashboard)
  //
  //  Step fields:
  //    target  — CSS selector of element to spotlight (null = centered modal)
  //    title   — bold heading
  //    text    — main explanation
  //    tip     — optional pro tip (teal callout)
  //    pos     — tooltip position relative to target: top|bottom|left|right|center
  //    levels  — which detail levels include this step: ['quick','standard','deep']
  // ─────────────────────────────────────────────────────────────────────────
  const TOURS = {

    // ── Project Home ──────────────────────────────────────────────────────
    'home': {
      name: 'Project Home',
      subtitle: 'A complete tour of the CUT analytics platform — start here',
      steps: [
        {
          target: null,
          title: '🏠 Welcome to Calli Labs Analytics',
          text: 'Welcome to the <strong>CUT Analytics Platform</strong> — a suite of tools that helps your team understand what makes your videos perform, and turn those insights into better content. Start here to browse all your videos, then use the dashboards in the top bar to explore the data behind them.',
          tip: 'You don\'t need to be a data person to use this. Everything is designed to give plain-English answers to questions like: what formats work best? What should the thumbnail look like? What should we make next?',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
        {
          target: 'nav.unified-nav',
          title: '🧭 The Navigation Bar',
          text: 'The top bar is how you move around the platform. On the left: switch between projects (CUT, Cinematheque, and more). On the right: <strong>📚 Vault</strong> is your glossary, <strong>🌐 Social Pulse</strong> tracks online buzz, and the <strong>AI</strong> section holds six analysis tools built from your video data.',
          tip: 'The ⚙️ gear icon opens Settings — paste your Anthropic API key there once, and the Calliope AI assistant becomes available on every page.',
          pos: 'bottom',
          levels: ['quick','standard','deep'],
        },
        {
          target: '.toolbar',
          title: '🔍 Search, Filter & Sort',
          text: 'Use the <strong>search box</strong> to find any video by title instantly. The <strong>format filter</strong> narrows to just one series — Truth or Drink, Lineup, Fear Pong, and so on. The <strong>sort</strong> option reorders by views, watch time, likes, or revenue.',
          tip: 'Try combining all three: filter to "Truth or Drink", sort by Retention, and search for "couples" — you\'ll immediately see which couples episodes hold attention the longest.',
          pos: 'bottom',
          levels: ['quick','standard','deep'],
        },
        {
          target: '.page-hdr',
          title: '📊 Dataset Summary Stats',
          text: 'These four numbers at the top summarise the whole dataset at a glance: total videos, combined views, average early watch time, and number of formats. They update live as you search or filter — so you can instantly compare, say, how Fear Pong performs vs. Lineup.',
          tip: '"30s Retention" is the share of viewers who are still watching after 30 seconds. YouTube\'s algorithm uses this as an early signal of quality — the higher, the better.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '.vcard',
          title: '🎬 Video Cards',
          text: 'Each card shows the thumbnail, title, format, and duration. Below that: four performance numbers — <em>Views</em>, <em>Early Retention</em> (how many people kept watching past the first 30 seconds), <em>Likes</em>, and <em>Avg Watch %</em> (what fraction of the video people watched on average). Hover to see the play button; click to open the video on YouTube.',
          tip: 'A video with modest views but high watch % is often an underrated gem — it means the audience who found it loved it. Those are great candidates to remake or promote more aggressively.',
          pos: 'right',
          levels: ['standard','deep'],
        },
        {
          target: 'a.nav-chip[href="calli_feature_vault_v2.html"]',
          title: '📚 The Vault',
          text: 'The <strong>📚 Vault</strong> is a plain-English glossary of every signal the platform tracks — over 170 measurements covering things like how loud the audio is, how many faces appear, what emotions show up in speech, how long the intro takes, and much more.',
          tip: 'Whenever you see an unfamiliar term in any dashboard, come here first. Every metric is explained in everyday language with a practical example of what it means for your content.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: 'a.nav-chip[href="social_media_dashboard.html"]',
          title: '🌐 Social Pulse',
          text: '<strong>Social Pulse</strong> shows what people are saying about your content and related topics right now — across Twitter/X, Reddit, Google Trends, and news sites. It\'s your early-warning system for trending conversations, audience reactions, and what topics are heating up that your next video could tap into.',
          tip: 'A green badge in the top-right means the live feed is active. If it\'s red, ask your tech team to start the local data connection (one terminal command).',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#calliope-fab',
          title: '🤖 Ask Calliope — AI Chatbot',
          text: 'This purple button opens <strong>Calliope</strong>, your AI guide built into every page. Just type a question in plain English — things like "which format has the best watch time?", "why is this video underperforming?", or "what should we make next?" — and Calliope will answer using the actual data from the current page.',
          tip: 'To activate Calliope, open ⚙️ Settings (top-left gear) and paste your Anthropic API key. It stays saved in your browser and is never shared with anyone.',
          pos: 'top',
          levels: ['quick','standard','deep'],
        },
        {
          target: '.nav-ai-label',
          title: '🔬 The AI Analysis Suite',
          text: 'These six tools crunch through all your video data and surface insights you can act on — without needing to understand the maths behind them. Think of them as a pipeline: the first three dig through the numbers, the fourth packages the results into clear recommendations, the fifth checks whether those recommendations hold up in real life, and the sixth turns them into a creative brief.',
          tip: 'Start with the <strong>Executive Summary</strong> — it skips straight to the conclusions. The other dashboards are there when you want to dig deeper into why a recommendation was made.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: 'a.nav-chip[href="cut_correlations.html"]',
          title: '🔬 Correlations',
          text: 'Click here to open <strong>Correlations</strong> — the first pass through your data. It scans over 170 things we measure in your videos (audio energy, thumbnail face size, how fast the hook lands, topic, format, and much more) and checks which ones tend to go hand-in-hand with better views, longer watch time, or higher revenue. The strongest patterns rise to the top.',
          tip: 'A pattern here doesn\'t automatically mean cause and effect — it might just be a coincidence. The next two tools (LASSO and Random Forest) double-check which patterns are robust before we act on them.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: 'a.nav-chip[href="cut_lasso_analysis.html"]',
          title: '📐 LASSO',
          text: 'Click here to open <strong>LASSO</strong> — a second opinion that filters out noise. Where Correlations finds hundreds of possible patterns, LASSO asks a stricter question: which signals <em>actually</em> help predict performance when you account for everything else at the same time? It throws out weak signals and keeps only the ones that genuinely matter. Bars pointing right = positive effect; bars pointing left = negative effect; no bar = this signal didn\'t make the cut.',
          tip: 'Think of LASSO as the editor of the data story — it removes redundant clues and gives you the shortest reliable list of things worth paying attention to.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: 'a.nav-chip[href="cut_rf_shap.html"]',
          title: '🌲 Random Forest',
          text: 'Click here to open <strong>Random Forest</strong> — a third check that catches subtler patterns. Some things only matter in combination (e.g. a fast hook <em>and</em> a high-energy audio track). This tool picks those up where the others miss them. The chart shows which video signals had the biggest influence on performance across your catalogue, and whether having more or less of each signal tends to help or hurt.',
          tip: 'Don\'t worry about the technical name — just look at which signals appear at the top of the chart and whether their dots lean right (good) or left (bad). That\'s the actionable read.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: 'a.nav-chip[href="exec_summary.html"]',
          title: '✦ Executive Summary',
          text: 'Click here to open the <strong>Executive Summary</strong> — the place where all the number-crunching turns into plain recommendations. After running all three analyses, our algorithm identifies the strongest patterns and packages them as 47 insights, each with a confidence level: 🥇 <em>Gold</em> means we\'re very confident, 🥈 <em>Silver</em> is solid evidence, 🥉 <em>Bronze</em> is a promising lead worth keeping an eye on. Each insight also comes with a suggested experiment so you can test it with real videos.',
          tip: 'This is the best place to start every production meeting. Filter to Gold for the highest-confidence wins. Use all tiers when you\'re brainstorming new episode ideas.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: 'a.nav-chip[href="hypothesis_validation.html"]',
          title: '🧪 Hypothesis Validation',
          text: 'Click here to open <strong>Validation</strong> — the reality check. Once the Executive Summary suggests an insight (e.g. &ldquo;larger faces in thumbnails get more clicks&rdquo;), this is where you test it for real. Make a few videos that follow the insight, a few that don\'t, and log the results here. The platform then tells you whether the difference you saw is a real pattern or just luck.',
          tip: 'You don\'t need dozens of videos. Even 3–5 videos that follow the insight vs. 3–5 that don\'t can be enough to get a meaningful answer.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: 'a.nav-chip[href="ideation_dashboard.html"]',
          title: '💡 Ideation Studio',
          text: 'Click here to open the <strong>Ideation Studio</strong> — where data becomes a creative brief. Pick one or more insights from the Executive Summary, choose a format, and Claude AI writes a full episode concept: story beats, casting suggestions, title options, thumbnail ideas, and more — with each creative choice linked back to the insight that inspired it. Export as PDF or PowerPoint to hand straight to your production team.',
          tip: 'Pick 2–3 insights for a focused concept. Pick more to explore bolder experimental ideas. Use the Quick mode for a fast brainstorm; Full mode when you want a fully developed brief for a priority episode.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '.tour-fab',
          title: '🎓 Tutorials on Every Dashboard',
          text: 'This button launches a guided walkthrough for whatever page you\'re on. Every dashboard has its own tour with three lengths: <em>⚡ Quick</em> (a 2-minute overview), <em>📖 Standard</em> (a 5-minute full explanation), and <em>🔬 Deep Dive</em> (everything, including tips and edge cases). You can open it any time — it\'s always safe to run.',
          tip: 'Quick is great for a refresher. Standard is perfect for onboarding a colleague. Deep Dive is for when you really want to understand every detail of a dashboard.',
          pos: 'top',
          levels: ['quick','standard','deep'],
        },
      ],
    },

    // ── Social Pulse ──────────────────────────────────────────────────────
    'social-pulse': {
      name: 'Social Pulse',
      subtitle: 'Learn to track cross-platform buzz for your show in real time',
      steps: [
        {
          target: null,
          title: '🌐 Welcome to Social Pulse',
          text: 'Social Pulse aggregates live signals from Twitter/X, Reddit, Google Trends, news outlets, and your tracked Key Opinion Leaders — all in one view. Every panel refreshes from a lightweight proxy running on your machine. Nothing leaves your network except the API calls.',
          tip: 'All 6 panels update simultaneously when you run a search via Calliope. Start there.',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#proxyBadge',
          title: '🔌 Proxy Connection Badge',
          text: 'The proxy is a small Python server (social_proxy.py) running locally on your machine. It bridges this dashboard to external APIs — Reddit, Google News, Trends — bypassing browser security restrictions. Green = live data. Red = start the proxy: open a terminal, navigate to the dashboards folder, and run: <code>python social_proxy.py</code>',
          tip: 'Click the badge at any time to retry the connection. It caches results for 5 minutes to avoid hammering APIs.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#panel-reddit',
          title: '🟠 Reddit Panel',
          text: '"All Subs" shows hot posts from entertainment subreddits — r/movies, r/television, r/boxoffice, r/streaming, and more. Toggle the subreddit chips to filter which communities you\'re watching. "Search" queries all of Reddit for any keyword. Post score = net upvotes; sort is "hot" (recency + engagement blend).',
          tip: 'r/Letterboxd and r/TrueFilm are off by default — enable them for cinephile and critic-audience signals.',
          pos: 'left',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#panel-trends',
          title: '📊 Google Trends Panel',
          text: '"Interest" shows a 7-day trend chart for your keywords on a 0–100 normalized scale (100 = peak popularity in the period). "Rising" shows breakout queries — searches growing fastest around your topic right now. "Breakout" means >5,000% increase — an extremely strong signal.',
          tip: 'Compare up to 5 keywords at once using the custom input (comma-separated). Click any rising query to cross-search all panels.',
          pos: 'right',
          levels: ['standard','deep'],
        },
        {
          target: '#panel-news',
          title: '📰 News & Blogs Panel',
          text: 'Aggregates articles from Google News (hundreds of outlets via RSS) and your tracked KOL outlet feeds. "All" mixes both. "Trade" shows only your KOL outlets (Variety, THR, Billboard, etc.). Articles from tracked outlets show a ✦ KOL badge.',
          tip: 'The search box filters results: type your show name to see only relevant articles across all sources.',
          pos: 'left',
          levels: ['standard','deep'],
        },
        {
          target: '#panel-kol',
          title: '👥 KOL Radar — Key Opinion Leaders',
          text: 'KOL = Key Opinion Leader — the outlets and critics whose coverage shapes perception of your show. Variety, Billboard, Deadline, Hollywood Reporter, Pitchfork, Gold Derby, and others are pre-loaded. Click a chip to focus on that outlet\'s recent headlines. The list is saved to kol_list.json and persists across sessions.',
          tip: 'To add a new outlet: type "/track [name]" in Calliope. No RSS? The proxy falls back to Google News for that outlet.',
          pos: 'top',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#panel-cross',
          title: '🌐 Cross-Platform Intelligence',
          text: 'The convergence panel — signals from all platforms fused into one view. Three tabs: Tag Cloud (terms sized by momentum, colored by platform origin), Momentum (ranked table with cross-platform bonus), and Coverage (headlines + source breakdown). Terms appearing on multiple platforms simultaneously carry the strongest signal.',
          tip: 'Color key: 🟣 Purple = 3+ platforms · 🩵 Teal = 2 platforms · 🔵 Blue = Twitter · 🟠 Orange = Reddit · 🟢 Green = Trends. Click any term to cross-search.',
          pos: 'top',
          levels: ['quick','standard','deep'],
        },
        {
          target: '.calliope-fab',
          title: '✦ Ask Calliope — Your AI Guide',
          text: 'Click this button to open Calliope, your full AI chatbot. Ask anything about the dashboard — what a panel means, how to interpret a trend, or content strategy questions. For dashboard-wide search use <code>/search [topic]</code>. To add a KOL use <code>/track [outlet]</code>. Type <code>/help</code> to see all commands.',
          tip: 'Calliope remembers your full conversation history across sessions — you can pick up where you left off.',
          pos: 'top',
          levels: ['standard','deep'],
        },
        {
          target: '.info-btn',
          title: 'ⓘ Per-Panel Help Buttons',
          text: 'Every panel header has an ⓘ button. Click it to open a rich info popover explaining that panel\'s data sources, tabs, visual elements, and interaction tips — the quickest reference once you\'re working.',
          pos: 'bottom',
          levels: ['deep'],
        },
        {
          target: null,
          title: '🎓 You\'re ready to use Social Pulse',
          text: 'Click the Calliope button (bottom-right) and type <code>/search [your show name]</code> to search all 6 panels at once. Cross-search any term you see in the Tag Cloud or Rising panel by clicking it. The more you explore, the more intuitive the signal patterns become.',
          tip: 'Type /tour in Calliope to relaunch this tutorial at any time.',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
      ],
    },

    // ── Correlations ──────────────────────────────────────────────────────
    'correlations': {
      name: 'Correlation Analysis',
      subtitle: 'Discover which video features statistically predict performance',
      steps: [
        {
          target: null,
          title: '🔬 Welcome to Correlation Analysis',
          text: 'This dashboard measures the linear association between 80+ video features — transcript sentiment, pacing, audio energy, thumbnail signals, title language — and key performance outcomes like views, watch time, and CPM. It\'s the starting point for understanding what drives CUT\'s performance.',
          tip: 'Correlations are one of three methods used (alongside LASSO and Random Forest). Check all three before drawing conclusions.',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#sidebar',
          title: '📋 Feature Sidebar',
          text: 'All 80+ features are organized into color-coded groups: speech & transcript, audio energy, emotion, comment signals, geography, traffic sources, thumbnail, and title linguistics. Click any feature to select it and see its full analysis: correlation statistics, scatter plot, and example videos.',
          tip: 'Features with a green badge have |r| > 0.3 with at least one target — these are practically significant. Orange = moderate (0.15–0.3). Grey = weak.',
          pos: 'right',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#tgt-panel',
          title: '🎯 Performance Target Selector',
          text: 'Choose which outcome to correlate against: Views, Average View Duration, CPM, or Click-Through Rate. Switching targets reruns the entire analysis — the matrix, scatter plots, and sidebar rankings all update. Each target tells a different story about what drives performance.',
          tip: 'Views and Watch Duration often have different — sometimes opposing — feature drivers. Always check both.',
          pos: 'bottom',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#corrMatrix',
          title: '📊 Correlation Matrix',
          text: 'The heatmap shows Pearson r for every feature × target combination. Colour: green = positive correlation, red = negative. Intensity = strength. Click any cell to select that feature + target pair and see the scatter plot and exemplar videos below.',
          tip: 'Pearson r ranges from −1 to +1. |r| > 0.3 is practically significant. |r| > 0.5 is a strong signal. Values close to 0 mean no linear relationship (but non-linear effects may still exist — check Random Forest for those).',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#scatter-plot',
          title: '✦ Scatter Plot — Feature vs Target',
          text: 'Each dot is one CUT video, colored by format (Truth or Drink, Lineup, etc.). The trend line shows the linear fit; slope direction = sign of r. Hover a dot to see the video title and values. Click a dot to open the video on YouTube.',
          tip: 'Look for format-specific clusters — sometimes a correlation is driven entirely by one format. Use the format filter chips above to isolate subsets.',
          pos: 'right',
          levels: ['standard','deep'],
        },
        {
          target: '#format-bar-plot',
          title: '📐 Per-Format Breakdown',
          text: 'Shows the same Pearson r separately for each CUT format — Truth or Drink, Lineup, 100 People, vs. Strangers, etc. A feature may correlate positively overall but negatively within a specific format, revealing format-specific dynamics that the overall correlation hides.',
          tip: 'Formats with fewer than 10 videos show "n<10" — treat these with caution. The effect might be real or it might be noise from a small sample.',
          pos: 'left',
          levels: ['standard','deep'],
        },
        {
          target: '#feat-popup-overlay',
          title: '📁 Feature Detail Popup',
          text: 'Click any feature in the sidebar or any matrix cell to open this popup. It shows: the full feature definition (what it measures and how), correlation statistics for all targets, and exemplar videos — the 3 highest-scoring videos for this feature with YouTube thumbnails.',
          tip: 'The ⓘ button in the page title bar gives a full explainer on what Pearson r means and its limitations.',
          pos: 'center',
          levels: ['deep'],
        },
        {
          target: '.nav-chip',
          title: '🔗 Navigate Between Analysis Methods',
          text: 'The top nav connects all AI analysis dashboards. After exploring correlations here, go to LASSO to see which features survive regularisation, then Random Forest for non-linear importance. The Executive Summary synthesises all three into ranked hypotheses with confidence medals.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#calliope-widget',
          title: '✦ Ask Calliope Anything',
          text: 'Calliope is your full AI guide, trained on the CUT dataset and all analytical methods. Ask it to explain any correlation, compare features across methods, suggest content strategies based on the data, or walk you through how to interpret specific findings.',
          tip: 'Try: "What features most strongly correlate with watch time?" or "Why does silence_density correlate negatively?"',
          pos: 'top',
          levels: ['quick','standard','deep'],
        },
        {
          target: null,
          title: '🎓 You\'re ready to explore correlations',
          text: 'Start by selecting "Views" as your target, then click through features in the sidebar — start with the audio and speech groups. Look for features where |r| > 0.3 and where the format breakdown shows consistent direction. Then cross-reference your findings with LASSO and Random Forest for triangulated confidence.',
          tip: 'The Executive Summary dashboard shows which findings are confirmed by all three methods (Gold tier). Use it as your decision guide.',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
      ],
    },

    // ── LASSO ─────────────────────────────────────────────────────────────
    'lasso': {
      name: 'LASSO Stability Analysis',
      subtitle: 'Regularised feature selection with bootstrap stability scoring',
      steps: [
        {
          target: null,
          title: '📐 Welcome to LASSO Analysis',
          text: 'LASSO (Least Absolute Shrinkage and Selection Operator) is a regularised regression that forces most feature coefficients to exactly zero, keeping only the most important predictors. This dashboard runs LASSO on 200 bootstrap resamples of the CUT dataset to measure which features are <em>stably</em> selected — not just significant in one run.',
          tip: 'LASSO solves a key problem: with 80+ features and ~487 videos, standard regression overfits. LASSO\'s penalty term automatically discards noise features.',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#sidebar',
          title: '📋 Feature Sidebar',
          text: 'Features are grouped by category and ranked by their LASSO stability score for the currently selected performance target. Click any feature to load its full analysis: stability score, confidence interval, regularisation path, and exemplar videos.',
          tip: 'Features with a stability score ≥ 0.80 are highly reliable — they were selected in 80%+ of 200 bootstrap runs, meaning the result is robust to data perturbation.',
          pos: 'right',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#stab-bars',
          title: '🔢 Stability Score Bar Chart',
          text: 'The stability score is the fraction of 200 bootstrap LASSO runs in which this feature had a non-zero coefficient. Score of 0.9 = selected in 90% of runs. This is the most important number on this dashboard — it tells you how reliably the model chooses this feature under data perturbation.',
          tip: '≥ 0.80 = highly stable · 0.50–0.79 = moderate · < 0.50 = unstable (likely noise or multicollinear). The dashed red line at 0.5 marks the instability threshold.',
          pos: 'right',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#ci-chart',
          title: '📏 Bootstrap Coefficient Confidence Intervals',
          text: 'Built from 500 bootstrap resamples. For each resample LASSO is fit at the cross-validated λ. The 2.5th–97.5th percentile of resulting coefficients forms the 95% CI. If the CI excludes zero, the direction of the effect is reliable. Width reflects uncertainty — narrow CIs on large coefficients are the most actionable signals.',
          tip: 'Positive coefficient = higher feature value → higher outcome. Negative = inverse relationship. Magnitude is in standardised units (SD of target per SD of feature).',
          pos: 'right',
          levels: ['standard','deep'],
        },
        {
          target: '#path-chart',
          title: '🛤️ Regularisation Path',
          text: 'Shows how each feature\'s LASSO coefficient changes as the regularisation penalty (λ) increases from right (no penalty, all features included) to left (heavy penalty, only the strongest features survive). Features that persist to the far left are the most robust predictors.',
          tip: 'The vertical dotted line marks the cross-validated optimal λ — the penalty chosen by LASSO to minimise prediction error on held-out data.',
          pos: 'top',
          levels: ['standard','deep'],
        },
        {
          target: '#fmt-heatmap',
          title: '🟦 Format × Feature Heatmap',
          text: 'Shows LASSO coefficients broken down by CUT format (Truth or Drink, Lineup, 100 People, etc.). Each cell is the coefficient for that format\'s model. Look for features where all formats agree on direction — those are universal signals vs. format-specific effects.',
          tip: 'A feature that\'s strongly positive in Truth or Drink but near-zero in Lineup is a format-specific signal, not a universal driver. The Executive Summary will flag these nuances.',
          pos: 'top',
          levels: ['standard','deep'],
        },
        {
          target: '#insight-container',
          title: '💡 AI-Generated Insights',
          text: 'Calliope automatically synthesises the LASSO results into plain-language insights: which features are stably selected, what direction the effect goes, how confident we are, and what it means for content strategy. These update when you change the target or feature selection.',
          pos: 'bottom',
          levels: ['deep'],
        },
        {
          target: '#feat-popup-overlay',
          title: '📁 Feature Detail Popup',
          text: 'Click any feature in the sidebar to open this panel. It shows: full definition of what the feature measures, LASSO stability score and CI, and exemplar videos — the top 3 highest and lowest-scoring videos for this feature, with YouTube thumbnails that open on click.',
          pos: 'center',
          levels: ['deep'],
        },
        {
          target: '.nav-chip',
          title: '🔗 Triangulating Across Methods',
          text: 'LASSO is most powerful when combined with Correlation and Random Forest. LASSO handles multicollinearity well (it picks one feature from a correlated group). Correlation catches linear signals LASSO might penalise away. Random Forest catches non-linear interactions. Use all three.',
          tip: 'The Executive Summary dashboard synthesises all three into Gold (all agree) / Silver (two agree) / Bronze (one) hypotheses.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: null,
          title: '🎓 You\'re ready to explore LASSO',
          text: 'Start with the Views target and look at the top 10 stability scores. Features ≥ 0.80 are your most reliable signals. Then check the CIs — features with tight, non-zero CIs are your most actionable findings. Compare results to the Correlation dashboard to see where methods agree.',
          tip: 'Ask Calliope: "Which features are stably selected across all formats?" or "Compare LASSO and correlation top features."',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
      ],
    },

    // ── Random Forest / SHAP ──────────────────────────────────────────────
    'random-forest': {
      name: 'Random Forest + SHAP Analysis',
      subtitle: 'Non-linear feature importance with SHAP value interpretability',
      steps: [
        {
          target: null,
          title: '🌲 Welcome to Random Forest + SHAP',
          text: 'Random Forest is an ensemble of decision trees that captures non-linear interactions between features — relationships that correlation and LASSO cannot detect. SHAP (SHapley Additive exPlanations) then explains exactly how much each feature contributes to each prediction, making the "black box" interpretable.',
          tip: 'While LASSO selects a sparse set of features, Random Forest uses all features and scores their relative importance. Both perspectives are valuable for triangulation.',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#sidebar',
          title: '📋 Feature Sidebar',
          text: 'Features ranked by mean absolute SHAP value for the selected target. This is the most unbiased importance measure: it represents the average impact of each feature on predictions across the entire dataset. Click any feature to load its full analysis.',
          tip: 'Unlike Random Forest\'s built-in importance (which favours high-cardinality features), SHAP values are unbiased and account for feature interactions.',
          pos: 'right',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#chart-beeswarm',
          title: '🐝 SHAP Beeswarm Plot',
          text: 'The most information-dense view on this dashboard. Each dot is one video. Horizontal position = SHAP value (impact on prediction). Colour = feature value (red = high, blue = low). This lets you see not just how much a feature matters, but <em>which direction</em> — and whether high or low values are driving predictions up or down.',
          tip: 'A feature with red dots on the right means high feature values push predictions higher. Red dots on the left means high values push predictions down — a negative relationship the RF has detected non-linearly.',
          pos: 'right',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#chart-perm',
          title: '🔀 Permutation Importance',
          text: 'A cross-validation based importance measure: for each feature, the dataset is shuffled (destroying that feature\'s signal) and the drop in model accuracy is measured. Larger drop = more important feature. Error bars show variance across 30 permutation repeats.',
          tip: 'Permutation importance is slower to compute but less biased than SHAP for correlated features. Agree with SHAP = high confidence. Disagree = possible multicollinearity effect.',
          pos: 'right',
          levels: ['standard','deep'],
        },
        {
          target: '#dep-btns',
          title: '📈 Partial Dependence Plots',
          text: 'Click any button here to see how the model\'s predictions change as that feature\'s value increases — holding all other features constant. This reveals non-linear patterns: thresholds, saturation points, and U-shaped curves that flat correlation coefficients would miss entirely.',
          tip: 'Look for inflection points — e.g. if watch time plateaus above a certain speech rate, that\'s a ceiling to optimise within, not simply "higher speech rate = better."',
          pos: 'top',
          levels: ['standard','deep'],
        },
        {
          target: '#insight-container',
          title: '💡 AI-Generated Insights',
          text: 'Calliope synthesises the RF and SHAP results into plain-language takeaways: what the top features are, what direction they push predictions, whether effects are linear or non-linear, and what the CUT team should do about it. These update when you change targets.',
          pos: 'bottom',
          levels: ['deep'],
        },
        {
          target: '#feat-popup-overlay',
          title: '📁 Feature Detail Popup',
          text: 'Click any feature in the sidebar to open this panel. It shows: the full feature definition, mean |SHAP| value and rank, permutation importance rank, and exemplar videos — the 3 videos with the highest and lowest feature values, with thumbnails that open on YouTube.',
          pos: 'center',
          levels: ['deep'],
        },
        {
          target: '.nav-chip',
          title: '🔗 The Full Picture: Triangulation',
          text: 'Random Forest excels at non-linear relationships and interactions, but is harder to interpret than LASSO. Correlation gives the simplest linear signal. Together, the three methods form a triangulation: features confirmed by all three are the most reliable findings — those become Gold-tier hypotheses in the Executive Summary.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: null,
          title: '🎓 You\'re ready to explore RF + SHAP',
          text: 'Start with the beeswarm plot — look for features where red dots cluster on the right (positive effect of high values). Then check permutation importance to confirm. For your top features, open the partial dependence plot to understand the shape of the effect, not just its direction.',
          tip: 'Ask Calliope: "Explain the SHAP beeswarm for excitement_peaks_per_min" or "What non-linear effects does the RF find that LASSO misses?"',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
      ],
    },

    // ── Executive Summary ──────────────────────────────────────────────────
    'executive-summary': {
      name: 'Executive Summary',
      subtitle: 'Synthesised findings, confidence tiers, and content strategy recommendations',
      steps: [
        {
          target: null,
          title: '✦ Welcome to Executive Summary',
          text: 'This dashboard synthesises findings from all three analysis methods — Pearson correlation, LASSO stability selection, and Random Forest with SHAP — into a unified set of hypotheses. Each hypothesis is graded by how many methods independently confirmed it, giving you a robust, triangulated evidence base for content decisions.',
          tip: 'This is the "so what" dashboard — it translates statistical findings into actionable content hypotheses. Always validate interesting findings by clicking through to the source analysis.',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#stats-strip',
          title: '📊 Dataset Overview Strip',
          text: 'Shows the key numbers at a glance: total videos analysed, feature count, date range, performance targets, and analysis methods used. This frames the scope and statistical power of everything on this page.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#findings-grid',
          title: '🥇 Confidence Medal System',
          text: 'Every hypothesis is awarded a confidence medal based on cross-method agreement: <br><br>🥇 <strong>Gold</strong> — all three methods agree. Highest confidence; safest to act on immediately.<br>🥈 <strong>Silver</strong> — two methods agree. Strong signal; worth A/B testing.<br>🥉 <strong>Bronze</strong> — one method finds it. Suggestive but uncertain — gather more data.<br>💡 <strong>Background</strong> — platform knowledge, not statistical. No data support yet.',
          tip: 'Gold hypotheses represent the most robust findings in the entire analysis. Start your content experiments here.',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#conf-select',
          title: '🎚️ Confidence Filter',
          text: 'Filter hypotheses by confidence tier — show only Gold, Gold+Silver, or all tiers. For executive review, start with Gold only. For a creative brainstorm, show all tiers including Background hypotheses inspired by industry knowledge.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#fmt-pills',
          title: '🎬 Format Filter',
          text: 'Filter hypotheses by which CUT format they apply to — Truth or Drink, Lineup, 100 People, etc. Some features are format-universal; others are format-specific. Filtering helps teams working on a specific show type see only the most relevant recommendations.',
          tip: 'Showing "All Formats" will include hypotheses that may not apply to every format. Always check the format tag on each hypothesis card.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#tgt-pills',
          title: '🎯 Target Filter',
          text: 'Filter by performance outcome: Views, Watch Duration, CPM, or CTR. Different targets have different feature drivers — a feature that boosts raw views may not improve CPM, and vice versa. Use this to focus recommendations on the specific KPI you\'re optimising.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#hyp-grid .hyp-card:first-child',
          title: '📋 A Hypothesis Card',
          text: 'Each card shows: the <strong>category</strong> (e.g. Thumbnail, Speech, Discovery), a <strong>confidence medal</strong> (🥇 Gold = all 3 analysis methods agree), the <strong>recommended action</strong> in plain language, and a tagline that summarises the insight. Click "Show evidence" to see the full statistical detail and a ready-to-run A/B test.',
          tip: 'The coloured category badge (top-left) and the medal tell you at a glance how strong the evidence is and what area of your content it affects.',
          pos: 'right',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#hyp-grid .hyp-card:first-child',
          title: '🔬 Inside the Card — Expanded View',
          onEnter: function() {
            // Expand the first hypothesis card so the user sees its contents
            const expandBtn = document.querySelector('#hyp-grid .expand-btn');
            if (expandBtn && !expandBtn.classList.contains('open')) expandBtn.click();
          },
          text: 'Expanded, a card shows: <strong>Full detail</strong> — the reasoning behind the recommendation. <strong>Evidence list</strong> — the specific data signals (Pearson r, LASSO stability, RF importance) that support it. <strong>A/B Test blueprint</strong> — the exact test to run, what to vary, what to hold constant, and which metric to measure.',
          tip: 'The A/B test section is production-ready: it tells you the control condition, the treatment, the sample size needed, and the duration. You can hand this directly to your production team.',
          pos: 'right',
          levels: ['standard','deep'],
        },
        {
          target: '#load-more-btn',
          title: '⬇️ Load More Hypotheses',
          text: 'The dashboard shows the top hypotheses by confidence and effect size first. Click "Load more" to reveal lower-confidence or smaller-effect findings. These are still valid data points — especially useful for ideation and longer-term experimentation.',
          pos: 'top',
          levels: ['deep'],
        },
        {
          target: null,
          title: '🔗 From Hypotheses to Action',
          text: 'The workflow: Executive Summary → pick your Gold hypothesis → go to Ideation Studio to build a concept around it → go to Hypothesis Validation to track whether your test confirms the predicted effect. Each dashboard is a link in the evidence → action → validation chain.',
          tip: 'Ask Calliope: "Suggest an A/B test for the top Gold hypothesis" or "Which hypotheses most directly affect CPM?"',
          pos: 'center',
          levels: ['standard','deep'],
        },
        {
          target: null,
          title: '🎓 You\'re ready to use Executive Summary',
          text: 'Start by filtering to Gold tier. Read each hypothesis card — focus on the recommended action. Pick 1–2 hypotheses to test in your next production cycle and bring them to Ideation Studio. Return here after results come in to see if your test data moves the hypothesis from "finding" to "validated insight."',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
      ],
    },

    // ── Hypothesis Validation ─────────────────────────────────────────────
    'validation': {
      name: 'Hypothesis Validation',
      subtitle: 'Track, test, and statistically validate your content hypotheses',
      steps: [
        {
          target: null,
          title: '🧪 Welcome to Hypothesis Validation',
          text: 'This is where data hypotheses meet real-world testing. You bring a hypothesis from the Executive Summary, run a production experiment (A/B test or controlled episode), and enter your results here. The dashboard runs statistical validation to tell you whether the observed effect is real or likely due to chance.',
          tip: 'The gold standard workflow: Executive Summary (find) → Ideation (design) → Production (execute) → Validation (confirm). This dashboard closes the loop.',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#sessionsList',
          title: '📂 Validation Sessions',
          text: 'Each session is one validation exercise — a specific hypothesis you\'re testing with a specific set of videos. Sessions are saved locally and persist across browser refreshes. You can have multiple active sessions for different hypotheses running in parallel.',
          tip: 'Name your sessions clearly (e.g. "Hook Score A/B — Q1 2026") so you can track experiments longitudinally and share results with the team.',
          pos: 'right',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#hypList',
          title: '📋 Hypothesis List',
          text: 'All the hypotheses being tested in the current session. Each has a status: Pending (not yet validated), Confirmed (statistically supported), Refuted (evidence against it), or Inconclusive (not enough data yet). You can test multiple hypotheses per session.',
          tip: 'Start with Gold and Silver hypotheses from the Executive Summary — they have the strongest a-priori evidence and are most likely to produce a detectable effect.',
          pos: 'right',
          levels: ['standard','deep'],
        },
        {
          target: '#hypSelect',
          title: '➕ Adding Hypotheses to Test',
          text: 'Use this dropdown to load a pre-defined hypothesis from the Executive Summary\'s confirmed list, or add a custom hypothesis with your own wording. Pre-loaded hypotheses already have the expected effect direction and the relevant feature pre-filled.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#workspace',
          title: '🔬 Validation Workspace',
          text: 'The main analysis area for the selected hypothesis. Paste in your test video IDs (or upload a CSV), assign them to control vs. treatment groups, and enter the observed performance metrics. The dashboard runs a statistical comparison (t-test, Mann-Whitney, or permutation test depending on sample size) and shows you the p-value, effect size, and confidence interval.',
          tip: 'Minimum recommended sample: 15 videos per group for reliable statistical testing. With fewer, report the trend as suggestive but not conclusive.',
          pos: 'left',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#summarizeModal',
          title: '📄 Summary Report',
          text: 'Once validation is complete, generate a shareable summary — a structured PDF/card showing: the hypothesis, the experiment design, the observed results, the statistical conclusion, and the recommended next step. Use this for stakeholder reporting or production team briefings.',
          pos: 'center',
          levels: ['deep'],
        },
        {
          target: null,
          title: '📈 Interpreting Results',
          text: 'Key metrics to understand: <strong>p-value</strong> < 0.05 = statistically significant (less than 5% chance the effect is random). <strong>Effect size</strong> (Cohen\'s d) = how large the difference is in practical terms. <strong>Confidence Interval</strong> = the range of plausible true effects.',
          tip: 'Statistical significance ≠ practical importance. A tiny effect can be significant with large samples. Always report effect size alongside p-value.',
          pos: 'center',
          levels: ['standard','deep'],
        },
        {
          target: null,
          title: '🔗 Closing the Loop',
          text: 'Confirmed validations feed back into the Executive Summary — they upgrade a hypothesis from "statistical finding" to "field-validated insight." Over time, this builds an empirical playbook specific to CUT\'s audience, format, and production style.',
          tip: 'Ask Calliope: "How do I design an A/B test for hypothesis H12?" or "What sample size do I need to detect a 10% lift in watch time?"',
          pos: 'center',
          levels: ['standard','deep'],
        },
        {
          target: null,
          title: '🎓 You\'re ready to validate hypotheses',
          text: 'Create a new session, add a Gold-tier hypothesis from the Executive Summary, and enter your most recent A/B test data. If you haven\'t run an experiment yet, use this dashboard to design one — Calliope can suggest a test design for any hypothesis.',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
      ],
    },

    // ── Ideation Studio ────────────────────────────────────────────────────
    'ideation': {
      name: 'Ideation Studio',
      subtitle: 'AI-powered episode concepting grounded in CUT performance data',
      steps: [
        {
          target: null,
          title: '💡 Welcome to Ideation Studio',
          text: 'Ideation Studio uses Claude AI to generate complete episode concepts — storyboard beats, casting notes, script direction, production notes, title variants, and thumbnail concepts — all grounded in the statistical findings from the CUT analysis. Every creative output is traceable to at least one data hypothesis.',
          tip: 'This is not a generic AI content tool. Every suggestion is constrained by what the CUT data says actually drives performance for this specific channel and audience.',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
        {
          target: '.detail-pills',
          title: '⚡ Detail Level',
          text: 'Three modes: <strong>⚡ Quick</strong> — rough concept in seconds, great for brainstorming. <strong>✦ Standard</strong> — full production package with 6 beats, 6 titles, 4 thumbnails. <strong>🔬 Deep</strong> — exhaustive 10-beat breakdown for high-priority episodes.',
          tip: 'Use Quick for first-pass ideation, Standard for production planning, Deep when pitching to stakeholders.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#format-pills',
          title: '🎬 Format',
          text: 'Choose which CUT format to concept for — Truth or Drink, Lineup, Keep it 100, etc. The AI uses format-specific performance data and hypotheses so every suggestion is grounded in what actually works for that format\'s audience.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#brief-text',
          title: '✍️ Creative Brief',
          text: 'Type a high-level direction — a theme, guest profile, social dynamic, or format twist. Keep it open-ended. The AI will sharpen and constrain your idea using the data. Rough ideas work great — a single line is enough to generate a full concept.',
          tip: 'Examples: "Moms guessing their son\'s girlfriend" · "Gen Z vs millennials on money" · "Vulnerability + surprising reveals"',
          pos: 'bottom',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#temp-slider',
          title: '🌡️ Creative Temperature',
          text: 'Controls how bold the AI gets. <strong>Low</strong> = stays close to proven CUT formulas. <strong>Middle (3)</strong> = one experimental element alongside strong data support — sweet spot for most productions. <strong>High</strong> = pushes creative boundaries.',
          pos: 'bottom',
          levels: ['standard','deep'],
        },
        {
          target: '#ref-dropzone',
          title: '📎 References',
          text: 'Optionally upload a production document, link to a reference video, or paste existing episode URLs. The more context you provide, the more specific and actionable the output. You can always run without references — the AI will use the data alone.',
          pos: 'bottom',
          levels: ['deep'],
        },
        {
          target: '#pane-concept',
          title: '💡 Concept Output — Episode Brief',
          text: 'The generated episode concept: working title, logline, core emotional hook, format mechanics, escalation arc, and the specific data hypotheses that motivated each creative choice. This is your production brief.',
          pos: 'top',
          levels: ['quick','standard','deep'],
        },
        {
          target: '#pane-storyboard',
          title: '🎬 Storyboard Beats',
          text: 'The episode broken into timed beats with direction for camera, host, and talent. Each beat specifies the emotional register (vulnerability, shock, comedy), the interaction format, and which hypothesis it\'s designed to activate. These beats are directly usable as a pre-production runsheet.',
          tip: 'Beats are ordered by escalation logic — cold open hook → warmup → escalation → peak → landing. The arc shape is based on CUT\'s highest-performing episodes.',
          pos: 'top',
          levels: ['standard','deep'],
        },
        {
          target: '#pane-titles',
          title: '✏️ Title Variants & A/B Tests',
          text: 'Up to 8 title variants organised into A/B pairs, each testing one variable (curiosity-gap vs. format-recognition, age-mention vs. generic, etc.). Every title is annotated with which hypothesis motivated it and what CTR signal it\'s designed to trigger.',
          tip: 'Look for titles where the A/B pair differs by exactly one variable — these are the ones you can actually learn from in a production test.',
          pos: 'top',
          levels: ['standard','deep'],
        },
        {
          target: '#pane-thumbnails',
          title: '🖼️ Thumbnail Concepts',
          text: 'Thumbnail direction briefs — face count, emotional expression, color palette, text overlay, composition — all derived from the thumbnail analysis. A "Data Brief" at the top shows which thumbnail hypotheses apply to this episode, so you understand the strategy before looking at the concepts.',
          tip: 'Add your fal.ai key in Settings (⚙️ top-right) to generate actual AI thumbnail images from these briefs.',
          pos: 'top',
          levels: ['standard','deep'],
        },
        {
          target: '.output-tab[onclick*="distribution"]',
          title: '🌐 Distribution Guide',
          text: 'A full distribution playbook for this specific episode: when to publish, which days and times drive the best views, how to optimise for mobile vs desktop, geography targeting, duration guidance, algorithm tips (CTR, retention, search), and the best clip moments for Instagram, TikTok, and Twitter.',
          tip: 'This tab uses the distribution and discovery hypotheses from the analysis — [H17] Publish Timing, [H40] Peak Hours, [H41] Mobile-First, [H43] Search Traffic, [H46] Shorts Flywheel.',
          pos: 'top',
          levels: ['standard','deep'],
        },
        {
          target: '#gear-btn',
          title: '⚙️ Settings & API Keys',
          text: 'Open Settings to configure your Anthropic API key (required for AI generation), fal.ai key (for thumbnail image generation), and your default detail level preference. These are saved locally in your browser and never leave your machine.',
          pos: 'bottom',
          levels: ['deep'],
        },
        {
          target: null,
          title: '🎓 You\'re ready to ideate',
          text: 'Start by selecting a format, toggling on 2–3 Gold-tier hypotheses, and typing a rough brief. Use ✦ Standard detail level for your first run. Read the concept, then regenerate with a tweaked brief to explore alternatives. When you find something promising, take it to Hypothesis Validation to plan the production test.',
          tip: 'Ask Calliope: "Generate a vulnerability-focused concept for Truth or Drink based on the top hypotheses" or "Suggest a title for a Gen Z money shame episode."',
          pos: 'center',
          levels: ['quick','standard','deep'],
        },
      ],
    },

  };

  // ─────────────────────────────────────────────────────────────────────────
  //  ENGINE STATE
  // ─────────────────────────────────────────────────────────────────────────
  let _steps     = [];
  let _idx       = 0;
  let _overlay   = null;
  let _highlight = null;
  let _tooltip   = null;

  // ─────────────────────────────────────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  function _injectStyles() {
    if (document.getElementById('calli-tour-css')) return;
    const s = document.createElement('style');
    s.id = 'calli-tour-css';
    s.textContent = TOUR_CSS;
    document.head.appendChild(s);
  }

  function _detectDashboard() {
    const t   = (document.title || '').toLowerCase();
    const url = (window.location.pathname || '').toLowerCase();
    if (url.includes('cut_home') || (t.includes('project home') && url.includes('cut'))) return 'home';
    if (t.includes('social pulse') || url.includes('social_media'))        return 'social-pulse';
    if (t.includes('executive') || url.includes('exec_summary'))           return 'executive-summary';
    if (t.includes('ideation') || url.includes('ideation'))                return 'ideation';
    if (t.includes('validation') || url.includes('validation'))            return 'validation';
    if (t.includes('lasso') || url.includes('lasso'))                      return 'lasso';
    if (t.includes('random forest') || t.includes('shap') || url.includes('rf_shap')) return 'random-forest';
    if (t.includes('correlat') || url.includes('correlat') || url.includes('ml_analysis')) return 'correlations';
    return 'social-pulse'; // safe fallback
  }

  function _stepsForLevel(dash, level) {
    return dash.steps.filter(s => s.levels.includes(level));
  }

  function _countSteps(dash, level) {
    return _stepsForLevel(dash, level).length;
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  LEVEL PICKER MODAL
  // ─────────────────────────────────────────────────────────────────────────
  function launch() {
    _injectStyles();
    const dashId = _detectDashboard();
    const dash   = TOURS[dashId] || TOURS['social-pulse'];
    let selected = 'standard';

    if (document.getElementById('ct-picker-wrap')) return;

    const wrap = document.createElement('div');
    wrap.className = 'ct-picker-wrap';
    wrap.id = 'ct-picker-wrap';
    wrap.innerHTML = `
      <div class="ct-picker-card">
        <div class="ct-picker-title">✦ ${dash.name} — Interactive Tutorial</div>
        <div class="ct-picker-sub">${dash.subtitle}<br><span style="color:#4b5563">Use ← → arrow keys to navigate. Press ESC to close at any time.</span></div>
        <div class="ct-level-options">
          <div class="ct-level-opt" data-level="quick">
            <span class="ct-level-icon">⚡</span>
            <div>
              <div class="ct-level-name">Quick Tour</div>
              <div class="ct-level-desc">${_countSteps(dash,'quick')} steps &nbsp;·&nbsp; ~2 minutes &nbsp;·&nbsp; key concepts only</div>
            </div>
          </div>
          <div class="ct-level-opt selected" data-level="standard">
            <span class="ct-level-icon">📖</span>
            <div>
              <div class="ct-level-name">Standard Tour <span style="font-size:10px;color:#a78bfa;font-weight:400;margin-left:6px">Recommended</span></div>
              <div class="ct-level-desc">${_countSteps(dash,'standard')} steps &nbsp;·&nbsp; ~5 minutes &nbsp;·&nbsp; all features explained</div>
            </div>
          </div>
          <div class="ct-level-opt" data-level="deep">
            <span class="ct-level-icon">🔬</span>
            <div>
              <div class="ct-level-name">Deep Dive</div>
              <div class="ct-level-desc">${_countSteps(dash,'deep')} steps &nbsp;·&nbsp; ~10 minutes &nbsp;·&nbsp; every interaction &amp; nuance</div>
            </div>
          </div>
        </div>
        <div class="ct-picker-footer">
          <button class="ct-picker-cancel">Skip for now</button>
          <button class="ct-picker-start">Start Tour →</button>
        </div>
      </div>`;

    wrap.querySelectorAll('.ct-level-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        wrap.querySelectorAll('.ct-level-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selected = opt.dataset.level;
      });
    });

    wrap.querySelector('.ct-picker-cancel').onclick = () => {
      document.body.removeChild(wrap);
    };
    wrap.querySelector('.ct-picker-start').onclick = () => {
      document.body.removeChild(wrap);
      start(selected);
    };

    document.body.appendChild(wrap);
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  START TOUR
  // ─────────────────────────────────────────────────────────────────────────
  function start(level) {
    _injectStyles();
    if (_overlay) finish();

    const dashId = _detectDashboard();
    const dash   = TOURS[dashId] || TOURS['social-pulse'];
    _steps = _stepsForLevel(dash, level || 'standard');
    _idx   = 0;

    _overlay = document.createElement('div');
    _overlay.className = 'ct-overlay';
    _overlay.addEventListener('click', e => {
      if (e.target === _overlay) finish();
    });

    _highlight = document.createElement('div');
    _highlight.className = 'ct-highlight';
    _highlight.style.display = 'none';

    _tooltip = document.createElement('div');
    _tooltip.className = 'ct-tooltip';

    document.body.appendChild(_overlay);
    document.body.appendChild(_highlight);
    document.body.appendChild(_tooltip);

    document.addEventListener('keydown', _onKey);
    _renderStep(0);
  }

  function _onKey(e) {
    if (!_overlay) return;
    if (e.key === 'ArrowRight' || (e.key === 'Enter' && !e.target.closest('input,textarea,select'))) next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'Escape') finish();
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER STEP
  // ─────────────────────────────────────────────────────────────────────────
  function _renderStep(idx) {
    _idx = idx;
    const step  = _steps[idx];
    const total = _steps.length;
    const isLast  = idx === total - 1;
    const isFirst = idx === 0;

    const maxDots = Math.min(total, 14);
    const dots = Array.from({length: maxDots}, (_, i) => {
      const realIdx = Math.round(i * (total - 1) / (maxDots - 1 || 1));
      const cls = realIdx < idx ? 'done' : realIdx === idx ? 'active' : '';
      return `<div class="ct-dot ${cls}"></div>`;
    }).join('');

    _tooltip.innerHTML = `
      <div class="ct-progress-row">
        <span>Step ${idx + 1} of ${total}</span>
        <div class="ct-dots">${dots}</div>
      </div>
      <div class="ct-tooltip-title">${step.title}</div>
      <div class="ct-tooltip-text">${step.text}</div>
      ${step.tip ? `<div class="ct-tooltip-tip">💡 ${step.tip}</div>` : ''}
      <div class="ct-tooltip-footer">
        <button class="ct-btn ct-btn-skip" id="ct-skip">✕ Exit tour</button>
        ${!isFirst ? '<button class="ct-btn ct-btn-prev" id="ct-prev">← Prev</button>' : ''}
        <button class="ct-btn ct-btn-next" id="ct-next">${isLast ? '🎓 Finish' : 'Next →'}</button>
      </div>`;

    _tooltip.querySelector('#ct-skip').onclick = finish;
    if (!isFirst) _tooltip.querySelector('#ct-prev').onclick = prev;
    _tooltip.querySelector('#ct-next').onclick  = isLast ? finish : next;

    // Run optional onEnter callback before positioning (e.g. to expand a card)
    if (step.onEnter && typeof step.onEnter === 'function') {
      try { step.onEnter(); } catch(e) {}
    }

    if (!step.target || step.pos === 'center') {
      _showCenter();
    } else {
      _showTarget(step.target, step.pos);
    }
  }

  function _showCenter() {
    _highlight.style.display = 'none';
    _overlay.style.background = 'rgba(6,10,18,.82)';
    _tooltip.style.cssText = `top:50%;left:50%;transform:translate(-50%,-50%);width:340px;`;
  }

  function _showTarget(selector, pos) {
    const el = document.querySelector(selector);
    if (!el) { _showCenter(); return; }

    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

    setTimeout(() => {
      const r   = el.getBoundingClientRect();
      const pad = 7;

      _highlight.style.cssText = `
        display:block;
        top:${r.top - pad}px; left:${r.left - pad}px;
        width:${r.width + pad*2}px; height:${r.height + pad*2}px;
      `;
      _overlay.style.background = 'transparent';

      const tw = 340, th = 320;
      const vw = window.innerWidth, vh = window.innerHeight;
      let top, left;

      switch (pos) {
        case 'bottom': top = r.bottom + pad + 16; left = r.left + r.width/2 - tw/2; break;
        case 'top':    top = r.top - pad - th - 16; left = r.left + r.width/2 - tw/2; break;
        case 'left':   top = r.top + r.height/2 - th/2; left = r.left - tw - 20; break;
        default:       top = r.top + r.height/2 - th/2; left = r.right + 20; break;
      }

      if (pos === 'bottom' && top + th > vh - 10) top = r.top - pad - th - 16;
      if (pos === 'top'    && top < 10)            top = r.bottom + pad + 16;
      if (pos === 'left'   && left < 10)           left = r.right + 20;
      if (pos === 'right'  && left + tw > vw - 10) left = r.left - tw - 20;

      left = Math.max(12, Math.min(left, vw - tw - 12));
      top  = Math.max(12, Math.min(top,  vh - th - 12));

      _tooltip.style.cssText = `top:${top}px;left:${left}px;width:${tw}px;transform:none;`;
    }, 220);
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────
  function next() { if (_idx < _steps.length - 1) _renderStep(_idx + 1); else finish(); }
  function prev() { if (_idx > 0) _renderStep(_idx - 1); }

  function finish() {
    document.removeEventListener('keydown', _onKey);
    [_overlay, _highlight, _tooltip].forEach(el => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    _overlay = _highlight = _tooltip = null;
    _steps = [];
    // Clean up any cards that were expanded by the tour
    document.querySelectorAll('.hyp-body.open').forEach(body => {
      body.classList.remove('open');
      const btn = document.getElementById(body.id.replace('body-', 'ebtn-'));
      if (btn) { btn.classList.remove('open'); const arr = btn.querySelector('.arrow'); if (arr) arr.textContent = '▼'; const lbl = btn.querySelector('.lbl'); if (lbl) lbl.textContent = 'Show evidence & A/B test'; }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────
  global.CALLI_TOUR = { launch, start, next, prev, finish };

})(window);
