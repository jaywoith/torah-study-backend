# API Overview (planned)

All endpoints return structured JSON defined by the models in [torah-study-shared](https://github.com/jaywoith/torah-study-shared).

## Planned Endpoints

- `POST /v1/study/daily` – Generate daily study for a user profile
- `GET /v1/siddur/next` – Next Siddur unit for the user
- `POST /v1/coach/message` – AI Rabbi conversation (uses persona from shared rules)
- `GET /v1/progress` – User progress summary

Clients (web/iOS/Android) depend only on this contract, never on the shared packages directly.
