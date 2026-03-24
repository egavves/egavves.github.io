# Exes Read Each Other's Lies Out Loud" is action-forward and  — Distribution



## Distribution Plan: "Exes Confess the Lies They Told Each Other | Truth or Drink"

---

## Cadence: Full Release & Supporting Content Schedule

**Full Episode Launch: Thursday, 11:00 AM PT**

- **Reasoning:** Traffic_algorithmic_pct is the single strongest predictor of views_public (r=+0.48) and retention metrics. Thursday mid-morning maximizes the algorithmic discovery window before the weekend content flood. Launching here gives YouTube's recommendation engine ~48 hours of high-engagement signal accumulation before Saturday's browse-heavy traffic spike.

**Shorts/Clips Schedule:**

| Asset | Platform | Post Time | Day |
|-------|----------|-----------|-----|
| Short #1 (Teaser/Hook) | YouTube Shorts + TikTok | 6:00 PM PT | Wednesday (T-1) |
| Short #2 (Peak Moment) | YouTube Shorts + TikTok + IG Reels | 12:00 PM PT | Friday (T+1) |
| Short #3 (Emotional Payoff) | YouTube Shorts + TikTok + IG Reels | 5:00 PM PT | Sunday (T+3) |
| Short #4 (Reaction/Meme Cut) | TikTok + IG Reels | 7:00 PM PT | Tuesday (T+5) |

**Community Post Timing:**

- **T-2 (Tuesday):** Poll-style community post to prime subscriber base
- **T+0 (Thursday, 2:00 PM PT):** Pinned comment + community post driving back to full video
- **T+4 (Monday):** Behind-the-scenes or "what we didn't show you" community post to reignite traffic_subscriber_pct

**Frequency Reasoning:** The data shows traffic_subscriber_pct is LASSO-stable across retention_30s, ret_baseline, ret_stability, and ret_initial_drop — meaning subscriber-driven views produce structurally better retention curves. The T-1 teaser short primes subscribers; the staggered clip schedule sustains algorithmic signal (traffic_algorithmic_pct) across the critical 5-day discovery window. The 4-short cadence avoids cannibalization while maintaining peak_spacing_cv variation that the model links to higher views_public.

---

## Platform Cuts

### YouTube Shorts

**Short #1 — "The Lie That Ended Everything" (Teaser)**
- **Spec:** 45–55 seconds, vertical 9:16, 1080×1920, hard-coded captions (white with black outline), CUT branding lower-third
- **What to Pull:** The single most explosive confession moment — ideally where one ex reveals a lie and the other's face visibly shifts. Prioritize the moment with highest escalation_intensity and a clear emotional reveal (ms_reveal_density correlates with views_public via LASSO). Cut right before or right after the reaction — NOT both. Leave the resolution for the full video.
- **Title:** `"She lied about THIS the entire relationship… 😳 #truthordrink"`
- **Why:** Title_fomo_score is LASSO-stable for views_public and outlier_retention_score. The unresolved "THIS" creates an open loop driving full-episode clickthrough. [[H14: test whether unresolved Shorts hooks increase full-episode CTR by 15%+ vs. resolved hooks|open-loop teaser strategy]]

**Short #2 — "Gen Z Has No Filter" (Peak Moment)**
- **Spec:** 30–40 seconds, same visual spec, faster pacing (higher wpm — which correlates with ret_30s at r=+0.23)
- **What to Pull:** The funniest or most unhinged moment of raw honesty — something that feels generationally specific. Look for a moment with high levity_intensity_ratio (top predictor of ret_end_ratio, r=+0.29) that also has a natural punchline ending.
- **Title:** `"Gen Z exes have ZERO chill 💀 #truthordrink #genz"`

**Short #3 — "The Moment They Almost Cried" (Emotional Payoff)**
- **Spec:** 50–60 seconds, slightly slower pacing, allow silence/pauses to breathe
- **What to Pull:** The vulnerability peak — where emotional intensity hits maximum (ms_emotional_intensity_max). This should be the payoff_satisfaction_score moment. Include the resolution/hug/laugh that follows.
- **Title:** `"This is why exes should never play Truth or Drink 🥺"`

---

### TikTok

**Angle: "Unhinged Honesty" — lean into chaotic, meme-able energy**

- **Cut Spec:** 20–35 seconds preferred (shorter than YT Shorts), native TikTok captions using trending font, no CUT watermark on first frame (algorithm penalty), add it at end card
- **What to Pull:** Prioritize reaction-worthy micro-moments — a single question-answer exchange that works completely out of context. The data shows traffic_external_pct is LASSO-stable for engagement_comment_ratio and engagement_overall_ratio, meaning TikTok-to-YouTube pipeline viewers are disproportionately high engagers.
- **Title/Caption:** `"my ex really said this with a straight face 😭💀" // no hashtag spam — max 3: #truthordrink #exes #genz`
- **Sound Strategy:** Use original audio but overlay a trending sound at the very beginning (first 0.5s) to catch the algorithm's sound-matching, then let the dialogue carry. [[H09: test whether trending sound primers in first 0.5s increase TikTok completion rate vs. pure original audio|TikTok sound-primer hypothesis]]

**TikTok Short #4 (T+5) — "The Comment Section Writes the Caption"**
- Pull the most meme-able single reaction shot (2–4 seconds of face) and loop it. Caption: `"POV: your ex starts telling the truth for the first time"` — designed to maximize comment_avg_length and share_intent_score, both LASSO-stable engagement drivers.

---

### Instagram Reels

**Angle: "Aesthetic Vulnerability" — polished, emotionally resonant, shareable**

- **Cut Spec:** 30–45 seconds, 9:16, color-graded slightly warmer than YouTube version, add subtle motion graphics for key text moments. Thumb_colorfulness and thumb_contrast_rms are LASSO-stable across multiple retention metrics — ensure the Reel cover frame is high-saturation with strong contrast.
- **What to Pull:** The most "send this to your ex" moment — something relatable enough to DM. Share_intent_score is LASSO-stable for views_public, and Instagram's DM-share behavior is the primary algorithmic signal for Reels distribution.
- **Title/Caption:** `"The question that broke them 💔 Full video on YouTube — link in bio"`
- **Cover Frame:** High-contrast still of both exes mid-reaction, text overlay: "EXES CONFESS" in bold serif. Optimize for thumb_brightness (LASSO-stable for engagement_comment_ratio — but note negative correlation, so go medium-dark/moody rather than blown-out bright).

---

## Caption Hook & Community Post Idea

### Full Episode YouTube Description Hook (First 2 Lines)

> **"They dated for 2 years. They broke up 6 months ago. They've never talked about what really happened — until now."**
> **"Watch what happens when Gen Z exes finally stop lying to each other. 🍷"**

- **Reasoning:** The first line establishes stakes and specificity (parasocial_score is LASSO-stable for outlier_retention_score and ret_baseline). The second line uses "Gen Z" as a tribal identifier and "stop lying" as the inverse of the title's "confess lies" — reinforcing the FOMO loop.

### Community Post (T-2, Tuesday)

**Format: Poll + Image**

> **Image:** Split-screen still of the two exes sitting across from each other, pre-game, looking nervous. High thumb_center_weight composition (LASSO-stable for ret_initial_drop and ret_above_50_pct).
>
> **Text:** *"New Truth or Drink drops Thursday. These exes haven't spoken since the breakup. What do you think comes out first?"*
>
> **Poll Options:**
> - 🤥 The lies they told during the relationship
> - 💔 Why they REALLY broke up
> - 😳 Feelings they still have
> - 🍷 They drink every single question

- **Reasoning:** Poll posts drive comment_question_rate (LASSO-stable for ret_30s and ret_initial_drop) and prime the subscriber notification pipeline. The options are designed to set expectations that the video then subverts — increasing surprise_rate_per_min perception.

### Community Post (T+4, Monday — Re-ignition)

> **"The moment at 8:42 broke the entire crew. If you haven't watched yet — this one's different. 🥺"**
> *(Link to full video)*

- Timestamp specificity drives curiosity clicks; "the crew broke" adds parasocial texture.

---

## Collab Angle & Cross-Promotion

### Primary Collab Target: The Cast Themselves

- **Strategy:** Gen Z Truth or Drink participants likely have their own social followings (even modest ones). Have each participant post their own reaction to the video on their personal TikTok/Instagram with a tagged CUT mention. Traffic_external_pct is LASSO-stable for engagement_comment_ratio (r=+0.42 for top predictor) and engagement_overall_ratio — external inbound traffic from participant audiences converts at higher engagement rates than any other source.
- **Execution:** Provide each participant with 2-3 pre-approved clip options they can post natively. Let them add their own commentary/reaction. Authenticity > polish here.

### Secondary Collab: Gen Z Relationship Commentary Creators

- **Targets:** Creators in the "relationship advice / dating commentary" space (think: TikTok therapists, dating coaches, "girl/guy talk" podcasters) who can react to the most intense clip.
- **Angle:** Send them Short #3 (the vulnerability peak) with permission to react/stitch. Frame it as: *"What a therapist thinks about this Truth or Drink moment."* This drives traffic_search_pct (top predictor of engagement_comment_ratio at r=+0.47) as viewers search for the original after seeing the reaction. [[H22: test whether seeding clips to commentary creators 48h post-launch increases traffic_search_pct by measurable margin vs. organic discovery|creator-seeding search traffic hypothesis]]

### Cross-Promotion Within CUT Ecosystem

- **Pinned Comment Strategy:** On the 2 most recent CUT videos, pin a comment from the CUT account: *"If you liked this, our new Gen Z Truth or Drink just dropped and it's the most honest one we've ever filmed → [link]"*
- **End Screen:** Update the end screens of the 3 highest-performing recent Truth or Drink episodes to point to this new video. Traffic_subscriber_pct is LASSO-stable across 7+ outcome metrics — recycling existing subscriber attention is the highest-ROI distribution lever.

### Geo-Targeting Note

- **Critical insight:** geo_us_pct is positively correlated with nearly every retention and engagement metric (r=+0.45 for ret_baseline, +0.42 for retention_30s, +0.41 for ret_initial_drop). geo_asia_pct is negatively correlated across the board. **Prioritize US-centric distribution timing, language, and cultural framing.** Do NOT optimize thumbnails or titles for international/translated appeal at the expense of US resonance. The Gen Z framing naturally indexes American, which is strategically correct here.
- **Secondary geo opportunity:** geo_eu_pct is LASSO-stable for engagement_like_ratio, engagement_comment_ratio, and ret_stability. Consider a single IG Reel with caption language that resonates with UK/EU audiences (*"This is so American and I'm obsessed"* energy) to capture that engagement pocket.

---

## Summary: Key Hypotheses Embedded

| Hypothesis | What We're Testing | Where It's Activated |
|---|---|---|
| [[H14: test whether unresolved Shorts hooks increase full-episode CTR by 15%+ vs. resolved hooks\|open-loop teaser strategy]] | Does leaving the Shorts moment unresolved drive more full-episode views? | YouTube Short #1 |
| [[H09: test whether trending sound primers in first 0.5s increase TikTok completion rate vs. pure original audio\|TikTok sound-primer hypothesis]] | Does a 0.5s trending sound hook improve TikTok algorithmic pickup? | TikTok cuts |
| [[H22: test whether seeding clips to commentary creators 48h post-launch increases traffic_search_pct by measurable margin vs. organic discovery\|creator-seeding search traffic hypothesis]] | Does proactive creator seeding measurably lift search-driven discovery? | Collab strategy with commentary creators |