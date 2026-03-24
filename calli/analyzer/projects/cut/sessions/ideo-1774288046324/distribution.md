# PRODUCTION NOTE: "EXES PLAY TRUTH OR DRINK — BUT T — Distribution



# CUT Analytics — Distribution Plan: "Gen Z Truth or Drink"

---

## I. CADENCE STRATEGY

### Full Episode Launch
**Day: Thursday, 11:00 AM PT**

**Reasoning:** The ML signals tell us this episode's performance hinges on `traffic_algorithmic_pct` (the single strongest predictor of `views_public` at r=+0.48, and LASSO-stable across nearly every outcome metric). Thursday morning maximizes the 48-hour algorithmic evaluation window before the weekend browse-heavy period, when casual viewers flood YouTube. We want the algorithm to have scored this video favorably *before* that surge. Additionally, `geo_us_pct` is a dominant predictor of retention metrics (`ret_baseline` r=+0.45, `ret_initial_drop` r=+0.41, `ret_above_50_pct` r=+0.45), so we time to US prime discovery hours.

### Shorts/Clips Schedule

| Asset | Platform | Publish Time | Day Relative to Full EP |
|---|---|---|---|
| Short #1 (Teaser) | YouTube Shorts, TikTok, IG Reels | Tuesday, 5:00 PM PT | D-2 |
| Short #2 (Hook Clip) | YouTube Shorts, TikTok, IG Reels | Thursday, 8:00 AM PT | D-0 (3 hrs pre-launch) |
| Short #3 (Viral Moment) | TikTok, IG Reels | Friday, 12:00 PM PT | D+1 |
| Short #4 (Deep Cut) | YouTube Shorts, TikTok | Sunday, 6:00 PM PT | D+3 |
| Short #5 (Reaction/Remix bait) | TikTok, IG Reels | Tuesday, 5:00 PM PT | D+5 |

**Reasoning:** The 5-clip cadence over 7 days is designed to sustain `traffic_external_pct` (LASSO-stable for `engagement_comment_ratio` r=+0.42 and `engagement_overall_ratio`), which feeds back into the algorithm's confidence signal. The D-2 teaser seeds anticipation among subscribers (`traffic_subscriber_pct`, LASSO-stable for `retention_30s` and `ret_stability`). The D+1 and D+3 clips target the long-tail algorithmic push — if the full episode's early retention is strong, these clips act as re-entry funnels.

### Community Post Timing

| Post Type | Timing | Purpose |
|---|---|---|
| Poll (pre-launch) | Wednesday, 2:00 PM PT (D-1) | Prime subscriber notification; boost `traffic_subscriber_pct` on launch |
| Behind-the-scenes still | Thursday, 2:00 PM PT (D-0, 3 hrs post) | Nudge non-clickers; second notification touch |
| Quote card (viral moment) | Saturday, 11:00 AM PT (D+2) | Re-engage; drive weekend browse traffic |

### Frequency Recommendation
**1 full episode per week; 4–5 Shorts per episode cycle; 2–3 community posts per cycle.**

This cadence prevents subscriber fatigue (protecting `traffic_subscriber_pct` stability) while maintaining enough external surface area to keep `traffic_external_pct` and `traffic_search_pct` elevated — both of which are top-3 predictors of `engagement_comment_ratio` (r=+0.47 and r=+0.42 respectively). [[H14: Testing whether a 5-short cadence per episode increases traffic_external_pct by ≥10% vs. the current 2-3 short cadence|we're testing whether this expanded clip cadence meaningfully lifts external traffic share]].

---

## II. PLATFORM CUTS

### A. YouTube Shorts

**Short #1 — "The Teaser" (D-2)**
- **Spec:** 0:42–0:55, vertical 9:16, 1080×1920, hard-burned captions (bold, white with black stroke), CUT watermark lower-left
- **What to Pull:** The single highest-escalation question from the first half — likely the moment where a participant visibly hesitates between truth and drink, creating a micro-cliffhanger. Target the sequence with highest `escalation_intensity` and a visible reaction beat. Cut *before* the answer.
- **Title:** `She had 5 seconds to answer… or drink 🍷 #truthordrink #genz`
- **Reasoning:** Cutting before the reveal exploits `cliffhanger_score` (LASSO-stable for `ret_baseline`, `ret_stability`, `ret_30s`, `ret_initial_drop`, and `ret_above_50_pct` — it appears in more LASSO models than almost any content variable). The unresolved tension drives click-through to the full episode.

**Short #2 — "The Hook" (D-0, pre-launch)**
- **Spec:** 0:30–0:40, same visual spec, opening with the most shocking *answered* question from the episode
- **What to Pull:** The moment with peak `surprise_rate_per_min` — a genuine, unguarded confession that lands in the first 3 minutes of the full episode. This should be a complete micro-narrative: question → reaction → answer → group reaction.
- **Title:** `"I've never told ANYONE this" 😳 Gen Z Truth or Drink is here`
- **Reasoning:** This clip is a conversion tool, not a standalone viral play. It needs to deliver `payoff_satisfaction_score` (LASSO-stable for `views_public`) so the viewer feels rewarded *and* curious for more. Placing the moment from the episode's opening ensures that viewers who click through get immediate recognition ("I saw this!"), reducing `ret_initial_drop`.

**Short #4 — "The Deep Cut" (D+3)**
- **Spec:** 0:50–0:58, same visual spec
- **What to Pull:** A quieter, emotionally resonant moment — a vulnerable confession that didn't make the teaser or hook. Target high `comment_sentiment_mean` potential (LASSO-stable for `engagement_like_ratio`, `engagement_comment_ratio`, and `engagement_overall_ratio`).
- **Title:** `This answer broke everyone at the table 💔 #truthordrink`
- **Reasoning:** By D+3, the algorithmic push on the full episode is either sustaining or fading. This clip targets a different emotional register — warmth and empathy vs. shock — to capture a viewer segment that didn't respond to the earlier hooks. It also tests [[H09: Whether emotionally warm Shorts (high ending_vs_mean_sentiment) drive higher engagement_like_ratio than shock-based Shorts|whether warmth-forward clips outperform shock clips on like ratio]].

---

### B. TikTok

**Angle: "React-bait & Stitch Fuel"**

TikTok's value for CUT is `traffic_external_pct` generation. Every TikTok clip should be designed to either (a) drive direct click-through via bio link or (b) generate stitch/duet content that expands reach.

**Short #1 Adaptation (D-2)**
- **Spec:** 0:28–0:38, vertical 9:16, native TikTok captions (CapCut auto-style for platform-native feel), no CUT watermark (use in-video text overlay instead: "Full vid on YouTube — CUT")
- **What to Pull:** Same hesitation moment as YT Short #1, but trimmed tighter. On TikTok, the first 1.5 seconds must contain movement or a face expressing conflict. Open on the reaction, not the question.
- **Title/Caption:** `would YOU answer this?? 👀 truth or drink with gen z gets WILD #truthordrink #genz #wouldyourather`
- **Reasoning:** TikTok's algorithm rewards completion rate. Shorter clip + unresolved ending = replay loops. The question-in-caption ("would YOU answer this??") seeds comment engagement, which TikTok's algorithm weighs heavily.

**Short #3 — "The Viral Moment" (D+1)**