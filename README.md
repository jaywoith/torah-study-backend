# Torah Study Backend

Backend service for the multi-platform Torah independent study app.

**This service is the single source of truth at runtime.** It loads the shared packages from [torah-study-shared](https://github.com/jaywoith/torah-study-shared), runs study generation and validation, serves shared UI strings, and owns all AI Rabbi interactions. Clients (web, iOS, Android) never import the shared packages or hard-code framework logic or shared labels.

## Related Repositories

| Repo | Purpose |
|------|---------|
| [torah-study-shared](https://github.com/jaywoith/torah-study-shared) | Shared packages (`torah-core`, `torah-ai-rules`) + `ui-strings.json` |
| [torah-study-web](https://github.com/jaywoith/torah-study-web) | Web client |
| [torah-study-ios](https://github.com/jaywoith/torah-study-ios) | iOS client |
| [torah-study-android](https://github.com/jaywoith/torah-study-android) | Android client |

## Drift-Prevention Rules

1. Backend is the single source of truth at runtime.
2. Clients never import shared packages or hard-code framework/AI/shared-label logic.
3. All generation goes through `generateDailyStudy` + `validateDailyStudy` from `torah-core`.
4. All AI calls load the appropriate persona + system prompt from `torah-ai-rules`.
5. Shared UI strings are served by the backend (`GET /v1/ui-strings`).

## Setup

### 1. Clone and install

```bash
git clone https://github.com/jaywoith/torah-study-backend.git
cd torah-study-backend
npm install
```

### 2. Wire in the shared packages (git submodule)

```bash
git submodule add https://github.com/jaywoith/torah-study-shared.git vendor/shared
git submodule update --init --recursive
```

The TypeScript path aliases in `tsconfig.json` point to the submodule sources so the backend can import directly from `@torah/core` and `@torah/ai-rules`.

> **Alternative**: If you prefer published packages later, publish `@torah/core` and `@torah/ai-rules` from the shared monorepo and switch the dependency. The current approach keeps the shared source as the single source of truth without duplication.

### 3. Run

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

Server starts on port 3000 by default (`PORT` env var).

## Endpoints

### Health

`GET /health`

```json
{ "status": "ok", "service": "torah-study-backend", "version": "0.1.0" }
```

### Daily Study

`POST /v1/study/daily`

**Request**

```json
{
  "profile": {
    "framework": "masorti_conservative",
    "level": "intermediate",
    "interests": ["siddur", "musar", "kabbalah", "kavannah"],
    "studyLength": "medium",
    "languageMode": "mixed",
    "practiceContext": "Attends Shacharit minyan"
  },
  "date": "2026-11-11"
}
```

**Response** (example shape; actual content comes from shared generator)

```json
{
  "study": {
    "date": "2026-11-11",
    "profile": { "framework": "masorti_conservative", "level": "intermediate", "studyLength": "medium", "languageMode": "mixed" },
    "units": [ /* StudyUnit[] with pointed Hebrew where provided */ ],
    "totalEstimatedMinutes": 19,
    "notes": "Generated for Masorti / Conservative – Intermediate. Focus on kavannah and traditional sources."
  },
  "validation": { "valid": true, "issues": [] }
}
```

The endpoint calls `generateDailyStudy` then `validateDailyStudy` from `torah-core`. Invalid studies return 422 with issues.

### Next Siddur Unit

`GET /v1/siddur/next?completed=baruch_sheamar&interests=siddur,kavannah`

Uses `getNextSiddurUnit` from the shared Siddur path. Returns a pointed Hebrew unit appropriate for the model user.

### Shared UI Strings

`GET /v1/ui-strings`

Returns the contents of `ui-strings.json` from the shared repo. Clients must use these labels instead of hard-coding shared strings.

### AI Rabbi Coach (stub)

`POST /v1/coach/message`

**Request**

```json
{
  "framework": "masorti_conservative",
  "message": "How can I deepen my kavannah during Pesukei Dezimra?"
}
```

**Response** (placeholder)

```json
{
  "reply": "Thank you for your question. As your Conservative Rabbi Coach, I would respond with sources and kavannah in mind. (This is a placeholder; real LLM integration will use the shared system prompt and constraints.)",
  "persona": {
    "name": "Conservative Rabbi Coach",
    "tone": "...",
    "systemPromptFragment": "..."
  },
  "constraints": [ "Always cite sources.", "..." ],
  "note": "Placeholder response. Future LLM calls will load the full system prompt from torah-ai-rules and enforce the constraints before returning."
}
```

## Future LLM Integration

When adding a real LLM (OpenAI, Anthropic, local, etc.):

1. Load the persona and full system prompt for the user’s framework from `torah-ai-rules` (including the Markdown file under `system-prompts/`).
2. Prepend the constraints from `getConstraintsForFramework`.
3. Call the model with the system prompt + conversation.
4. Optionally post-validate the response against the same constraints (e.g., ensure sources are cited, no progressive markers for traditional frameworks, Hebrew remains pointed).
5. Never move persona or constraint logic into this repo — always read it from the shared package so all clients stay consistent.

## Model User (initial)

Conservative / Intermediate, mixed language, interests in Siddur (Shacharit / Pesukei Dezimra), Musar, and Kabbalah. Attends minyan.

Hebrew remains pointed wherever the shared packages provide it.

## Next Steps

- Real LLM integration for the Rabbi Coach (still driven by shared personas and constraints).
- Authentication and user progress persistence.
- Web, iOS, and Android clients that consume these endpoints.
