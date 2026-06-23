# Debug Session: staging-auth-session

Status: OPEN

## Symptom
- On `staging.torchlife.co`, login can show success but the app still behaves as signed out.
- Browser console shows repeated `127.0.0.1:7777/event` failures, `/api/auth/me` `401`, and failed external requests.

## Hypotheses
1. Auth cookies are not being persisted on staging after login/signup.
2. The frontend checks `/auth/me` before the session cookie is available and keeps the UI in a signed-out state.
3. Some frontend requests still point to the wrong origin or environment-specific endpoint on staging.
4. Local-only debug beacon requests create noisy failures that interfere with the auth flow timing or state transitions.
5. Login succeeds on the API, but redirect/session hydration is blocked by a failed follow-up validation request.

## Plan
- Instrument frontend auth flow first.
- Reproduce on staging and collect runtime evidence.
- Confirm or reject the hypotheses above before changing business logic.
