# Local operation and safety review

Inspected and checked on 16 November 2026. No application startup, database
connection, real email, or real payment was performed. Tests isolate environment
variables and replace database/provider operations with in-memory doubles.
Existing `.env` files were not read or overwritten. Nothing was committed,
pushed, or deployed.

## Local configuration and commands

Use Node >=22.21.0. The checked environment has Node 24.11.1 and npm 11.6.2.
From the project root, prepare the backend in PowerShell:

```powershell
cd backend
npm ci
if (-not (Test-Path -LiteralPath .env)) {
    Copy-Item -LiteralPath .env.example -Destination .env
}
```

Before starting, configure `MONGO_URI` for a separate development database and
replace the JWT placeholder with a unique development secret. The template uses
`mongodb://127.0.0.1:27017/odogwu_bites_dev`; run MongoDB separately if using that
URI. Inspect any existing environment configuration yourself before startup,
including inherited shell variables: dotenv does not override them by default.
Startup connects to MongoDB and upserts default categories. Do not use production
database credentials. Then run `npm run dev` (equivalent to `npm start`) from
`backend`; the default port is 3000.

In a second terminal, from the project root:

```powershell
cd frontend
npm ci
npm start
```

The frontend serves on port 4200 and its development configuration uses
`http://localhost:3000`. `npm run build` defaults to production and retains
`https://odogwubites.onrender.com`. Angular's development `fileReplacements`
select `environment.development.ts`; no frontend `.env` loader was introduced.
All nine API services, including the separate payment profile request, import
the shared environment. Both interceptors compare parsed URL origins and path
boundaries, rejecting credentials in URLs and malformed/foreign URLs. Tokens
are never automatically added based on a hostname substring.

Leave `RESEND_API_KEY` and `MODEM_PAY_SECRET_KEY` empty for local operation
without these providers. Cloudinary credentials are also optional for startup.
`MONGO_URI` is required for startup; `JWT_SECRET` is required for authentication.
The environment template and root secret-file ignore rules are preserved.

## Payment trace and changes

`backend/index.js` mounts `backend/route/payment.js` at `/payment`.

* `POST /payment/deposit` runs `isLoggedIn`: it verifies the JWT and loads its
  user from MongoDB. It does not require an admin role. Previously, an absent
  `MODEM_PAY_SECRET_KEY` made any positive requested amount increase that user's
  balance, save the user, and create a Completed Wallet payment. No provider was
  contacted and no payment was verified. The old coercive validation also
  accepted numeric strings and did not explicitly reject non-finite values.
* `GET /payment/verify-deposit` is unauthenticated. It accepts query parameters
  `userId` and `amount`, finds the latest matching Pending Online payment, and
  loads the user. Previously, an absent client or transaction ID skipped the
  provider check, marked the record Completed, and credited the wallet.
* `PATCH /payment/confirm/:paymentId` has JWT and admin middleware and implements
  manual payment confirmation. It also marks a payment Completed and credits
  the associated user.

All three modifying handlers now return HTTP 503 when payment configuration is
absent, before any controller database/provider operation. There is no fallback
wallet credit. Deposit amounts must be finite positive JSON numbers. Verification
validates query parameters and returns HTTP 409 for a missing transaction ID.
With configuration present, unsuccessful/unverifiable provider results cannot
reach the verification credit branch. Regression tests check zero database
access, zero writes, unchanged balances/status, and no provider initialization
when credentials are missing. All configured-provider checks use fakes.

## Email behavior

Resend is constructed only when a nonempty key exists. Without a key, delivery
rejects with `EMAIL_UNAVAILABLE` and HTTP status metadata 503 before any provider
call. The email helper preserves that error. Registration still creates an
unverified account and explicitly returns `emailSent: false` on failed delivery;
it never reports delivery success or automatically verifies the account.
Password-reset requests return HTTP 503 on unavailable delivery, do not return
the reset token, and do not change a password. Resetting still requires the
existing valid-token and user checks. The existing explicit development-only
verification-link response is preserved. Login logging of request bodies and
user records was removed to avoid printing passwords and other account data.

## Backend dependency audit

The initial `npm audit --json` reported **22 affected packages: 3 critical,
11 high, 8 moderate**. These are affected-package counts, not unique advisory
counts. Every package was in the production dependency graph; there were no
backend development dependencies or development-only findings.

Removed four unused direct dependencies after confirming no runtime imports:
`nodemailer`, `nodemailer-express-handlebars`, `express-handlebars`, and
`multer-storage-cloudinary`. Active email uses Resend plus Handlebars directly;
active uploads use Multer memory storage plus Cloudinary's upload stream.
Then ran `npm audit fix --ignore-scripts`, which respected declared version
ranges. No force option, dependency override, or direct major upgrade was used.

| Affected package(s) and initial severity | Production dependency path / runtime relevance | Resolution / available fix |
| --- | --- | --- |
| `express` moderate, `body-parser` high, `qs` moderate | Direct Express -> body-parser/qs; incoming HTTP parsing | Express 4.22.1 -> 4.22.3; body-parser 1.20.4 -> 1.20.9; qs 6.14.1 -> 6.16.2 |
| `path-to-regexp` high | Express -> path-to-regexp; route matching | 0.1.12 -> 0.1.13 |
| `proxy-addr` critical | Express -> proxy-addr; forwarded client address handling; app enables trust proxy | 2.0.7 -> 2.0.8 |
| `mongoose` critical | Direct; all database model operations | 8.21.0 -> 8.24.10 |
| `handlebars` critical | Direct; compiles repository-controlled email templates; attacker-controlled templates are not an intended input | 4.7.8 -> 4.7.10 |
| `multer` high | Direct; incoming menu image multipart uploads | 2.0.2 -> 2.5.0 |
| `axios` high | modem-pay -> axios; outbound payment HTTP requests when configured | 1.13.2 -> 1.21.1 |
| `follow-redirects` moderate, `form-data` high | modem-pay -> axios -> these packages; outbound HTTP redirects/multipart handling | 1.15.11 -> 1.16.3; 4.0.5 -> 4.0.6 |
| `resend`, `svix`, `uuid` moderate | Resend -> svix -> uuid; webhook/UUID functionality was not used by application email sending | Resend 6.7.0 -> 6.38.1; vulnerable svix/uuid dependencies removed from resolved tree |
| `lodash` high | Cloudinary -> lodash and cloudinary-core -> lodash | 4.17.21 -> 4.18.1 |
| `express-handlebars`, `glob` moderate; `minimatch`, `@isaacs/brace-expansion` high | Unused express-handlebars -> glob -> minimatch -> brace-expansion; file/template matching | Removed unused dependency tree. Audit otherwise proposed express-handlebars 9.0.6, a major upgrade, for the glob finding |
| `nodemailer` high | Unused direct dependency and nodemailer-express-handlebars -> nodemailer | Removed unused dependencies. Audit otherwise proposed Nodemailer 10.6.0, a major upgrade |
| `multer-storage-cloudinary` high | Unused direct dependency -> Cloudinary peer; inherits Cloudinary advisory | Removed unused adapter. Audit's proposed 2.2.1 adapter change was a major downgrade and was not applied |
| `cloudinary` high | Direct; active menu image uploads use `v2.uploader.upload_stream`; SDK has argument-injection advisory | **Unresolved:** 1.41.3 remains. Advisory affects <2.7.0; audit proposes 2.11.0. Requires a reviewed major SDK migration, not a compatible automatic fix |

Final `npm audit --omit=dev --json`: **one high finding**, Cloudinary. It exits
with status 1 because the finding remains. [Cloudinary advisory](https://github.com/advisories/GHSA-g4mf-96x5-5m2c)
describes argument injection through ampersands in SDK parameters. This is an
active production dependency, although this application supplies a buffer and
a fixed folder to uploads rather than accepting arbitrary upload options.
That narrower usage does not establish that the vulnerable SDK is safe.

Machine-readable evidence: `backend-audit-before.json` and
`backend-audit-after.json` in this directory include the advisory URLs, affected
ranges, and npm's fix suggestions.

## Remaining security findings

These existing issues need a separate authorization/payment integrity change;
they were not exercised against a database or external provider:

1. **Critical: public role mutation.** `backend/route/authentication.js` exposes
   `/auth/become-admin`, `/auth/become-staff`, and `/auth/fire-staff` without auth
   middleware. The corresponding handlers change the supplied email's role.
   This can undermine the admin restriction on manual payment confirmation.
2. **Payment settlement is not atomic or idempotent.** Verification and manual
   confirmation separately read a payment, mark it completed, and read/modify/save
   the balance. Concurrent calls can race, and a partial failure can leave
   payment and balance inconsistent. Use a database transaction and conditional
   settlement plus a unique provider transaction identity in a follow-up.
3. **Configured manual confirmation does not verify an online provider payment.**
   The admin endpoint still manually credits any eligible payment when payment
   configuration is present. Verification also only checks provider status;
   provider amount, currency, and ownership metadata should be explicitly bound
   to the stored payment. The missing-configuration bypasses are fixed, but this
   does not constitute a full payment-integrity audit.

## Validation

* Backend `npm test`: payment and email regression tests pass; all provider and
  database behavior is mocked. Installed Resend/Handlebars are also loaded and
  an email template rendered without delivery.
* Focused Angular tests in ChromeHeadless: 28 passed (API boundary, interceptors,
  and homepage service). The first attempt found an existing stale `Homepage`
  import in its spec; corrected it to the exported `HomepageService` and supplied
  HTTP test providers. The focused rerun passes. The full legacy UI test suite
  was not run.
* Development build: passed. Its emitted main bundle contains localhost:3000
  and excludes the production API URL.
* Production `npm run build`: passed, including the existing output-flattening
  script. Its emitted main bundle contains the Render API URL and excludes
  localhost:3000. Default serve/build configuration mapping was also checked.
* `npm ls --omit=dev --depth=0`: passes with the updated dependency tree.
* Root ignore rules protect local environment files, and `.env.example` remains
  trackable. No `.env` was created or overwritten.

End-to-end application startup and live provider checks were intentionally not
run. A configured separate development database is still needed to run the
backend; real email and payment delivery remain unavailable with empty keys.
