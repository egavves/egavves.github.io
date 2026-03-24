# PRODUCTION NOTE + FORMAT DEVELOPMENT ANALYSIS "Wou — Distribution

# CUT ANALYTICS — DISTRIBUTION PLAN
## Episode: Truth or Drink · Gen Z Edition

---

> **Strategic North Star:** `traffic_algorithmic_pct` is the single most consistent cross-metric predictor in this dataset — stable across views, retention_30s, retention baseline, outlier retention, and engagement. Every distribution decision below is architected to *maximize algorithmic surface area* while using geo-targeting and thumbnail/title signals to pull the audience composition that actually converts.

---

## 01 · CADENCE

### Full Episode Drop

**Publish Day:** Thursday, 3:00 PM ET
**Reasoning:**
- Gen Z YouTube consumption peaks Thursday–Saturday. Thursday gives the algorithm 48 hours of signal-gathering before the weekend amplification window.
- `traffic_algorithmic_pct` is the top predictor of views AND retention_30s. Algorithmic traffic requires an initial velocity signal — Thursday drop gives you the highest-engagement weekday audience for that first-48-hour burst.
- `geo_us_pct` is LASSO-stable for retention_30s (r=+0.42), outlier_retention_score (r=+0.45), and ret_above_50_pct (r=+0.45). ET publish time front-loads US timezone viewers, protecting early retention metrics that feed the algorithm's promotion decision.

**Avoid:** Monday drops. Search traffic (`traffic_search_pct`) is a secondary predictor for engagement_comment_ratio (r=+0.47) but search indexes slowly — Monday drops sacrifice algorithmic momentum before search can compensate.

---

### Shorts / Clips Schedule

| Drop | Timing | Platform | Purpose |
|------|---------|----------|---------|
| Short #1 — "The Answer Nobody Expected" | Thursday 12:00 PM ET (3 hrs before main drop) | YouTube Shorts | Pre-heat algorithmic surface; tease without spoiling |
| Short #2 — "The Funniest Drink of the Night" | Friday 10:00 AM ET | YouTube Shorts + TikTok | Weekend discovery window; `traffic_algorithmic_pct` TikTok push |
| Short #3 — "The One That Went Silent" | Saturday 11:00 AM ET | Instagram Reels + TikTok | Emotional/tension beat for Reels algo; broadens `geo_us_pct` + `geo_latam_pct` reach |
| Short #4 — "Gen Z Explains [Specific Topic]" | Monday 9:00 AM ET | YouTube Shorts only | Search re-entry; captures `traffic_search_pct` index lag from Thursday drop |

**Frequency Reasoning:**
Four clips over five days maintains daily platform signal without cannibalizing full-episode click-through. `segment_count` is LASSO-stable for views_public (r=+0.39) and ret_above_50_pct — this suggests audiences rewarding *structured content variety*. Multiple clips mirror that structural variety as a distribution signal.

---

### Community Post Timing

| Post | Timing | Format |
|------|---------|--------|
| Teaser Poll ("Which question would YOU refuse to answer?") | Wednesday 6:00 PM ET | YouTube Community Poll |
| "It's live" announcement + timestamp guide | Thursday 3:05 PM ET (5 min post-publish) | YouTube Community + Instagram Story |
| Engagement bait ("What was the wildest answer? Drop it below 👇") | Friday 12:00 PM ET | YouTube Community Text Post |
| Behind-the-scenes still / "What they didn't say on camera" | Sunday 2:00 PM ET | Instagram + YouTube Community |

**Reasoning:** Community posts feed `comment_sentiment_mean` and `comment_avg_length`, both LASSO-stable for engagement_like_ratio, engagement_comment_ratio, and engagement_overall_ratio. The Wednesday poll specifically seeds comment velocity *before* the video publishes, which primes the comment section for algorithmic read.

---

## 02 · PLATFORM CUTS

### A · YouTube Shorts

**Spec:** 9:16 vertical, ≤60 seconds, captions burned in, no black bars, face in upper 60% of frame (supports `thumb_center_weight`, LASSO-stable for ret_baseline and ret_initial_drop).

---

**Short #1 — Pre-Drop Teaser**
- **What to pull:** The single most jaw-dropping answer in the episode — ideally one where the room goes quiet for 1–2 seconds before erupting. [[H01: videos where the Short's emotional beat matches the full episode's highest-retention segment will show lower ret_initial_drop on the parent video, because Short viewers enter with calibrated expectations|The silence-before-eruption moment]] is your highest-leverage hook because `escalation_intensity` is LASSO-stable for views_public and `escalation_sentiment` for ret_30s.
- **Structure:** 0–3s: reaction face (no context) → 3–45s: the question + answer + room reaction → 45–60s: freeze frame + "