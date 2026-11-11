# Torah Study Backend

Backend service for the multi-platform Torah independent study app.

## Role

- Loads the shared packages from [torah-study-shared](https://github.com/jaywoith/torah-study-shared)
- Owns every study generation call and every AI Rabbi interaction
- Exposes a clean HTTP API that all clients consume
- Enforces framework validation and constraints before returning any response

## Related Repositories

| Repo | Purpose |
|------|---------|
| [torah-study-shared](https://github.com/jaywoith/torah-study-shared) | Shared packages (source of truth for rules) |
| [torah-study-web](https://github.com/jaywoith/torah-study-web) | Web client |
| [torah-study-ios](https://github.com/jaywoith/torah-study-ios) | iOS client |
| [torah-study-android](https://github.com/jaywoith/torah-study-android) | Android client |

## Drift Prevention

This service is the **only** place that imports `torah-core` and `torah-ai-rules`. Clients never see framework logic or AI prompts. All generation flows through the pure functions in the shared packages.

## Next Steps

- Add package dependency on the shared packages (git submodule or published npm)
- Implement endpoints: `POST /study/daily`, `GET /siddur/next`, `POST /coach/chat`, etc.
- Load persona + system prompt from `torah-ai-rules` for every AI call
- Run `validateDailyStudy` before returning results

See the shared repo for the full model and generator contract.
