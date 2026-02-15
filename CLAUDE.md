# Bird Dog - Project Guidelines

## What is Bird Dog?
Bird Dog is an AI Career Strategy & Role Fit Engine. It helps job seekers identify which roles they should pursue and how to strategically position themselves, using structured reasoning rather than generic optimization.

Bird Dog is NOT a resume writer. It is a decision-support system.

## Reference Documents
Before building new features or modifying core logic, reference these docs:
- **PRD:** `Bird Dog PRD.md` — product requirements, features, workflow, and success metrics
- **System Spec:** `Bird Dog System Spec.md` — reasoning framework, scoring logic, output schema, and style constraints

## Tech Stack
- **Backend:** Python / FastAPI (`backend/`)
- **Frontend:** JavaScript / Vite + React (`frontend/`)
- **Startup:** `scripts/start.sh` runs both servers
- **Environment:** `.env` for config, `.venv` for Python virtualenv

## Core Principles (from System Spec)
1. Signal > verbosity
2. Strategy > optimization
3. Distinctiveness > polish
4. Decision support > content generation
5. Transparency > black-box scoring

## Key Architecture
- `backend/main.py` — FastAPI entry point
- `backend/routers/` — API route handlers
- `backend/services/` — business logic
- `backend/models/` — data models
- `backend/prompts/` — LLM prompt templates
- `backend/config.py` — configuration
- `frontend/src/` — React source code

## AI Workflow (5 Steps)
1. Normalize inputs (resume, job description, user context)
2. Extract key signals (role decomposition + candidate signal extraction)
3. Compare & score alignment (Skill Alignment, Trajectory Fit, Differentiation Potential)
4. Generate structured insights (narrative gaps, positioning opportunities, risks)
5. Produce final artifacts (Strategic Fit Index, positioning options, resume upgrades, recommendation)

## Output Requirements
All analysis outputs must follow the structured schema:
1. Role Summary
2. Strategic Fit Index (0-10)
3. Core Alignment (strengths + gaps)
4. Strategic Positioning Options (conservative + stretch)
5. Resume Signal Upgrades (before/after)
6. Risks & Tradeoffs
7. Recommendation ("Apply aggressively" / "Apply with repositioning" / "Strategic stretch role" / "Low ROI role")

## Product Roadmap
Bird Dog is evolving into a multi-page career strategy platform. Current and planned features:

1. **Role Analysis Tool** (done) — Resume + JD input, structured strategic output
2. **Job Application Tracker** (done) — Track applications, statuses, and notes with full CRUD, sorting, filtering, and CSV import.
3. **Resume Review Tool** (next) — Strategic resume analysis + bullet workshop. See details below.
4. **Future features** — TBD (interview prep, networking tracker, etc.)

The frontend uses React Router for page navigation.

## Resume Review Tool — Design & Target Functionality

### Philosophy
Most resume tools optimize for ATS scores or generate polished-sounding language. Bird Dog's Resume Review takes a different approach: **strategy first, then rewrites.** The goal is to show users what their resume actually signals before helping them change it.

### Two Layers

**1. Strategic Analysis Layer (what no one else does)**
- **Resume Read-Back** — Tell the user what their resume actually signals to a reader, vs. what they think it says
- **Distinctiveness Check** — Identify where the user blends in with generic language vs. where they genuinely stand out
- **Narrative Gap Detection** — Surface missing story threads (e.g., resume reads as "executor" when the user actually led initiatives)
- **Tradeoff Awareness** — Show what the resume emphasizes and what it buries, and whether those tradeoffs make sense for the user's goals

**2. Practical Layer (done the Bird Dog way)**
- **Plain Language → Polished Bullet Rewriter** — User describes their work in casual plain language, tool rewrites it into a concise, results-driven resume bullet
- Rewrites should be informed by the strategic analysis, not just generic optimization

### Target Flow
1. User uploads their resume
2. Strategic read-back is generated (signals, gaps, distinctiveness, tradeoffs)
3. User can workshop individual bullets — rewrite weak existing ones or create new ones from plain language descriptions

### Future Integration with Role Analysis
- The Role Analysis "Resume Signal Upgrades" section may be simplified once this tool exists, to avoid redundancy
- A "transfer to Resume Review" action from Role Analysis results could pass context to this tool for deeper workshopping
- These are iteration targets, not blockers for the initial build

## Style Constraints
- Prefer short sentences, avoid corporate jargon
- Preserve user's authentic voice
- Avoid buzzword stacking and semantic inflation
- State uncertainty explicitly when signals are weak
- Maximize information density
