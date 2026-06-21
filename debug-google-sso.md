# Debug Session: google-sso
- **Status**: [OPEN]
- **Issue**: Google SSO is configured in env but still does not complete sign in/sign up successfully.
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: .dbg/trae-debug-log-google-sso.ndjson

## Reproduction Steps
1. Open the frontend auth page.
2. Click the Google sign-in/sign-up button.
3. Complete the Google account selection flow.
4. Observe whether the credential callback, backend `/auth/google` request, and authenticated redirect succeed.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | Frontend runtime is missing or using a stale `NEXT_PUBLIC_GOOGLE_CLIENT_ID` value. | High | Low | Pending |
| B | Google returns a credential, but the frontend request to `/auth/google` fails because of base URL, CORS, or cookie issues. | High | Medium | Pending |
| C | Frontend and backend client IDs do not match, so backend verification rejects the credential. | High | Low | Pending |
| D | Google button renders, but GIS callback never fires due to script/init issues in browser. | Medium | Medium | Pending |
| E | Backend accepts the credential, but session cookies are not established, so `/auth/me` still fails. | Medium | Medium | Pending |

## Log Evidence
- Pending instrumentation

## Verification Conclusion
- Pending evidence collection
