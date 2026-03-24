# Exes Play Truth or Drink and It Gets Too Real" — Distribution



# CUT Analytics — Distribution Plan: "Gen Z Truth or Drink"

---

## 🗓️ CADENCE: Full Release & Supporting Content Schedule

### Core Rationale
The ML signals tell a clear story: **traffic_algorithmic_pct (r=+0.48 for views, +0.43 for retention_30s, +0.39 for ret_stability)** is the single most powerful lever across nearly every outcome variable. This means our distribution cadence must be architected to *feed the algorithm* — stacking signals of engagement velocity in the first 2-4 hours, then sustaining momentum through supporting content that re-enters viewers into the ecosystem.

Additionally, **traffic_search_pct (r=+0.47 for comment_ratio, +0.25 for engagement_overall)** and **traffic_external_pct (r=+0.42 for comment_ratio)** are LASSO-stable across engagement metrics, meaning we need to seed discoverability *before* the main drop and drive external referral traffic *after*.

---

### The Schedule

| Day | Time (PT) | Content | Platform | Purpose |
|-----|-----------|---------|----------|---------|
| **Monday (D-2)** | 12:00 PM | Community Post — "What's the one question you'd never answer sober?" poll | YouTube | Prime subscriber notification pool; boost traffic_subscriber_pct (LASSO-stable for retention_30s, ret_stability, ret_initial_drop) |
| **Tuesday (D-1)** | 10:00 AM | Teaser Short #1 — "The Question That Broke Her" | YouTube Shorts, TikTok, IG Reels | Seed algorithmic surface; generate search intent for Wednesday |
| **Tuesday (D-1)** | 4:00 PM | IG Story carousel — 3 blurred screenshots of reactions + "Tomorrow." | Instagram | External traffic priming; drive geo_us_pct engagement (r=+0.45 for ret_baseline) |
| **Wednesday (D0)** | 9:00 AM | **FULL EPISODE DROP** | YouTube | Algorithmic window — 9 AM PT catches East Coast lunch + West Coast morning scroll |
| **Wednesday (D0)** | 12:00 PM | Community Post — "Which moment hit hardest?" with timestamps | YouTube | Re-engagement loop; comment_sentiment_mean boost (LASSO-stable for 5 outcome variables) |
| **Thursday (D+1)** | 11:00 AM | Short #2 — "She Actually Drank Instead of Answering This" | YouTube Shorts, TikTok | Second algorithmic push; captures the "what did I miss" cohort |
| **Friday (D+2)** | 2:00 PM | Short #3 — "Gen Z vs. The Question They All Avoided" | TikTok, IG Reels | Weekend browse capture; external traffic loop back to full ep |
| **Sunday (D+4)** | 6:00 PM | Behind-the-scenes IG Reel — casting/reaction moments | Instagram | Parasocial_score reinforcement (LASSO-stable for outlier_retention_score, ret_above_50_pct) |

### Frequency Reasoning
Three Shorts across 4 days is optimal. The data shows **segment_count (r=+0.39 for views)** and **peak_spacing_cv** (LASSO-stable for views_public, outlier_retention_score, ret_baseline, ret_above_50_pct) reward content with multiple distinct peaks. Each Short should pull from a *different emotional peak* to maximize the variety of algorithmic entry points. Spacing them 24-48 hours apart prevents cannibalization while sustaining the video's "active" status in recommendation systems.

---

## ✂️ PLATFORM CUTS: Shorts, TikTok, Reels

### SHORT #1: "The Question That Broke Her" (Pre-release Teaser)

**Platform:** YouTube Shorts (primary), TikTok, IG Reels
**Spec:** 0:38–0:47 vertical (9:16), hard-subbed, 1080x1920
**What to Pull:** The single highest-escalation moment in the first third of the episode — ideally a question that produces a visible emotional shift (shock → vulnerability). Look for the moment where a participant's face changes *before* they answer. Cut the clip RIGHT before the full answer lands.

**Title/Caption:**
- **YT Shorts:** "The question that broke her 😳 #truthordrink #genz"
- **TikTok:** "gen z was NOT ready for this question 💀"
- **IG Reels:** "she was fine until this question hit different"

**Signal Logic:** This cut targets **escalation_intensity** (LASSO-stable for views_public) and **cliffhanger_score** (LASSO-stable for ret_30s, ret_stability, ret_initial_drop, ret_above_50_pct). By cutting before the answer, we create an open loop that drives traffic_search_pct and traffic_external_pct back to the full episode. [[H14: test whether pre-answer cliffhanger cuts in Shorts drive higher full-episode CTR than post-answer reaction cuts|cutting before the reveal lands]].

---

### SHORT #2: "She Actually Drank Instead of Answering This" (D+1 Engagement Driver)

**Platform:** YouTube Shorts (primary), TikTok
**Spec:** 0:28–0:40 vertical (9:16), hard-subbed, 1080x1920. Include a 2-frame "flash" text card at the top: "THE QUESTION NOBODY ANSWERED"
**What to Pull:** A moment where a participant *chooses to drink rather than answer* — the refusal IS the content. Ideally a moment with visible group reaction (laughter, gasps). This leverages the **new_speaker_rate (r=-0.38 for views)** signal inversely — we want a *focused* moment on one person's decision, not rapid switching.

**Title/Caption:**
- **YT Shorts:** "She chose the drink. Every. Single. Time. 🍷 #truthordrink"
- **TikTok:** "the way she grabbed that glass so fast 😭💀"

**Signal Logic:** The "drink instead of answer" moment is a **reveal_event_count** trigger (LASSO-stable for ret_above_50_pct) and drives **share_intent_score** (LASSO-stable for views_public, engagement_comment_ratio). The implied secret is inherently shareable — viewers tag friends with "this would be you." [[H07: test whether 'refusal moments' drive higher share_intent_score than 'confession moments' in Truth or Drink formats|the moment someone refuses to answer]].

---

### SHORT #3: "Gen Z vs. The Question They All Avoided" (D+2 Compilation)

**Platform:** TikTok (primary), IG Reels
**Spec:** 0:45–0:58 vertical (9:16), hard-subbed, 1080x1920. Rapid-cut compilation format — 3-4 participants reacting to the SAME question, edited back-to-back.
**What to Pull:** Identify one question that produced the widest *variance* in reactions across participants. Show 3-4 reactions in sequence — someone who answers boldly, someone who drinks, someone who hesitates then confesses. This maximizes **ms_reveal_density_scale_var** (LASSO-stable for views_public) and **ms_emotional_intensity_max_argmax_scale** (LASSO-stable for engagement_comment_ratio).

**Title/Caption:**
- **TikTok:** "we asked every gen z the same question. the answers are unhinged. #truthordrink #genz #cut"
- **IG Reels:** "one question. very different answers. 🫣"

**Signal Logic:** Compilation format drives **turns_per_minute** (LASSO-stable for engagement_like_ratio) and **ms_topic_coherence_scale_var** (LASSO-stable for like_ratio, comment_ratio, engagement_overall). The same-question framing creates natural comparison, which is the #1 comment driver in CUT's format library.

---