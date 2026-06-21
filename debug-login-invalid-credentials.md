# Debug Session: login-invalid-credentials
- **Status**: [OPEN]
- **Issue**: Login shows "Invalid credentials" when the user expects a valid sign-in or unverified-email OTP flow.
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: .dbg/trae-debug-log-login-invalid-credentials.ndjson

## Reproduction Steps
1. Open the auth page.
2. Enter a known account identifier and password.
3. Submit the sign-in form.
4. Observe whether the backend returns credential failure, unverified-email flow, or successful session bootstrap.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | Backend credential validation is genuinely failing because the submitted identifier/password does not match the stored user data. | High | Low | Confirmed by frontend log: `401 Invalid credentials` after normalized sign-in submit. |
| B | Backend is returning the unverified-email branch, but the frontend is masking the structured error and only showing `Invalid credentials`. | High | Low | Rejected by frontend log: received `401`, not `403 EMAIL_NOT_VERIFIED`. |
| C | Frontend sign-in normalization is altering the identifier in a way that breaks lookup, especially for phone input. | Medium | Low | Rejected for this repro: submitted email normalized correctly to `bolutifegboola@gmail.com`. |
| D | Backend `getUser()` lookup or auth flow throws before password comparison, and the catch path rewrites the real error into `Invalid credentials`. | High | Medium | Unconfirmed; backend runtime logs unavailable because the running backend process was not restarted with instrumentation. |
| E | Login succeeds, but post-login `/auth/me` bootstrap fails and the UI surfaces the wrong fallback. | Medium | Medium | Rejected by frontend log: sign-in request itself returned `401` before session bootstrap. |

## Log Evidence
- Frontend submit log captured `Bolutifegboola@gmail.com` and normalized it to `bolutifegboola@gmail.com`.
- Frontend auth call returned `401 Invalid credentials`.
- No `403 EMAIL_NOT_VERIFIED` payload was returned for this repro.
- Attempted password reset from the sandbox was blocked by database connectivity to the remote Neon host.

## Verification Conclusion
- The reproduced issue is a real backend credential mismatch for the tested account.
- The next operational fix is to reset the stored password for that account from an environment with database access, then re-test login.
