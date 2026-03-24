# PRODUCTION NOTE + FORMAT DEVELOPMENT ANALYSIS "Tru — Distribution



## Distribution Plan: "They Still Share Each Other's Passwords — Now They Have to Answer for It"

### Truth or Drink — Gen Z Edition

---

## Cadence: Full Release & Supporting Content Schedule

**Full Episode Release: Thursday, 11:00 AM PT**

- **Reasoning:** Traffic_algorithmic_pct is the single strongest predictor of views_public (r=+0.48) and retention metrics. Thursday releases give the algorithm 48+ hours of weekday momentum before weekend browsing spikes. The 11 AM PT window catches East Coast afternoon scrollers and West Coast lunch breaks — critical given that geo_us_pct is LASSO-stable across nearly every outcome metric (views, retention, engagement, outlier potential).

**Shorts/Clips Schedule:**

| Content | Timing | Platform | Purpose |
|---|---|---|---|
| **Teaser Short #1** (password reveal moment) | Tuesday, 6 PM PT (T-2 days) | YouTube Shorts, TikTok, IG Reels | Seed algorithmic interest, build anticipation |
| **Full Episode** | Thursday, 11 AM PT | YouTube | Core release |
| **Reaction Short #2** (highest emotional peak) | Thursday, 5 PM PT (+6 hrs) | YouTube Shorts, TikTok | Ride initial algorithmic push, capture evening scroll |
| **Community Post** (poll/engagement bait) | Friday, 12 PM PT (+1 day) | YouTube Community Tab | Boost comment_sentiment_mean and comment_avg_length — both LASSO-stable for engagement |
| **Short #3** (unexpected vulnerability moment) | Saturday, 10 AM PT (+2 days) | TikTok, IG Reels | Weekend discovery audiences, target geo_latam_pct window |
| **Short #4** (comedic tension clip) | Monday, 6 PM PT (+4 days) | YouTube Shorts | Second-wave algorithmic push; levity_intensity_ratio (r=+0.29 for ret_end_ratio) suggests humor clips have long tails |

**Frequency Reasoning:** Four shorts across 6 days maintains algorithmic surface area without cannibalizing the main video. Peak_spacing_cv is LASSO-stable for views_public and retention outlier scores — meaning *irregular but deliberate spacing* of content peaks outperforms mechanical daily drops. The Tuesday-Thursday-Saturday-Monday cadence creates that variability.

---

## Platform Cuts

### YouTube Shorts

**Cut Spec:** 45–55 seconds, vertical 9:16, 1080x1920, hardcoded captions (white with black outline), CUT branding bug lower-left corner.

**Short #1 — "The Password Moment"**
- **What to Pull:** The moment where the password-sharing detail is revealed AND the first genuine reaction of discomfort/surprise. Include the question being read, the beat of hesitation, and the raw answer. End on an unresolved facial expression — no resolution.
- **Title:** "they still know each other's passwords and it shows 😬"
- **Why:** Cliffhanger_score is LASSO-stable for ret_baseline, ret_30s, ret_stability, ret_initial_drop, and ret_above_50_pct. Cutting before the emotional payoff drives click-through to the full video. [[H14:test whether unresolved Short endings drive higher full-video CTR than resolved endings|Ending on tension rather than payoff is a testable hypothesis for driving main-video traffic]].

**Short #2 — "The Escalation Peak"**
- **What to Pull:** The single highest-intensity emotional exchange — likely a question that forces genuine confession. Include the buildup question + the answer + the other person's visceral reaction. Cut at the peak of the reaction.
- **Title:** "this question broke them 💀"
- **Why:** Escalation_intensity is LASSO-stable for views_public. This clip should showcase the escalation_sentiment arc in miniature.

**Short #4 — "The Levity Moment"**
- **What to Pull:** A moment where tension breaks into genuine laughter — the comedic relief beat after heavy vulnerability. Include enough preceding tension to make the laughter land.
- **Title:** "gen z truth or drink goes OFF the rails"
- **Why:** Levity_intensity_ratio is LASSO-stable for retention_30s and ret_end_ratio. This clip targets the humor-discovery audience who may not click vulnerability-forward content.

---

### TikTok

**Cut Spec:** 30–45 seconds, vertical 9:16, native captions via CapCut (trending font style), no watermark from other platforms, trending sound layered underneath at 10% volume if applicable.

**Angle: "Unhinged Gen Z Honesty"**

TikTok's algorithm rewards share_intent_score (LASSO-stable for views_public and comment_ratio). The angle here is *shareability through relatability* — "send this to someone you share passwords with."

**Clip #1 (Tuesday teaser):**
- **What to Pull:** Same password moment but trimmed tighter — 30 seconds max. Open on the question card, immediate reaction, cut to black with text: "full video on YouTube 👀"
- **Caption:** "pov: you still have your ex's netflix password and they find out on camera #truthordrink #genz #cut"
- **Why:** Traffic_external_pct is LASSO-stable for views_public, engagement_comment_ratio, engagement_like_ratio, and outlier_retention_score. TikTok is the primary external traffic driver. [[H09:test whether TikTok-first teasers with explicit YouTube callouts increase traffic_external_pct measurably vs. teasers without callouts|Testing explicit YouTube CTAs on TikTok clips against organic discovery]].

**Clip #2 (Thursday evening):**
- **What to Pull:** The most "screenshot-able" confession — something that reads as a meme even without audio. Think: a facial expression that communicates an entire story.
- **Caption:** "gen z will tell you EVERYTHING if you give them a drink 😭 #truthordrink #vulnerable #cut"

---

### Instagram Reels

**Cut Spec:** 35–50 seconds, vertical 9:16, polished captions (on-brand CUT typography), cover frame designed as a standalone image (high thumb_contrast_rms and thumb_colorfulness — both LASSO-stable for multiple engagement and retention metrics).

**Clip #1 (Tuesday):**
- **What to Pull:** A "beauty shot" edit of the emotional arc — slightly more produced than TikTok. Use the vulnerability moment but bookend it with a warm opening shot and a lingering close on the genuine human connection. IG Reels rewards watch-through, so the payoff should land *within* the clip.
- **Title/Caption:** "what happens when gen z has to be honest with each other 🥺 full video in bio"
- **Cover Frame:** Two participants mid-genuine-laugh, high color saturation, faces centered (thumb_center_weight and thumb_face_count are LASSO-stable for ret_baseline and ret_above_50_pct).

**Clip #2 (Saturday):**
- **What to Pull:** The unexpected vulnerability moment — something that shifts the tone from playful to real. This is the "save and share" clip.
- **Caption:** "this got way too real way too fast 💔 link in bio for the full thing"

---

## Caption Hook & Community Post Idea

### Full Video Caption Hook (YouTube Description, First 2 Lines)

> **"They've shared passwords, secrets, and apparently WAY too much — now they have to say it all out loud. 😬🍷"**
>
> **"Watch what happens when Gen Z honesty meets tequila. Drop a 🔑 in the comments if you've ever shared a password with someone you shouldn't have."**

**Why this works:** The comment prompt is specific and low-friction, targeting comment_avg_length (LASSO-stable for engagement_like_ratio, engagement_comment_ratio, engagement_overall_ratio, and ret_end_ratio) by inviting story-sharing. The emoji CTA lowers the barrier for quick engagement while the "someone you shouldn't have" framing invites longer confessional replies.

### Community Post (Friday, T+1 Day)

**Format:** Poll + Image

**Image:** A still frame from the video showing two participants mid-reaction, with overlaid text: "WOULD YOU SHARE YOUR PASSWORD WITH YOUR PARTNER?"

**Poll Options:**
- 🔑 Already do — no secrets
- 🔒 Absolutely not
- 😬 I did... and regretted it
- 💀 They don't know I still have theirs

**Caption:** "after this episode we NEED to know where you stand 👀 vote and explain yourself in the comments ⬇️"

**Why:** Community posts boost traffic_subscriber_pct (LASSO-stable for views, retention_30s, ret_baseline, ret_30s, ret_stability, ret_initial_drop, ret_above_50_pct, and outlier_retention_score). The poll format drives comment_question_rate engagement, and the "explain yourself" CTA targets comment_avg_length. This post also re-surfaces the video in subscriber feeds 24 hours post-launch, catching the second algorithmic evaluation window.

---

## Collab Angle & Cross-Promotion

### Primary Collab Target: Gen Z Relationship/Honesty Creators

**Ideal Partners:**
- **Creators in the "storytime/confession" space** (TikTok 500K–2M range) — their audiences have high share_intent_score alignment and skew geo_us_pct heavy, which is the strongest geographic predictor across nearly all metrics.
- **Podcast creators** who cover relationships/dating (e.g., "Cancelled" tier shows) — cross-promo via audiogram clips drives traffic_external_pct.

**Collab Format:**
- Send the collab partner ONE unresolved clip (the password moment, no payoff) with permission to post as a reaction/stitch. Their caption: "I NEED to see how this ends @CUT" — driving traffic back to the full video.
- **Why:** This leverages traffic_external_pct (LASSO-stable for 6+ outcome variables) and parasocial_score (LASSO-stable for outlier_retention_score and ret_above_50_pct). The stitch format creates a parasocial bridge between the collab creator's audience and CUT's participants. [[H22:test whether stitch/reaction collabs from mid-tier creators drive higher traffic_external_pct conversion than organic TikTok posts|Testing whether creator-stitch seeding outperforms CUT's own TikTok clips for external traffic conversion]].

### Cross-Promotion Strategy

| Channel | Action | Timing |
|---|---|---|
| **CUT Instagram Stories** | Behind-the-scenes of participants arriving, "what are they about to confess?" poll | Wednesday (T-1) |
| **CUT TikTok** | Teaser clip #1 with pinned comment: "full vid drops tomorrow" | Tuesday |
| **Participant social media** | Each participant shares their favorite moment clip to their personal accounts with tag | Thursday–Friday |
| **CUT Newsletter/Discord** | Early link + "guess the wildest confession" game | Thursday morning, 30 min pre-publish |
| **Collab creator stitch** | Unresolved clip reaction | Friday–Saturday |

### Secondary Cross-Promo: Spotify/Podcast Ecosystem

- If CUT has a podcast arm or adjacent audio content, pull a 90-second audio-only clip of the most emotionally intense exchange and distribute as an audiogram on Twitter/X and Threads. Audio-forward content targets a different discovery surface and can drive traffic_search_pct (top predictor of engagement_comment_ratio at r=+0.47) when viewers search for the full video after hearing the clip.

---

## Summary: Key Hypotheses Embedded

1. **[[H14:test whether unresolved Short endings drive higher full-video CTR than resolved endings|Cliffhanger Shorts hypothesis]]** — Leveraging cliffhanger_score's LASSO stability across 7 retention metrics by deliberately cutting Shorts before emotional resolution.

2. **[[H09:test whether TikTok-first teasers with explicit YouTube callouts increase traffic_external_pct measurably vs. teasers without callouts|TikTok-to-YouTube funnel hypothesis]]** — Testing whether explicit platform CTAs on TikTok meaningfully move traffic_external_pct, which is LASSO-stable for views, engagement, and outlier scores.

3. **[[H22:test whether stitch/reaction collabs from mid-tier creators drive higher traffic_external_pct conversion than organic TikTok posts|Creator-stitch seeding hypothesis]]** — Testing parasocial bridge content from collab creators against CUT's own distribution for external traffic generation.

---

*This plan prioritizes algorithmic surface area (traffic_algorithmic_pct), US-heavy geographic targeting (geo_us_pct), and engagement depth (comment_avg_length, share_intent_score) — the three pillars that the ML signals identify as most predictive of both raw viewership and outlier performance for CUT content.*