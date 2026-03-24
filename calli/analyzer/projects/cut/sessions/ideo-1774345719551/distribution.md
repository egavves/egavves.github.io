# PRODUCTION NOTE: "My Ex Rated My New Partner — The — Distribution



## Distribution Plan: "Exes Rate Each Other's New Partners Over Drinks… And It Gets Too Real"

---

## Cadence: Full Episode & Supporting Content Schedule

**Full Episode Drop: Thursday, 11:00 AM PT**

- **Reasoning:** Traffic_algorithmic_pct is the single strongest predictor of views_public (r=+0.48) and retention metrics. Thursday mid-morning maximizes the algorithmic recommendation window heading into the weekend browse cycle, when CUT's core US audience (geo_us_pct is LASSO-stable across nearly every outcome metric) is most active. Dropping before Friday avoids competition with weekend creator dumps.

**Shorts/Clips Schedule:**

| Content Piece | Platform | Drop Time | Days Relative to Full Ep |
|---|---|---|---|
| Teaser Short #1 (Hook Clip) | YouTube Shorts, TikTok, IG Reels | Tuesday, 6:00 PM PT | T-2 days |
| Teaser Short #2 (Escalation Clip) | YouTube Shorts, TikTok, IG Reels | Wednesday, 12:00 PM PT | T-1 day |
| Community Post (Poll) | YouTube Community | Wednesday, 5:00 PM PT | T-1 day |
| **FULL EPISODE** | **YouTube** | **Thursday, 11:00 AM PT** | **Day 0** |
| Reaction/Aftermath Short | YouTube Shorts, TikTok, IG Reels | Friday, 3:00 PM PT | T+1 day |
| "Best Of" Compilation Short | YouTube Shorts, TikTok | Sunday, 10:00 AM PT | T+3 days |
| Community Post (Follow-up) | YouTube Community | Monday, 12:00 PM PT | T+4 days |

**Frequency Reasoning:**

- The pre-episode teasers serve dual purpose: they seed the algorithm with engagement signals (comment_sentiment_mean and share_intent_score are both LASSO-stable for views_public) and build subscriber notification priming (traffic_subscriber_pct is LASSO-stable for retention_30s and ret_stability). Two teasers spaced 18 hours apart create a mini-escalation arc that mirrors the in-video escalation_intensity pattern the model flags as predictive.
- Post-episode clips on Friday and Sunday capture the long-tail algorithmic push. Since traffic_algorithmic_pct correlates strongly with ret_stability (r=+0.39), keeping the algorithm fed with fresh derivative content extends the recommendation lifecycle of the main video.

---

## Platform Cuts

### YouTube Shorts

**Cut #1 — "The Rating That Broke Them" (Teaser, T-2)**

- **Spec:** 45–55 seconds, vertical 9:16, 1080x1920, hard-coded captions (white with black outline), thumbnail-first frame with high contrast and center-weighted face composition
- **What to Pull:** The single highest-escalation moment where one ex gives a brutally honest rating of the new partner. Prioritize the moment with the sharpest sentiment swing — the model shows escalation_intensity and payoff_satisfaction_score are both LASSO-stable for views_public. Cut should start 3 seconds *before* the question is asked (builds micro-tension) and end on the reaction face, NOT the resolution. [[H14: test whether clipping pre-payoff vs. post-payoff drives higher Shorts CTR|Cut before the resolution lands to test incomplete-loop engagement]]
- **Title:** "she rated his new girlfriend a 2 out of 10… 😳 #truthordrink"

**Cut #2 — "The Question Nobody Expected" (Teaser, T-1)**

- **Spec:** 30–40 seconds, same visual spec, fast-paced with 2–3 quick reaction cuts
- **What to Pull:** A high-surprise moment (surprise_rate_per_min is LASSO-stable for outlier_retention_score). Ideally a question that shifts the power dynamic — e.g., "Do you think they're better in bed than me?" The Gen Z framing means this should feel unfiltered and chaotic.
- **Title:** "gen z has NO filter in truth or drink 💀"

**Cut #3 — "The Moment They Almost Walked Out" (Post-drop, T+1)**

- **Spec:** 50–60 seconds, include a text overlay "from our new video — link in comments"
- **What to Pull:** The peak emotional intensity moment. ms_emotional_intensity_max_argmax_scale is LASSO-stable for engagement_comment_ratio — this clip should be optimized to drive comments back to the full video.
- **Title:** "this got way too personal… full video is up now 🍷"

---

### TikTok

**Angle: "Unhinged Gen Z Energy" — lean into chaotic, meme-able moments**

- **Spec:** 30–45 seconds max (TikTok's algorithm currently favors completion rate; shorter = higher loop potential). Vertical 9:16, native TikTok captions using auto-caption tool for platform-native feel. Add trending sound underneath at 10% volume if applicable.
- **What to Pull:** The most *quotable* exchange — something that can become a sound or a meme template. The model shows that turns_per_minute is LASSO-stable for engagement_like_ratio, so prioritize rapid-fire back-and-forth dialogue over monologue moments. Look for a 3–5 exchange volley that escalates quickly.
- **Title/Caption:** "gen z exes should NOT be allowed to play truth or drink 😭💀 (full vid on youtube — CUT)"
- **Hashtags:** #truthordrink #cut #exes #genz #datinginthecity #relatable
- **CTA Strategy:** Pin a comment: "the full video is even worse… link in bio 🫣" — this drives traffic_external_pct which is LASSO-stable for engagement_comment_ratio and engagement_overall_ratio. [[H09: test whether pinned comment CTA vs. caption CTA drives higher YouTube click-through from TikTok|Pin the CTA in comments rather than caption to test external traffic conversion]]

---

### Instagram Reels

**Angle: "The Vulnerability Edit" — emotionally resonant, slightly more polished**

- **Spec:** 40–60 seconds, 9:16, slightly color-graded warmer than YouTube/TikTok versions. Use Instagram's native text tool for captions (signals native content to the algorithm). Include a carousel-style opening frame: "Exes rate each other's new partners… over drinks 🍷"
- **What to Pull:** The most emotionally raw moment — where someone's guard drops and genuine vulnerability surfaces. The ending_vs_mean_sentiment variable is LASSO-stable for both engagement_like_ratio and engagement_overall_ratio, suggesting that emotional contrast (ending sentiment vs. mean) drives deeper engagement. Pull a moment where humor shifts to sincerity.
- **Title/Caption:** "when the drinks hit and the walls come down… 🥺🍷 this one got us. full video on youtube — link in bio"
- **Story Support:** Post 3 IG Stories on drop day: (1) "New video just dropped 👀" with swipe-up, (2) a poll — "Could YOU rate your ex's new partner to their face?", (3) a behind-the-scenes still from filming with "the energy on set was UNREAL"

---

## Caption Hook & Community Post Idea

### YouTube Full Episode Caption Hook

> "We sat down Gen Z exes, gave them drinks, and asked them to rate each other's new partners. To their faces. What happened next is exactly as chaotic as you'd expect — and then it got way too real. 🍷
>
> Drop a 🔥 if you could handle this. Drop a 💀 if you'd walk out.
>
> Who do you think handled it better? Tell us in the comments."

**Why this works:** The caption targets three LASSO-stable engagement drivers simultaneously: comment_sentiment_mean (by prompting emotional self-identification), share_intent_score (the "could YOU handle this" framing activates social comparison sharing), and comment_avg_length (the open-ended "who handled it better" question invites longer-form responses). The emoji prompts also boost comment volume, which feeds engagement_comment_ratio.

---

### Community Post #1 (T-1, Wednesday)

**Format: Poll**

> **"New Truth or Drink drops TOMORROW 🍷"**
>
> This time: Gen Z exes rate each other's new partners. Over drinks. To their faces.
>
> Be honest — could you do this?
>
> 🟢 Yes, I'm built different
> 🔴 Absolutely not
> 🟡 Only if I was drunk enough

**Why this works:** Community post engagement signals prime the subscriber notification pipeline. Since traffic_subscriber_pct is LASSO-stable for retention_30s, ret_stability, and ret_initial_drop, activating subscribers before the drop directly improves early retention metrics — which in turn signals the algorithm to push harder on traffic_algorithmic_pct.

### Community Post #2 (T+4, Monday)

**Format: Image + Question**

> *[Still frame of the most intense moment — high contrast, center-weighted face, matching thumbnail aesthetic]*
>
> "This moment broke the internet this weekend. If you haven't watched yet… what are you doing? 👀
>
> Drop the timestamp of YOUR favorite moment below ⬇️"

**Why this works:** Timestamp comments drive re-watches (boosting retention curves) and signal deep engagement to the algorithm. This also extends the video's lifecycle into week two, maximizing the long-tail algorithmic push.

---

## Collab Angle & Cross-Promotion

### Primary Collab Target: Gen Z Dating/Relationship Creators

- **Ideal Partners:** Creators in the 500K–2M subscriber range who cover dating culture, relationship advice, or reaction content (e.g., Kat Theo, Courtney Ryan, or similar). The parasocial_score variable is LASSO-stable for both outlier_retention_score and ret_above_50_pct — collaborating with creators whose audiences have high parasocial investment amplifies this signal.
- **Collab Format:** Invite one creator to appear as a "judge" or "commentator" in a companion Short where they react to the most intense clip. Their audience cross-pollinates into CUT's ecosystem, boosting geo_us_pct traffic (the strongest single predictor of retention metrics across the board).

### Secondary Collab: Podcast/Commentary Circuit

- **Pitch angle:** Offer exclusive behind-the-scenes footage or an extended "what happened after" clip to 2–3 mid-tier commentary podcasts or YouTube channels. This drives traffic_external_pct, which is LASSO-stable for engagement_comment_ratio, engagement_overall_ratio, and views_public. [[H22: test whether podcast/commentary cross-promotion drives measurably higher traffic_external_pct compared to social-only distribution|Seed external traffic through podcast cross-promotion to test the external traffic engagement multiplier]]

### Cross-Promotion Mechanics

- **Creator tags in all Shorts/Reels** (if collab partner participates)
- **Shared community post** on collab partner's channel with CUT video link
- **Dual-premiere option:** If a reaction creator wants to premiere their reaction simultaneously with CUT's drop, coordinate for Thursday afternoon (4 hours post-drop) to ride the initial algorithmic wave

---

## Summary: Key Hypotheses Embedded

| Hypothesis | Test Description | Where Applied |
|---|---|---|
| [[H14: test whether clipping pre-payoff vs. post-payoff drives higher Shorts CTR\|Cut before the resolution lands]] | Incomplete-loop Shorts editing | YouTube Short #1 |
| [[H09: test whether pinned comment CTA vs. caption CTA drives higher YouTube click-through from TikTok\|Pin the CTA in comments]] | TikTok-to-YouTube conversion | TikTok distribution |
| [[H22: test whether podcast/commentary cross-promotion drives measurably higher traffic_external_pct\|Seed external traffic through podcast cross-promotion]] | External traffic engagement multiplier | Collab strategy |

---

**Bottom Line:** This episode's Gen Z + vulnerability + alcohol formula is algorithmically primed for strong performance — but only if the distribution cadence front-loads subscriber engagement (to boost early retention signals) and back-loads external/search traffic (to extend the engagement tail). Every cut, caption, and community post above is designed to activate the specific traffic source and engagement variables the model identifies as causal levers, not just correlated noise.