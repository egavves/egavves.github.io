# PRODUCTION NOTE: "Exes Play Truth or Drink… But On — Distribution



# CUT Analytics — Distribution Plan
## Episode: "Gen Z Truth or Drink" (feat. ex mechanic reveal)

---

## I. CADENCE & RELEASE SCHEDULE

### Full Episode Day (Day 0 — Thursday, 11:00 AM PT)

**Why Thursday:** Traffic_algorithmic_pct is the single strongest predictor of views_public (r=+0.48). Thursday uploads give the algorithm a full 48-hour runway before the weekend browse-heavy window. YouTube's recommendation engine indexes engagement velocity in the first 2–6 hours; a Thursday morning drop catches the US lunch-break scroll (geo_us_pct is LASSO-stable across nearly every outcome metric) and carries into evening viewing.

**Title deployed at launch:**
> **"Gen Z Strangers Play Truth or Drink… But One Person Has a Secret"**

This is the VULNERABILITY title. It maximizes title_fomo_score (LASSO-stable for views_public, outlier_retention_score, ret_above_50_pct, and ret_baseline) while creating the information gap that drives click-through. [[H01: FOMO title framing vs. neutral title on algorithmic pickup rate within first 6 hours|"But One Person Has a Secret" framing]].

### Pre-Release Community Post (Day -1, Wednesday 5:00 PM PT)

Post a **poll-style community post** (details in Section IV below). This primes subscriber notifications and seeds traffic_subscriber_pct, which is LASSO-stable for retention_30s, ret_baseline, ret_30s, ret_stability, ret_initial_drop, and ret_above_50_pct. Subscriber traffic acts as the ignition fuel that tells the algorithm the video is worth recommending more broadly.

### Shorts & Clips Schedule

| Asset | Platform | Drop Time | Day |
|---|---|---|---|
| **Short #1 — "The Reveal"** | YouTube Shorts | 6:00 PM PT | Day 0 (same day) |
| **Short #2 — "The Question That Broke Them"** | TikTok | 12:00 PM PT | Day +1 (Friday) |
| **Short #3 — "They Didn't Expect This Answer"** | Instagram Reels | 10:00 AM PT | Day +2 (Saturday) |
| **Short #4 — "Gen Z Has No Filter"** | TikTok + YT Shorts | 5:00 PM PT | Day +4 (Monday) |
| **Community Post #2 — Quote Card** | YouTube | 3:00 PM PT | Day +3 (Sunday) |

### Frequency Reasoning

**4 Shorts across 5 days, staggered across platforms.** This cadence is designed to:
- Sustain traffic_external_pct (LASSO-stable for engagement_comment_ratio, engagement_like_ratio, engagement_overall_ratio, and outlier_retention_score) by driving cross-platform referral traffic back to the main video
- Avoid cannibalization — each Short pulls a *different* moment, serving as a trailer rather than a substitute
- Maintain share_intent_score momentum (LASSO-stable for views_public and engagement_comment_ratio) across the critical first-week window

---

## II. PLATFORM CUTS — Specs, Moments, Titles

---

### A. YouTube Short #1 — "The Reveal"

**Cut Spec:**
- Duration: 45–55 seconds (sweet spot for YT Shorts algorithm)
- Aspect: 9:16, 1080×1920
- Captions: Burned-in, bold white with black outline, max 2 lines
- Pacing: Hard cut on reaction faces; no slow fades

**What Moment to Pull:**
The ex-mechanic reveal — the single highest-tension moment where information asymmetry collapses. This is the peak that drives ms_reveal_density_scale_var (LASSO-stable for views_public) and escalation_intensity. Structure the Short as:
1. **(0–5s)** One participant mid-question, visibly nervous — hook the scroll-stop
2. **(5–30s)** Build-up: the question that leads to the reveal, intercut with other participants' faces showing anticipation
3. **(30–45s)** The reveal itself + raw, uncut reactions. End on the most expressive face BEFORE resolution.

**Title/Caption:**
> **"nobody expected this from a Gen Z stranger 😳"**

Lowercase intentional — matches native Shorts tone. The emoji serves as a visual stop-sign in the feed.

**End Card:** "Full video ↑ on our channel" with a verbal CTA ("watch what happens next").

---

### B. TikTok #1 — "The Question That Broke Them"

**Angle:** TikTok rewards *emotional volatility* and comment-section debate. We're optimizing for comment_avg_length and comment_question_rate (both LASSO-stable across multiple engagement and retention metrics). The angle here is **controversy-adjacent without being offensive** — a question that splits opinion.

**Cut Spec:**
- Duration: 30–40 seconds (TikTok's current algorithm favors completion rate; shorter = higher loop potential, which feeds loop_quality_score — a top predictor of ret_end_ratio)
- Aspect: 9:16, 1080×1920
- Text overlay: TikTok-native font (Classic or bold), positioned in the upper third to avoid UI overlap
- Sound: Original audio, no music bed — authenticity signals outperform on TikTok for interview content

**What Moment to Pull:**
The most *divisive* question-and-answer exchange — ideally a moment where one person's answer makes another visibly uncomfortable or triggers a laugh-shock combo. This targets levity_intensity_ratio (LASSO-stable for retention_30s and ret_end_ratio) — the tonal whiplash between humor and vulnerability.

**Title/Caption:**
> **"Gen Z truth or drink went too far 💀 would you have answered this?"**

The direct question at the end is engineered to drive comment_question_rate and comment_avg_length. [[H02: Direct audience question in TikTok caption vs. statement-only caption on comment volume and avg comment length|"would you have answered this?" CTA]].

**Hashtags:** #truthordrink #genz #cut #strangers #neverhaviever

---

### C. Instagram Reels — "They Didn't Expect This Answer"

**Cut Spec:**
- Duration: 35–50 seconds
- Aspect: 9:16, 1080×1920
- Captions: Stylized, on-brand (CUT's visual identity — clean, minimal)
- Cover frame: Select a mid-reaction freeze frame with high thumb_contrast_rms and thumb_sharpness (both LASSO-stable for views_public and engagement_comment_ratio). The cover image IS the thumbnail for Reels — it must stop the scroll.

**What Moment to Pull:**
A *wholesome surprise* — the moment where a Gen Z participant says something unexpectedly deep or emotionally raw that reframes how we see them. Instagram's audience skews toward shareability over controversy. This targets ending_vs_mean_sentiment (LASSO-stable for engagement_like_ratio and engagement_overall_ratio) and shareability_score (LASSO-stable for ret_stability and outlier_retention_score).

**Title/Caption:**
> **"this is the most honest thing a stranger has ever said on our show 🥹"**
>
> **"Gen Z gets a bad rap but this moment changed my mind. Full ep on YouTube — link in bio."**

**Instagram Story (same day):** Repost the Reel to Stories with a poll sticker: "Could YOU answer this honestly to a stranger? 🫣" — drives engagement and primes the algorithm to push the Reel.

---

### D. YouTube Short #4 (Day +4) — "Gen Z Has No Filter"

**Cut Spec:** Same as Short #1 specs.

**What Moment to Pull:**
A rapid-fire montage — 3–4 of the funniest/most shocking one-liners, hard-cut back to back. This is a *compilation* Short, not a single-moment Short. It targets segment_count (r=+0.39 with views_public) and peaks_per_minute (LASSO-stable for engagement_comment_ratio) by packing density into a short window.

**Title/Caption:**
> **"Gen Z truth or drink but it's just the unhinged parts 😭"**

This serves as a second-wave discovery asset for people who missed the original upload, catching the Monday scroll-back-to-routine audience.

---

## III. CAPTION HOOK (Main Video Description)

```
They're Gen Z. They're strangers. And one of them is hiding something nobody saw coming.

We sat down a group of Gen Z strangers for Truth or Drink — but this time, the questions hit different. Secrets came out. Drinks were taken. And one reveal changed the entire energy in the room.

🔔 Subscribe & hit the bell: [link]
📱 Follow us:
TikTok: [link]
Instagram: [link]

#TruthOrDrink #GenZ #CUT #Strangers
```

**Why this works:** The first two lines (visible before "show more") contain the FOMO trigger ("hiding something nobody saw coming") and the emotional escalation promise ("changed the entire energy"). This is engineered for share_intent_score and parasocial_score (LASSO-stable for outlier_retention_score and ret_above_50_pct) — the viewer feels like they're about to witness something intimate and unrepeatable.

---

## IV. COMMUNITY POST IDEAS

### Community Post #1 — Pre-Release Poll (Day -1)

**Format:** Poll

> **"We just filmed Truth or Drink with Gen Z strangers and one of them dropped a secret that SHOOK the room. What do you think it was?"**
>
> 🔧 Secret career nobody expected
> 💔 An ex was in the room
> 🤫 They lied about their age
> 😳 Something we can't even hint at

**Why:** Polls have the highest engagement rate of any community post type. This seeds curiosity (title_fomo_score), drives notification clicks from subscribers (traffic_subscriber_pct), and creates a "payoff loop" — subscribers who vote will return to see if they were right, boosting payoff_satisfaction_score (LASSO-stable for views_public and ret_end_ratio). The correct answer (🔧) is deliberately the least dramatic-sounding option, maximizing surprise_rate_per_min when viewers discover the actual reveal.

### Community Post #2 — Quote Card (Day +3)

**Format:** Image post — a designed quote card with the most impactful line from the episode, overlaid on a still from the video.

> **"I thought people would judge me for it. But saying it out loud to strangers? That was the first time it felt okay."**
>
> This moment from our latest Truth or Drink hit different. If you haven't watched yet — you need to. ▶️ [link]

**Why:** This targets comment_sentiment_mean (LASSO-stable for 6 outcome metrics) by inviting empathetic, longer-form comments. It also serves as a re-engagement touchpoint for subscribers who saw the poll but haven't clicked through yet.

---

## V. COLLAB ANGLE & CROSS-PROMOTION

### Primary Collab Target: Gen Z Creator with Mechanic/Trades Background

**Why:** The ex-mechanic reveal is the narrative spine of this episode. Partnering with a creator who bridges the "unexpected career" space (e.g., a TikToker who makes trades content aimed at young audiences) creates authentic cross-pollination. This directly boosts traffic_external_pct (LASSO-stable for engagement_comment_ratio, engagement_like_ratio, engagement_overall_ratio, and outlier_retention_score).

**Execution:**
- The collab creator posts a **reaction clip** or **duet** of the reveal moment on TikTok, with their own commentary: *"As someone who's been there — this hit home. Go watch the full thing."*
- CUT reposts/stitches this on their own TikTok, creating a feedback loop.
- The collab creator is tagged in the YouTube description and pinned comment.

### Secondary Cross-Promotion: "Truth or Drink" Series Playlist Push

**Execution:**
- End screen of the main video links to the **Truth or Drink playlist** (not just the next video) — this boosts session time and signals series loyalty to the algorithm
- Pinned comment on the main video: *"If you loved this one, our [Exes Truth or Drink] is the one that started it all → [link]"*
- This leverages traffic_subscriber_pct for playlist depth and supports ret_stability (LASSO-stable: shareability_score, cliffhanger_score)

### Tertiary: Reddit & Twitter/X Seeding

- Post the most divisive question (without the answer) to r/GenZ or r/AskReddit as an organic-feeling discussion prompt: *"If you were playing Truth or Drink with strangers, would you answer [question] honestly?"*
- This seeds traffic_search_pct (top predictor of engagement_comment_ratio at r=+0.47 and engagement_overall_ratio at r=+0.25) by generating branded search queries ("CUT truth or drink gen z") [[H03: Reddit/Twitter seeding of episode question on traffic_search_pct lift within 72 hours of upload|Reddit discussion seeding strategy]].

---

## VI. HYPOTHESIS TRACKER — EMBEDDED TESTS

| ID | Test | Metric to Watch | Measurement Window |
|---|---|---|---|
| **[[H01: FOMO title framing vs. neutral title on algorithmic pickup rate within first 6 hours\|H01]]** | "But One Person Has a Secret" FOMO framing vs. potential A/B with neutral title | traffic_algorithmic_pct, views_public (first 6h) | 0–6 hours post-upload |
| **[[H02: Direct audience question in TikTok caption vs. statement-only caption on comment volume and avg comment length\|H02]]** | TikTok caption ending with direct question vs. statement-only (test on Short #2 vs. Short #4) | comment_avg_length, comment_question_rate, engagement_comment_ratio | 48 hours per Short |
| **[[H03: Reddit/Twitter seeding of episode question on traffic_search_pct lift within 72 hours of upload\|H03]]** | Seeded discussion posts on Reddit/X driving branded search traffic | traffic_search_pct, traffic_external_pct | 72 hours post-seed |

---

## VII. SUMMARY — KEY DISTRIBUTION LEVERS

| Signal | Why It Matters | How This Plan Activates It |
|---|---|---|
| **traffic_algorithmic_pct** | #1 predictor of views (r=+0.48) | Thursday upload timing, FOMO title, subscriber pre-heat via community post |
| **geo_us_pct** | LASSO-stable across 15+ metrics | All Shorts/clips drop during US peak hours; English-first captions |
| **share_intent_score** | LASSO-stable for views + comments | Wholesome Reel for IG sharing; divisive TikTok for debate-sharing |
| **title_fomo_score** | LASSO-stable for views, retention, outlier potential | "Secret" framing in main title; curiosity gaps in all Short titles |
| **traffic_external_pct** | LASSO-stable for 5 engagement/retention metrics | Collab creator duet, Reddit seeding, IG link-in-bio |
| **comment_avg_length** | LASSO-stable for 4 engagement metrics | Direct questions in captions, emotional quote card community post |

This plan is designed to create a **multi-platform ignition sequence** — subscriber heat on Day -1, algorithmic runway on Day 0, cross-platform fuel on Days +1 through +4 — with each asset serving a distinct role in the funnel rather than competing for the same attention.