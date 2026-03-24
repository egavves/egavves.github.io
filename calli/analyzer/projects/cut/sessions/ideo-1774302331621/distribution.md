# PRODUCTION NOTE: "EXES PLAY TRUTH OR DRINK — BUT T — Distribution



# CUT Analytics — Distribution Plan
## "Gen Z Truth or Drink (with Ex Watching)"

---

## I. CADENCE STRATEGY

### Full Episode Launch
**Day:** Thursday, 11:00 AM PT

**Reasoning:** Our ML signals show `traffic_algorithmic_pct` is the single strongest predictor of `views_public` (r=+0.48) and is LASSO-stable across nearly every outcome metric. Thursday morning launches give the algorithm 48+ hours of high-engagement runway before weekend browse sessions peak. Gen Z skews toward evening/night consumption, but an AM drop allows subscriber notifications to seed initial velocity (`traffic_subscriber_pct` is LASSO-stable for retention and views), which then triggers algorithmic pickup by the time target demo is active.

### Shorts/Clips Schedule
| Asset | Platform | Drop Time | Day |
|-------|----------|-----------|-----|
| Short #1 (Hook/Teaser) | YouTube Shorts + TikTok | 6:00 PM PT | Tuesday (D-2) |
| Short #2 (Peak Moment) | YouTube Shorts + TikTok + IG Reels | 12:00 PM PT | Thursday (D+0, 1hr post-launch) |
| Short #3 (Emotional Payoff) | YouTube Shorts + TikTok + IG Reels | 5:00 PM PT | Saturday (D+2) |
| Short #4 (Debate/React Bait) | TikTok + IG Reels | 7:00 PM PT | Monday (D+5) |

**Reasoning:** `segment_count` (r=+0.39 with views) and `peak_spacing_cv` (LASSO-stable for views, retention baseline, and outlier retention) tell us that videos with well-distributed peaks generate more views and hold attention. Spacing Shorts across 7 days mimics this peak-spacing logic at the distribution level — each clip re-spikes external traffic (`traffic_external_pct` is LASSO-stable for engagement_comment_ratio, engagement_like_ratio, and engagement_overall_ratio). [[H14: staggered short release timing mirrors peak_spacing_cv effects on algorithmic pickup|spacing clips across the week rather than front-loading]].

### Community Posts
| Post | Timing | Type |
|------|--------|------|
| Poll: "What's the one question you'd NEVER answer in front of your ex?" | Wednesday (D-1), 3:00 PM PT | Poll |
| Still frame + quote from episode | Thursday (D+0), 5:00 PM PT | Image + caption |
| "Which moment had you screaming?" with timestamped options | Friday (D+1), 2:00 PM PT | Poll |

**Frequency Recommendation:** 3 community posts per episode cycle, 4 Shorts, 1 full episode = **8 touchpoints per episode across 7 days.** This cadence avoids subscriber fatigue while maximizing `traffic_subscriber_pct` and `traffic_external_pct` signals that are LASSO-stable across multiple outcome variables.

---

## II. PLATFORM CUTS

### A. YouTube Shorts

**Cut #1 — "The Question That Broke Her" (Hook/Teaser)**
- **Spec:** 0:42, 9:16 vertical, hard-subtitled (bold white, black stroke), CUT watermark lower-right
- **What to Pull:** The single highest-escalation moment where a participant visibly hesitates, the ex reacts on camera, and the participant either drinks or confesses. Prioritize the moment with the highest `escalation_intensity` score — our models show this is LASSO-stable for views. Cut IN at the question being read (no preamble), cut OUT on the reaction before resolution.
- **Title:** `She had to answer THIS in front of her ex… 😳`
- **Thumbnail:** High `thumb_contrast_rms` + `thumb_sharpness` (both LASSO-stable for views). Split-frame: questioner on left, ex's reaction on right. Bright, colorful background.

**Cut #2 — "Gen Z Has No Filter" (Peak Moment)**
- **Spec:** 0:55, 9:16 vertical, hard-subtitled, reaction zoom-ins at key beats
- **What to Pull:** A rapid-fire exchange where multiple participants answer back-to-back with escalating honesty. Target the segment with highest `new_speaker_rate` variation — the signal is negatively correlated with views (r=-0.38), meaning we want the *concentrated* version: fewer speakers, deeper vulnerability, not rapid cycling.
- **Title:** `Gen Z really said "I have nothing to hide" 💀`

**Cut #3 — "The Moment Everyone Went Silent" (Emotional Payoff)**
- **Spec:** 0:48, 9:16 vertical, slower pacing, ambient audio slightly boosted
- **What to Pull:** The highest `payoff_satisfaction_score` moment — LASSO-stable for views and `ret_end_ratio`. This is likely a genuine emotional revelation or reconciliation beat. Include 2-3 seconds of group silence before the response.
- **Title:** `Nobody expected her to actually say it…`

---

### B. TikTok

**Angle: Debate/React Bait — Optimize for `comment_avg_length` + `comment_question_rate`**

Our models show `traffic_search_pct` (r=+0.47) and `traffic_external_pct` (r=+0.42) are the top predictors of `engagement_comment_ratio`. TikTok is our primary external traffic driver. The strategy is to create cuts that provoke *disagreement and discussion*, which drives comments on TikTok AND search/click-through to the full YouTube episode.

**Cut #1 — "Was she wrong for this?"**
- **Spec:** 0:38, 9:16, TikTok-native captions (centered, animated), trending audio bed underneath at 15% volume if applicable
- **What to Pull:** The most morally ambiguous answer — where the participant says something that a reasonable audience could split 50/50 on. Ideally a moment where the ex's face tells a different story than the words being spoken. End on the reaction, NOT the resolution.
- **Caption:** `was she wrong for saying this in front of her ex? 💀 #truthordrink #genz #cut`
- **CTA in caption:** `full video on @cut — link in bio`

**Cut #2 — "POV: Your ex is watching you answer this"**
- **Spec:** 0:29, 9:16, POV-framed with text overlay at top: "POV: your ex is 3 feet away"
- **What to Pull:** The most relatable/universal question moment. Something where viewers can project themselves into the scenario. Target high `share_intent_score` — LASSO-stable for views and comment ratio.
- **Caption:** `tag someone who could NEVER do this 😭 #truthordrink #cut #exes`

**Cut #3 — "The drink says everything" (D+5, long-tail)**
- **Spec:** 0:22, 9:16, minimal text, let the action speak
- **What to Pull:** A compilation of 3-4 "choosing to drink instead of answer" moments, rapid-cut. The silence IS the content. High `ms_reveal_density_scale_var` — LASSO-stable for views.
- **Caption:** `the drink is ALWAYS the louder answer 🥃 #truthordrink`

---

### C. Instagram Reels

**Angle: Emotional/Aesthetic — Optimize for `share_intent_score` + `comment_sentiment_mean`**

IG Reels should feel more polished and emotionally resonant than TikTok cuts. `comment_sentiment_mean` is LASSO-stable for engagement_like_ratio, engagement_comment_ratio, AND engagement_overall_ratio. IG's audience rewards emotional authenticity over chaos.

**Cut #1 — "The answer that changed everything"**
- **Spec:** 0:45, 9:16, warm color grade, subtitles in clean sans-serif (not TikTok-style), CUT branding
- **What to Pull:** The single most emotionally resonant moment — high `ending_vs_mean_sentiment` (LASSO-stable for like ratio and overall engagement). A moment where the energy in the room shifts. Include the 5 seconds AFTER the answer — the group processing.
- **Caption:** `some answers you can't take back. 🤍 new episode — link in bio`
- **Hashtags:** `#truthordrink #genz #cut #vulnerability #realconversations`

**Cut #2 — "What your ex never told you"**
- **Spec:** 0:35, 9:16, text-on-screen opening ("what would you say to your ex if they were right here?"), then cut to the answer
- **What to Pull:** A moment with high `parasocial_score` — LASSO-stable for outlier_retention_score and ret_baseline. The viewer should feel like they're IN the room.
- **Caption:** `this is why Truth or Drink hits different with Gen Z. full ep on YouTube 🎬`

---

## III. CAPTION HOOK & COMMUNITY POST

### YouTube Full Episode — Description Hook (First 3 Lines)

> **We put Gen Z in front of their exes and made them answer everything.**
> The rules are simple: answer the question honestly, or take the drink. But when your ex is watching every word... the drink starts looking real good. 🥃
> Watch what happens when there's nowhere to hide.

**Reasoning:** The hook leverages `title_fomo_score` (LASSO-stable for views, outlier retention, ret_baseline, and ret_above_50_pct) and `escalation_intensity` framing. The "nowhere to hide" language maps to the surveillance/vulnerability dynamic that drives `parasocial_score`.

### Community Post — Pre-Launch Poll (D-1)

**Image:** A still from the episode — two participants facing each other, drinks visible, slightly blurred for intrigue. High `thumb_colorfulness` + `thumb_center_weight` (both LASSO-stable for retention metrics).

**Text:**
> 🔥 NEW EPISODE DROPPING TOMORROW
> Gen Z. Truth or Drink. Their exes are watching.
>
> Before you watch — be honest:
> 🅰️ I'd answer every question. No fear.
> 🅱️ I'm drinking my way through the whole thing.
> 🅲️ Depends on the ex... 👀
>
> Drop your answer + the ONE question you'd never answer in front of an ex. Tomorrow, 11 AM. 🥃

**Reasoning:** Polls drive `comment_question_rate` (LASSO-stable for ret_30s and ret_initial_drop) and pre-seed subscriber notifications, boosting `traffic_subscriber_pct` at launch — critical for algorithmic pickup. [[H09: pre-launch community engagement seeding improves first-hour traffic_subscriber_pct signal|asking the audience to commit before the episode drops]].

---

## IV. COLLAB ANGLE & CROSS-PROMOTION

### Primary Collab: Participant-Driven Amplification
**Strategy:** Each participant (and their ex) receives a personalized clip package (2 clips each) formatted for their own social channels, with CUT branding baked in.

- **Clip 1:** Their "biggest moment" — the question/answer that will generate the most reaction on their personal following
- **Clip 2:** A reaction clip — their response to watching back their own moment (filmed post-shoot or via selfie video)

**Why this works:** `traffic_external_pct` is LASSO-stable for engagement_comment_ratio, engagement_like_ratio, engagement_overall_ratio, AND multiple retention metrics. Participant cross-posting is the highest-ROI external traffic driver because it comes with built-in social proof and emotional investment. Gen Z participants with even modest followings (5K-50K) drive disproportionate click-through because their audiences are *exactly* the target demo.

**Execution:** Provide each participant with:
- Pre-written caption options (3 choices)
- Exact posting window (within 2 hours of full episode drop)
- Story swipe-up / link sticker asset
- A "watch my episode" IG Story template with CUT branding

### Secondary Collab: Creator React/Duet Seeding
**Target:** 3-5 relationship/commentary creators (100K-500K followers) on TikTok who regularly react to CUT content or similar formats.

- Send them the "Was she wrong for this?" TikTok cut 24 hours before public posting with permission to duet/stitch on drop day
- This seeds `traffic_external_pct` from creator audiences and creates a debate loop that drives `comment_avg_length` (LASSO-stable for 5 engagement/retention metrics)

### Cross-Promotion: CUT Ecosystem
- **CUT Instagram Story** (D+0): Behind-the-scenes photo carousel of the shoot setup + "new episode" swipe-up
- **CUT Twitter/X** (D+0): Post the most provocative quote as text-only tweet → "she really said [quote] with her ex sitting RIGHT THERE" — optimize for quote-tweet debate
- **CUT Newsletter/Discord** (if applicable): Early link + exclusive "what they said after cameras stopped" teaser text → drives `traffic_subscriber_pct`

### Tertiary: Platform-Native Cross-Pollination
Pin a comment on the top-performing TikTok: *"the full 15 minutes is even crazier — link in bio 🥃"* — this converts TikTok views into YouTube `traffic_external_pct`, which is LASSO-stable for nearly every engagement metric we track.

[[H22: participant social amplification within 2-hour launch window measurably increases traffic_external_pct and first-day algorithmic recommendation rate|having participants post their own clips at the same time as the episode drops]].

---

## V. DISTRIBUTION SUMMARY — KEY SIGNALS TARGETED

| Strategy Element | Primary ML Signal Targeted | Outcome Optimized |
|---|---|---|
| Thursday AM launch | `traffic_algorithmic_pct` | views_public, retention_30s |
| Staggered Shorts (D-2 to D+5) | `peak_spacing_cv`, `traffic_external_pct` | views_public, engagement_comment_ratio |
| Community poll (D-1) | `traffic_subscriber_pct`, `comment_question_rate` | ret_initial_drop, ret_30s |
| TikTok debate cuts | `comment_avg_length`, `traffic_search_pct` | engagement_comment_ratio, engagement_overall |
| IG emotional cuts | `comment_sentiment_mean`, `share_intent_score` | engagement_like_ratio, outlier_retention |
| Participant cross-posting | `traffic_external_pct` | engagement_comment_ratio, views_public |
| Cliffhanger endings on all Shorts | `cliffhanger_score` | ret_stability, ret_initial_drop, ret_above_50_pct |

---

*Distribution plan generated by CUT Analytics. Hypothesis links embedded for A/B validation tracking.*