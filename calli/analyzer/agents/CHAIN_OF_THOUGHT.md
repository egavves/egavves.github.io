# Calli Ideation Pipeline — Chain-of-Thought Instructions

## Purpose

This document defines the chain-of-thought (CoT) process that governs how agents generate production content during ideation. The goal is to ensure **consistency**, **completeness**, and **quality** across all stages of the pipeline.

---

## Core Principle: Write Locally First, Then Copy

Every agent MUST follow this pattern:

1. **Write the full content to a local markdown file first** — e.g., `concept.md`, `storyboard.md`, `script.md`, etc.
2. **Read back the file** to verify it's complete (no truncation, no missing sections).
3. **Only then** copy the verified content into the session card for rendering in the dashboard.

This prevents the two most common failure modes:
- **Truncation**: Long-form content getting cut off when streaming directly to the UI
- **Inconsistency**: Different sections referencing different character names, timelines, or format mechanics

### File Locations

Each ideation session stores its files at:
```
analyzer/projects/{project}/sessions/{session_id}/
├── session.json          ← metadata (format, audience, duration, novelty, gender ratio)
├── concept.md            ← Production Note (Parts A + B)  [Writer → Orchestrator]
├── storyboard.md         ← Visual storyboard              [Creative Director]
├── script.md             ← Full video script               [Writer]
├── casting.md            ← Casting brief                   [Creative Director]
├── production.md         ← Production plan                 [Orchestrator]
├── titles.md             ← Title strategy (8 options)      [Writer]
├── thumbnails.md         ← Thumbnail concepts (3)          [Creative Director]
├── distribution.md       ← Distribution plan               [Orchestrator]
├── evidence.md           ← ML evidence                     [Data Analyst]
├── validation.md         ← Audience + Critic validation    [Critic]
└── production_note.md    ← Compiled final production note  [All agents]
```

### Templates

Every agent MUST reference the corresponding template before generating:
```
data/cut/ideation_dataset/PRODUCTION_NOTE_TEMPLATE.md          ← Master template
data/cut/ideation_dataset/templates/STORYBOARD_TEMPLATE.md     ← Storyboard
data/cut/ideation_dataset/templates/SCRIPT_TEMPLATE.md         ← Script
data/cut/ideation_dataset/templates/CASTING_TEMPLATE.md        ← Casting
data/cut/ideation_dataset/templates/PRODUCTION_TEMPLATE.md     ← Production
data/cut/ideation_dataset/templates/TITLES_TEMPLATE.md         ← Titles
data/cut/ideation_dataset/templates/THUMBNAILS_TEMPLATE.md     ← Thumbnails
data/cut/ideation_dataset/templates/DISTRIBUTION_TEMPLATE.md   ← Distribution
data/cut/ideation_dataset/templates/VALIDATION_TEMPLATE.md     ← Validation
```

---

## Stage-by-Stage Chain of Thought

### Stage 1: CONCEPT (Production Note)
**Agent:** Writer (delegated by Orchestrator)
**Template:** `PRODUCTION_NOTE_TEMPLATE.md`
**Token Budget:** 16,000
**CoT Steps:**

1. **Absorb** the user brief, ML insights, and reference documents
2. **Load** the production note template and verify all 20 sections are present
3. **Generate Part A** — Production Note:
   - Write Concept (premise + hook + WTF moment) → verify specificity
   - Write Thumbnail & Title Strategy → verify two-face-in-frame reasoning
   - Write Cast (3-6 characters with archetypes, reveals, chemistry) → verify each has a Reveal line
   - Write The Loop (core loop, family, secondary loops, currency, ramp, payoff) → verify arrow notation
   - Write Psychological Drivers (3-5 primary + 3-5 secondary) → verify each has a WHY sentence
   - Write Story Structure (3-4 acts + cold open + first 3 minutes) → verify timestamps are consistent
   - Write Emotional Design (tone, arc, peak moments) → verify 3-5 peak moments with timestamps
   - Write Production Design (set, camera, graphics, music, testimonials)
   - Write Questions & Prompts (icebreakers, provocative, emotional depth) → verify actual usable questions
   - Write Packaging (title anatomy, thumbnail, alt titles, stakes, curiosity gap)
   - Write Performance Notes
4. **Generate Part B** — Format Development Analysis:
   - Strong Characters (all archetypes filled)
   - Early Retention (minute-by-minute 3-minute plan)
   - Reason to Watch to the End (one sentence)
   - Loop Structure Test (9 dimensions, each rated 1-10 with justification)
   - Format Type Read (classification + rationale)
   - YouTube Format Fitness (6 dimensions, each rated 1-10)
   - Scorecard (9 dimensions, each rated 1-10)
   - Structural Fragility (2-3 failure modes)
   - Top Strengths / Problems / Fixes (3 each + Fix Engine)
   - Development Diagnosis (2-3 sentence overall)
5. **Embed hypotheses** — scan all [H01]–[H47], embed ≥12 phrase hyperlinks [[H##:specific A/B test|phrase]]
6. **Self-check**: Verify ALL 20 sections are present. Count them. If any are missing → add them.
7. **Write** to `concept.md` (the production note) and `production_note.md` (compiled)

### Stage 2: STORYBOARD
**Agent:** Creative Director
**Template:** `STORYBOARD_TEMPLATE.md`
**Token Budget:** 8,192
**CoT Steps:**

1. **Read** the concept.md from Stage 1 — extract format, cast names, loop mechanics, emotional arc
2. **Load** the storyboard template
3. **Plan** 4-6 scenes that mirror the act structure from the production note
4. **For each scene**, write:
   - Scene number and title (evocative, not generic)
   - Timestamp range (must be consistent with production note's act structure)
   - Visual Description (3-5 sentences: camera, lighting, set, spatial composition)
   - On-Screen Action & Key Dialogue (2-4 sentences: behavior, key exchanges, body language)
   - Mood (emoji + 2-3 sentence emotional texture)
5. **Verify** character names match concept.md exactly
6. **Verify** timestamps create a coherent progression matching the production note's duration target
7. **Add** Director's Note on pacing + which scene is the clip
8. **Embed** 2-3 hypothesis phrase hyperlinks
9. **Write** to `storyboard.md`

### Stage 3: SCRIPT
**Agent:** Writer
**Template:** `SCRIPT_TEMPLATE.md`
**Token Budget:** 12,000
**CoT Steps:**

1. **Read** concept.md AND storyboard.md — extract cast names, scene structure, key dialogue beats
2. **Load** the script template
3. **Write the FULL script** — every round of the loop must be written out. NO summarizing or skipping:
   - Cold open hook (first 15 seconds, stage directions + dialogue)
   - Scene-by-scene matching storyboard structure
   - Every question card fully written out
   - Every response, reaction, and beat between questions
   - Stage directions in [brackets] describing camera, body language, micro-moments
   - Speaker names in **BOLD** with *(stage directions)* in italics
4. **Verify** character names match concept.md and storyboard.md
5. **Verify** all rounds of the loop are present (not summarized)
6. **Verify** the WTF moment from the production note appears in the script
7. **Embed** 2-3 hypothesis phrase hyperlinks
8. **Write** to `script.md`

### Stage 4: CASTING
**Agent:** Creative Director
**Template:** `CASTING_TEMPLATE.md`
**Token Budget:** 6,000
**CoT Steps:**

1. **Read** concept.md AND script.md — extract cast archetypes, chemistry notes, format requirements
2. **Load** the casting template
3. **Write all sections**:
   - Demographics & Energy (age range, personality mix, diversity rationale)
   - Character Archetypes table (all 6 archetypes with format-specific descriptions)
   - What We Value (4 priorities in order)
   - Red Flags table (5+ red flags with rationale)
   - Gender Mix & Regional Voice (specific regional voices needed)
   - Summary Casting North Star (2-3 sentence essence)
4. **Verify** archetypes align with the cast described in concept.md
5. **Embed** 2-3 hypothesis phrase hyperlinks
6. **Write** to `casting.md`

**CRITICAL**: The casting file must contain ONLY casting content. No script, no production notes. Just casting.

### Stage 5: PRODUCTION
**Agent:** Orchestrator
**Template:** `PRODUCTION_TEMPLATE.md`
**Token Budget:** 6,000
**CoT Steps:**

1. **Read** concept.md, storyboard.md, script.md, casting.md — extract all creative decisions
2. **Load** the production template
3. **Write all 6 sections**:
   - Shooting Setup & Location (with set design table and lighting table)
   - Props & Wardrobe (with props table and wardrobe guidelines)
   - Crew Table (all roles with headcount and notes)
   - Camera Strategy (camera table + recording specs)
   - Pacing & Editing Notes (act-by-act table + editing principles)
   - Key Risks & Contingencies (risk table)
4. **Verify** all table cells are filled (no empty cells)
5. **Verify** camera strategy matches storyboard's shot descriptions
6. **Embed** 2-3 hypothesis phrase hyperlinks
7. **Write** to `production.md`

### Stage 6: TITLES
**Agent:** Writer
**Template:** `TITLES_TEMPLATE.md`
**Token Budget:** 4,096
**CoT Steps:**

1. **Read** concept.md — extract hook, WTF moment, cast names, emotional core
2. **Read** ML insights — identify relevant title features (title_fomo_score, title_personal_you, cliffhanger_score)
3. **Load** the titles template
4. **Generate 8 titles** across categories: VULNERABILITY, CURIOSITY, TENSION, STAKES, FORMAT HOOK, FOMO, IDENTITY, PROVOCATION
5. **For each title**, write 3-4 sentence "Why it works" that includes:
   - The psychological mechanism it activates
   - ML feature references (with correlation values or LASSO stability notes)
   - How it creates a curiosity gap
   - What it promises vs. what it withholds
6. **Write RECOMMENDATION** section with:
   - Primary title with rationale
   - A/B Test Against with the specific alternative and what it tests
   - Title-to-content coherence note (how the title echoes in cold open + thumbnail)
7. **Embed** 2-3 hypothesis phrase hyperlinks with specific A/B tests for title variants
8. **Write** to `titles.md`

### Stage 7: THUMBNAILS
**Agent:** Creative Director
**Template:** `THUMBNAILS_TEMPLATE.md`
**Token Budget:** 800 (JSON output)
**CoT Steps:**

1. **Read** concept.md AND titles.md — extract visual tone, cast composition, winning title
2. **Load** the thumbnails template
3. **Generate 3 distinct thumbnail concepts** as JSON:
   - Each with: prompt (50-80 words), text_overlay (3-6 words), hook (one sentence)
   - Vary approaches: two-shot vs. solo reaction, text-heavy vs. text-light, warm vs. high-contrast
4. **Verify** text_overlay echoes the recommended title
5. **Output** as valid JSON array only

### Stage 8: DISTRIBUTION
**Agent:** Orchestrator
**Template:** `DISTRIBUTION_TEMPLATE.md`
**Token Budget:** 4,096
**CoT Steps:**

1. **Read** concept.md, titles.md, thumbnails.md — extract final creative package
2. **Read** ML insights — identify relevant distribution signals (traffic_algorithmic_pct, traffic_external_pct, geo_us_pct)
3. **Load** the distribution template
4. **Write all sections**:
   - Cadence Strategy (full episode timing + 5-clip schedule + community posts)
   - Platform Cuts (YouTube Shorts specs + TikTok adaptations + Instagram Reels)
   - Caption Hook & Community Post
   - Collab Angle & Cross-Promotion
5. **Verify** each Short references a specific moment from the episode (not generic)
6. **Embed** 2-3 hypothesis phrase hyperlinks with specific distribution A/B tests
7. **Write** to `distribution.md`

### Stage 9: AUDIENCE PANEL
**Agent:** Audience Personas (5 independent evaluations)
**Template:** `VALIDATION_TEMPLATE.md` (audience section)
**CoT Steps:**

1. Each persona **reads** concept.md, titles.md, thumbnails.md, storyboard.md
2. Each persona independently rates: Click, Watch, Share, Vibe, Rating (1-10)
3. Each provides 2-3 sentences of detailed feedback in their persona voice
4. Results are aggregated into the audience panel table
5. **Write** to `validation.md` (audience section)

### Stage 10: VALIDATION
**Agent:** Critic
**Template:** `VALIDATION_TEMPLATE.md`
**CoT Steps:**

1. **Read** ALL session files — concept.md through distribution.md
2. **Read** audience panel results
3. **Score** overall quality (1-10) with strengths and concerns
4. **Audit** hypothesis coverage — list used and missed hypotheses
5. **Assess** production readiness
6. **Write** final verdict to `validation.md`

---

## Hypothesis Formatting Rules

Throughout all stages, hypotheses must follow this exact format:

### Simple Citation
Use `[H##]` for passing references:
> "The Truth or Drink format inherently generates high `escalation_intensity` [H09], which is LASSO-stable for retention."

### Phrase Hyperlink (Full A/B Test)
Use `[[H##:specific A/B test|the phrase it motivates]]` for creative decisions driven by a hypothesis:
> "The host opens with [[H01:Test direct provocative question hook ('Are you still in love?') vs ambient cold-open (micro-expressions only) — measure ret_initial_drop over first 48hrs for this Marcus/Jasmine episode|a provocative question about loyalty]]"

### Rules:
- **Minimum 12** phrase hyperlinks across the full production note (Part A + Part B)
- **2-3** phrase hyperlinks per detailed card (storyboard, script, casting, etc.)
- Every A/B test must be **specific to THIS episode**: name cast members, reference specific moments, cite timestamps
- The A/B test should follow the format: "Test [variant A] vs [variant B] — measure [metric] over [timeframe]"
- Do NOT use generic tests like "Test X vs Y" — always ground in the episode's specifics

---

## Consistency Checklist (Every Agent, Every Stage)

Before writing the final file, verify:

- [ ] **Character names** match across all files (concept → storyboard → script → casting)
- [ ] **Timestamps** are consistent between production note, storyboard, and script
- [ ] **Format mechanics** (loop, rules, props) are described consistently
- [ ] **WTF moment** appears in concept, storyboard, script, and packaging
- [ ] **All sections of the template** are filled — no empty sections, no "TBD"
- [ ] **Hypothesis hyperlinks** are present and use the correct format
- [ ] **The file contains ONLY its own content** — no script in the casting file, no casting in the script file
- [ ] **Word count** meets the minimum for the stage (concept: 3000-5000, script: 2000-4000, others: 800-2000)

---

## Error Recovery

If a stage produces truncated output:
1. The system detects truncation (content ends mid-sentence or key sections are missing)
2. The agent is re-invoked with: "Your previous output was truncated at: '{last line}'. Continue from that point and complete ALL remaining sections."
3. The continuation is appended to the existing file
4. The file is re-verified for completeness

If a stage produces content that contradicts a previous stage:
1. The Critic flags the inconsistency
2. The newer stage is re-generated with explicit instructions to match the earlier stage
3. If the inconsistency improves the concept, the earlier stage is updated instead
