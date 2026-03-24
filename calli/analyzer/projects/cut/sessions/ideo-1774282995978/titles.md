# PRODUCTION NOTE + FORMAT DEVELOPMENT ANALYSIS "Wou — Titles

# CUT Analytics — Title Strategy Brief
## Episode: Truth or Drink · Gen Z Edition

---

## STRATEGIC PREAMBLE

Before diving into titles, here's the ML context shaping every decision:

**Traffic source priority:** `traffic_algorithmic_pct` is the single most consistent LASSO-stable predictor across views, retention, and retention stability — meaning titles that pull cold algorithmic audiences (not just subscribers) must do the heavy lifting of the thumbnail. Gen Z content skews toward Browse/Suggested discovery, so titles must function as standalone curiosity hooks with zero prior context assumed.

**Geo signal:** `geo_us_pct` is positively correlated with retention, engagement, and outlier retention scores. Gen Z Truth or Drink content likely skews US-heavy, which is a structural advantage — lean into culturally specific Gen Z vernacular to reinforce that geo signal.

**FOMO + Cliffhanger architecture:** `title_fomo_score` and `cliffhanger_score` are both LASSO-stable for `ret_baseline`, `outlier_retention_score`, and `ret_above_50_pct` — meaning these aren't just click drivers, they're retention architecture. A title that creates an unanswered question primes the viewer to stay longer.

**Personal address (`title_personal_you`):** LASSO-stable for `ret_30s`, `ret_stability`, and `ret_initial_drop` — this is a retention-at-the-seam signal, not just a click signal. "You" language reduces the initial drop-off cliff.

**Levity-intensity balance:** `levity_intensity_ratio` predicts `ret_end_ratio` — humor-forward titles may actually improve watch-through to the end, not just attract clicks.

---

## THE 8 TITLES

---

### 1. VULNERABILITY

**"We Asked Gen Z Their Deepest Secrets. They Actually Told Us."**

**Why it works:**
The phrase "deepest secrets" activates `title_fomo_score` by implying rare, gated content that only exists in this video — the viewer suspects they're about to witness something that won't be repeated. The word "Actually" is a critical psychological pivot: it signals that the expected social performance (deflection, laughing it off) was abandoned, which is the vulnerability payoff Gen Z audiences find most compelling on parasocial content. This maps directly to `parasocial_score` being LASSO-stable for `outlier_retention_score` and `ret_baseline` — the sense that you're witnessing something real, not scripted, is what keeps people watching past the 30-second mark and correlates with `retention_30s` via `traffic_algorithmic_pct` pull. The structure also supports [[H01:A/B test "Actually Told Us" vs. "Told Us Everything" to measure CTR delta on Browse traffic|"Actually Told Us"]] — the surprise-confirmation word may function as a micro-cliffhanger in the title itself.

---

### 2. CURIOSITY

**"Truth or Drink: The Questions Gen Z Is Too Scared to Answer Sober"**

**Why it works:**
"Too Scared to Answer Sober" is a dual-layered curiosity hook — it implies both emotional danger (the questions are threatening) and social lowering-of-inhibitions (alcohol as truth serum), which together create an information gap the viewer needs to close by watching. `ms_reveal_density_scale_var` is LASSO-stable for `views_public`, suggesting that videos perceived as having distributed reveal moments outperform — and this title promises a *series* of reveals, not just one, which sets that expectation at the title level. The phrase "Gen Z" as a demographic anchor serves a dual function: it targets the in-group identity of the audience while also triggering the out-group curiosity of adjacent demographics (Millennials, Gen Alpha) who want to understand what Gen Z is actually like unfiltered. This supports `geo_us_pct` alignment since US-based Gen Z and their adjacent cohorts represent the dominant viewer pool for this content type. [[H02:Test whether including "Sober" in the title increases comment_ratio vs. removing it, as the alcohol implication may drive external traffic|"Sober"]] could be a meaningful variable in search-driven discovery via `traffic_search_pct`.

---

### 3. FOMO

**"Every Gen Z Truth or Drink Ends the Same Way (Ours Didn't)"**

**Why it works:**
This title is structurally a pattern interrupt — it establishes a category norm ("every Gen Z Truth or Drink ends the same way") and then immediately breaks it, which is the most efficient activation of `title_fomo_score` because the viewer cannot resolve the implied promise without watching to the end. The parenthetical "(Ours Didn't)" is a compression of the entire narrative arc into five words, functioning as a micro-cliffhanger that directly supports `cliffhanger_score`, which is LASSO-stable across `ret_baseline`, `ret_30s`, `ret_stability`, `ret_above_50_pct`, and `ret_initial_drop` — essentially the full