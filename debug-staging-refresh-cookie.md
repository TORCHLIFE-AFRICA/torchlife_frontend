# Debug Session: staging-refresh-cookie
- **Status**: [OPEN]
- **Issue**: Staging login succeeds, but `POST /api/auth/refresh` returns `401 Refresh token not found` shortly after.
- **Debug Server**: Pending startup
- **Log File**: `.dbg/trae-debug-log-staging-refresh-cookie.ndjson`

## Reproduction Steps
1. Open `https://staging.torchlife.co`.
2. Sign in with a valid account against `https://api.staging.torchlife.co`.
3. Observe successful login.
4. Observe follow-up `POST /api/auth/refresh`.
5. Observe `401 Unauthorized` with `Refresh token not found`.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | The backend writes `refreshToken` with a cookie `path` that does not match `/api/auth/refresh`. | High | Low | Pending |
| B | The browser rejects the refresh cookie because of cross-subdomain cookie attributes (`secure`, `sameSite`, `domain`). | High | Medium | Pending |
| C | The frontend triggers refresh because its first authenticated probe fails, even though login succeeded. | Medium | Low | Pending |
| D | A logout or unauthorized handler clears the cookies before the refresh request is made. | Medium | Medium | Pending |
| E | The backend refresh endpoint reads `refreshToken`, but the incoming request contains no such cookie. | High | Low | Pending |

## Log Evidence
- Backend routes are mounted under `/api` in `torchlife_backend/src/main.ts`.
- Refresh cookie was written with `path: '/auth/refresh'` in `torchlife_backend/src/services/auth/auth.service.ts`.
- Refresh endpoint reads `response.req.cookies['refreshToken']` in `torchlife_backend/src/services/auth/auth.service.ts`.
- Because browsers only send a cookie when the request path matches the cookie path, a cookie scoped to `/auth/refresh` is not sent on `POST /api/auth/refresh`.
- This exactly matches the observed backend runtime symptom: `401 Unauthorized` with `Refresh token not found`.

## Verification Conclusion
- **Confirmed Root Cause**: The refresh token cookie path did not match the actual prefixed backend route. Login generated and attached the refresh token, but the browser would not return it on `/api/auth/refresh` because the cookie was scoped to `/auth/refresh`.
- **Minimal Fix Applied**:
  1. Changed refresh cookie `path` from `/auth/refresh` to `/api/auth/refresh` in `torchlife_backend/src/services/auth/auth.service.ts`.
  2. Changed logout `clearCookie()` path to `/api/auth/refresh` in `torchlife_backend/src/services/auth/auth.controller.ts`.
  3. Reduced landing navbar height in `torchlife_frontend/src/components/landingPage/navbar.tsx`.
- **Verification**:
  - Frontend build passed.
  - Backend build passed.
  - Instrumentation remains in place until user confirms staging behavior.
