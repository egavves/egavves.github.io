# Calli Labs Analyzer — Architecture & Research Design

## Overview

The Analyzer is a single-page HTML dashboard (`dashboard.html`) for YouTube channel analytics and AI-powered ideation. It combines ML-driven performance analysis with a multi-agent creative pipeline that generates, critiques, and iterates on video concepts.

The system is designed as a **research platform** — every major design choice is configurable, testable, and logged so we can empirically determine what produces the best creative output.

---

## System Architecture

```
dashboard.html (single file, ~5800 lines)
├── Analytics Module         — ML insights, channel metrics, trend analysis
├── Calliope Chat            — AI assistant with ideation awareness
├── Ideation Engine          — Config panel, session management
├── Multi-Agent Pipeline     — Sequential 10-stage production pipeline
│   ├── Agent Configs        — JSON files in agents/
│   ├── Audience Panel       — 5 persona configs in agents/audience/
│   ├── Inter-Agent Messages — [REQUEST:agent: question] tag routing
│   ├── Consensus Engine     — Multi-strategy audience evaluation
│   └── Pipeline Graph       — SVG visualization of agent interactions
└── Debug Panel              — Live parameter controls (?debug=1)
```

### External Files

| File | Purpose |
|------|---------|
| `pipeline_config.json` | Profile-based pipeline configuration (production/debug/research) |
| `agents/pipeline.json` | Pipeline stage definitions, execution rules, feedback loops |
| `agents/orchestrator.json` | Producer agent: routing, production plans, distribution |
| `agents/writer.json` | Writer agent: concepts (9-step chain-of-thought), scripts, titles |
| `agents/creative_director.json` | Creative Director: storyboards, casting, thumbnails |
| `agents/data_analyst.json` | Data Analyst: ML intelligence, on-demand evidence |
| `agents/critic.json` | Critic agent: quality gates, stage reviews, final validation |
| `agents/audience/Audience {1-5}.json` | 5 audience personas with demographics, Big Five, prompt templates |
| `projects/cut/config.json` | Channel-specific config: formats, audiences, model settings |

---

## Multi-Agent Pipeline

### 10-Stage Sequential Flow

```
1. Concept (Writer)       → Critic review → possible revision
2. Storyboard (Creative)  → Critic review → possible revision
3. Script (Writer)        → Critic review → possible revision
4. Casting (Creative)     — no critic gate
5. Production (Producer)  — no critic gate
6. Titles (Writer)        → Critic review → possible revision
7. Thumbnails (Creative)  — no critic gate (visual output)
8. Distribution (Producer) — no critic gate
9. Audience Panel          → Consensus check → if fail: iterate (stages 9-10 loop)
10. Final Validation       → Critic synthesis with iteration history
```

### Agent Roles

| Agent | Temperature | Role | Can Request From |
|-------|-------------|------|-----------------|
| Writer | 0.8 | Creative engine — concepts, scripts, titles | data_analyst |
| Creative Director | 0.7 | Visual storytelling — storyboards, casting, thumbnails | data_analyst |
| Producer/Orchestrator | 0.5 | Pipeline manager — production plans, distribution, revision briefs | — |
| Data Analyst | 0.2 | Evidence provider — ML insights, on-demand data queries | — |
| Critic | 0.3 | Quality gate — stage reviews, verdicts (APPROVE/REVISE/REJECT) | — |

### Inter-Agent Message Passing

Agents can request information from other agents mid-generation by including `[REQUEST:agent_id: question]` in their output. The system:

1. Parses tags from agent output via regex
2. Routes the question to the target agent with context (current concept + ML insights)
3. Injects the response back into the output
4. Animates the message exchange on the pipeline graph

Controlled by: `PIPE_CFG.inter_agent_messages` (boolean)

### Audience Feedback Iteration Loop

After stages 1-8 produce a complete creative package, the audience panel evaluates it. If consensus is not reached, the pipeline iterates:

```
┌──────────────────────────────────────────────┐
│  Audience Panel (5 personas evaluate)        │
│  → Consensus Check (strategy-dependent)      │
│     ├─ PASS → Final Validation (stage 10)    │
│     └─ FAIL → Producer Revision Brief        │
│              → Writer revises concept        │
│              → Creative revises storyboard   │
│              → (titles revised if flagged)   │
│              └─ Loop back to Audience Panel   │
└──────────────────────────────────────────────┘
Max iterations: PIPE_CFG.max_iterations (default: 5)
```

### Selective Revision Logic

Not everything gets revised on each iteration. Currently:

- **Concept**: Always revised (core creative direction)
- **Storyboard**: Always revised (follows concept)
- **Titles**: Revised only if ≥2 panelists flagged packaging/title issues
- **Script, casting, production, thumbnails, distribution**: NOT revised during iteration (these flow from concept/storyboard)

This is a research design choice that can be extended.

---

## Consensus Strategies

Three strategies are implemented, selectable via `PIPE_CFG.consensus.strategy`:

### 1. `simple_avg`
Pass if: `average_rating >= avg_threshold`
Best for: Quick testing, lenient evaluation.

### 2. `weighted`
Pass if: `weighted_average >= avg_threshold`
Weights are per-persona, per-format (currently equal — TODO: populate from audience config).
Best for: Production use where some personas matter more for certain formats.

### 3. `convergence`
Pass if: `average >= avg_threshold AND variance <= convergence_variance`
Best for: Research mode — forces the panel to agree, not just average well. A concept that's 9/10 for two people and 3/10 for three will fail even if the average is decent.

### Consensus Guards (apply to all strategies)

| Guard | Config Key | Default | Description |
|-------|-----------|---------|-------------|
| Hard floor | `hard_floor` | 4 | No persona can score below this |
| Critic floor | `critic_floor` | 6 | Critic overall score must exceed this |

---

## Pipeline Config Profiles

Stored in `pipeline_config.json`. Switch via URL param (`?debug=1&profile=research_strict`) or JS console (`switchPipelineProfile('fast_test')`).

| Profile | Max Iter | Strategy | Avg Thresh | Verbose | Use Case |
|---------|----------|----------|------------|---------|----------|
| `production` | 3 | weighted | 6.5 | No | Real ideation runs |
| `debug` | 5 | simple_avg | 5.0 | Yes | Testing pipeline mechanics |
| `research_strict` | 5 | convergence | 7.5 | Yes | Testing convergence behavior |
| `fast_test` | 1 | simple_avg | 0 | Yes | Quick single-pass testing |

---

## Audience Personas

5 personas spanning demographics, personality types, and viewing behaviors:

| # | Name | Age | Location | MBTI | Harshness | Focus |
|---|------|-----|----------|------|-----------|-------|
| 1 | Zara 💅 | 22F | LA, USA | ENFP | 0.6 | Virality, representation, trends |
| 2 | James 🎧 | 28M | Manchester, UK | INTP | 0.7 | Premise originality, pacing, competition |
| 3 | Priya 📚 | 34F | Mumbai, India | INTJ | 0.5 | Emotional intelligence, cultural sensitivity |
| 4 | Lucas 🎮 | 17NB | São Paulo, Brazil | ENFJ | 0.4 | Inclusivity, chaos, shareability |
| 5 | Thomas 🍺 | 42M | Munich, Germany | ISTJ | 0.75 | Substance, production value, age inclusivity |

Each persona has Big Five personality scores, detailed viewing behavior, cultural context, and a prompt template that outputs: Click/Watch to end/Share/Vibe check/Rating (X/10).

---

## Research Design Choices Registry

### Implemented & Testable Now

| Feature | Options | Config Location |
|---------|---------|----------------|
| Consensus strategy | simple_avg, weighted, convergence | `PIPE_CFG.consensus.strategy` |
| Avg threshold | 0-10 (float) | `PIPE_CFG.consensus.avg_threshold` |
| Hard floor | 0-10 (int) | `PIPE_CFG.consensus.hard_floor` |
| Critic floor | 0-10 (int) | `PIPE_CFG.consensus.critic_floor` |
| Convergence variance | 0-10 (float) | `PIPE_CFG.consensus.convergence_variance` |
| Max iterations | 1-10 | `PIPE_CFG.max_iterations` |
| Max revisions per stage | 0-5 | `PIPE_CFG.max_revisions_per_stage` |
| Inter-agent messaging | on/off | `PIPE_CFG.inter_agent_messages` |
| Audience iteration | on/off | `PIPE_CFG.audience_iteration` |
| Verbose logging | on/off | `PIPE_CFG.verbose_logging` |
| Profile presets | production, debug, research_strict, fast_test | `pipeline_config.json` |

### Planned / Future Research

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Persona weights by format** | Weight audience scores based on format relevance (e.g., Lucas weighted higher for TikTok-native formats) | Medium |
| **Dynamic persona generation** | Generate personas on-the-fly from target demographics | Medium |
| **Bayesian consensus** | Use prior distributions from past runs to inform thresholds | High |
| **Multi-criteria Pareto** | Optimize for multiple objectives (virality, depth, brand-fit) simultaneously | High |
| **Agent debate mode** | Agents can challenge each other's outputs before critic review | Medium |
| **Structured tool calls** | Agents can invoke specific tools (search, data query) instead of free-text requests | Medium |
| **Memory across sessions** | Agents remember past concepts and what worked/failed | High |
| **Script revision on low engagement** | If panelists flag pacing/engagement, trigger script-specific revision | Low |
| **Thumbnail A/B test** | Generate multiple thumbnail variants and have audience rank them | Medium |
| **Cast swap on character complaints** | If audience dislikes casting, re-run casting with constraints | Low |
| **Conditional stage skip** | Skip stages that aren't relevant for certain formats | Low |
| **Parallel branch-merge** | Run Writer and Creative Director in parallel for independent stages | Medium |
| **Checkpoint/resume** | Save pipeline state and resume from any stage | Medium |
| **Rollback on REJECT** | If critic REJECTs, roll back multiple stages instead of one | Low |
| **Multi-critic ensemble** | Multiple critic agents with different calibrations; aggregate their verdicts | Medium |
| **Critic calibration** | Track critic accuracy over time and adjust weights | High |

---

## Debug Mode

Activate by opening `dashboard.html?debug=1` or `dashboard.html?debug=1&profile=research_strict`.

Features:
- **Debug badge** (top-right corner) showing current mode
- **Debug panel** (bottom of screen) with live controls for all pipeline parameters
- **Profile switcher** — change profiles without reloading
- **Consensus tuning** — adjust strategy, thresholds, floors in real-time
- **Iteration controls** — change max iterations and revision limits
- **Feature flags** — toggle inter-agent messages, audience iteration, verbose logging
- **State dump buttons** — output PIPE_CFG, PIPELINE_STATE, AGENT_CONFIGS to console

All changes take effect on the next pipeline run (no reload needed).

---

## Key Technical Patterns

### API Calls
- **Claude API** via `callClaude()` — text generation for all agents
- **fal.ai API** via `callFalImage()` — thumbnail image generation
- Both keys stored in `localStorage`

### State Management
- `PIPELINE_STATE[sid]` — per-session outputs and user notes
- `PIPE_CFG` — global pipeline configuration (mutable at runtime)
- `AGENT_CONFIGS` — loaded from JSON files or embedded defaults
- `AUDIENCE_PERSONAS` — loaded from audience JSON configs
- `ML_INSIGHTS` — loaded from ML analysis results

### Graph Visualization
- SVG-based pipeline graph with 7 nodes and 11 edges
- Node states: idle, active, revising, done
- Audience sub-panel with per-persona state and rating display
- Edge pulse animations for message passing
- Stage label overlay for current pipeline status

### Calliope Integration
- System prompt includes ideation awareness
- Detects creative directives via keyword matching (≥2 trigger words)
- Stores directives in `PIPELINE_STATE[sid].userNotes`
- Offers re-ideation when directive is detected during active session
