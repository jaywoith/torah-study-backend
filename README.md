# Torah Study Backend

Backend service for the multi-platform Torah independent study app.

## Role

- Loads the shared packages from [torah-study-shared](https://github.com/jaywoith/torah-study-shared)
- Owns every study generation call and every AI Rabbi interaction
- Serves shared UI strings so clients stay consistent
- Exposes a clean HTTP API that all clients consume
- Enforces framework validation and constraints before returning any response

## Related Repositories

| Repo | Purpose |
|------|---------|
| [torah-study-shared](https://github.com/jaywoith/torah-study-shared) | Shared packages + UI strings (source of truth for rules and labels) |
| [torah-study-web](https://github.com/jaywoith/torah-study-web) | Web client |
| [torah-study-ios](https://github.com/jaywoith/torah-study-ios) | iOS client |
| [torah-study-android](https://github.com/jaywoith/torah-study-android) | Android client |

## Drift Prevention

This service is the **only** place that imports `torah-core` and `torah-ai-rules`. It also serves `ui-strings.json`. Clients never see framework logic, AI prompts, or hard-code shared labels. All generation and shared copy flow through the backend.

## Next Steps

- Add package dependency on the shared packages (git submodule or published npm)
- Implement endpoints: `POST /study/daily`, `GET /siddur/next`, `POST /coach/chat`, `GET /ui-strings`, etc.
- Load persona + system prompt from `torah-ai-rules` for every AI call
- Run `validateDailyStudy` before returning results

See the shared repo for the full model, generator contract, and [shared-vs-local guidance](https://github.com/jaywoith/torah-study-shared/blob/main/docs/shared-vs-local.md).
