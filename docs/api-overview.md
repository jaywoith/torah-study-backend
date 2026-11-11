# API Overview

All endpoints return structured JSON defined by the models in [torah-study-shared](https://github.com/jaywoith/torah-study-shared).

## Implemented Endpoints

- `GET /health` – Service health check
- `POST /v1/study/daily` – Generate daily study for a user profile (calls `generateDailyStudy` + `validateDailyStudy`)
- `GET /v1/siddur/next` – Next Siddur unit (uses shared path helper)
- `POST /v1/coach/message` – AI Rabbi conversation stub (loads persona + constraints from shared rules)
- `GET /v1/ui-strings` – Shared UI strings from `ui-strings.json`

## Planned

- `GET /v1/progress` – User progress summary
- Authentication and persistence
- Real LLM integration for the coach (still driven by shared personas and constraints)

Clients (web/iOS/Android) depend only on this contract, never on the shared packages directly.

## Shared UI Strings

The backend exposes the shared labels so all clients stay consistent. Source: [ui-strings.json](https://github.com/jaywoith/torah-study-shared/blob/main/ui-strings.json).

See also: [shared-vs-local best practice](https://github.com/jaywoith/torah-study-shared/blob/main/docs/shared-vs-local.md) and the README in this repo for request/response examples.
