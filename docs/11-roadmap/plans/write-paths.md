# Plan — Write Paths (the milestone before M4)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `tasks-backend.md` + `tasks-frontend.md` (the 2026-10-07 audit note on M5.2), `06-api/endpoints/account.md` + `imports.md` + `inferences.md` + `runs.md`, `05-backend/modules/services-consent.md` + `services-ingestion.md` + `services-erasure.md` + `services-export.md` + `workers.md` + `crypto.md`, `03-data/encryption.md`, `03-data/database/retention-and-erasure.md`, `08-security-privacy/*`, `07-frontend/user-flows/onboarding-consent.md` + `connect-import.md` + `account-data-rights.md`, `10-testing/*`
> - **Consumed by:** the backend and frontend sessions (execution), `tasks-backend.md` + `tasks-frontend.md` (task lines are added from this plan once approved), the M4 and M6 plans (both reuse W0 and W2)
> - **Hard invalidations:** this plan changes DB tables (`runs`, `import_sources`, `users`, new `inference_feedback`), the API contract, and the object-encryption design → repositories + DTOs + migrations + ER diagram + OpenAPI + the frontend client + the security docs listed in §8
> - **Version:** v1 — **APPROVED 2026-10-11.** D1, D3, D5 and D8 were each approved as proposed below; D2, D4, D6 and D7 stand as engineering defaults. Task status lives in `tasks-backend.md` / `tasks-frontend.md` (section M5.W).

## 1. Why this milestone exists

A router audit on 2026-10-07 found that a real person cannot use the product through the API. Sixteen routes still return 501 and no roadmap task covered most of them:

| Area | Routes still 501 | What is missing behind them |
|---|---|---|
| Consent + account | `GET /v1/account`, `POST` / `DELETE /v1/account/consents`, `PUT /v1/account/retention` | Consent rows are created only by tests. No audit-log writer. `users` has no retention column. |
| Upload | `POST /v1/imports`, `GET /v1/imports`, `GET /v1/imports/{id}` | Nothing connects an upload to the ingestion service. No ingestion worker, no run type, no object storage. |
| Data rights | `POST /v1/account/export`, `DELETE /v1/account` | `services/erasure.py`, `services/export.py` and the purge worker do not exist. |
| Feedback | `POST /v1/inferences/{id}/confirm` | No storage for confirm/deny is specified anywhere. |
| Connectors | 5 routes | Out of scope here — M6. |

On the frontend, Onboarding, Connect and Account are static screens with no data wiring.

M4 (photo upload) and M6 (connector pulls) both feed the same upload and ingestion-run machinery, so it is built once, here.

## 2. Outcome

A new user can do all of the following through the UI, with no seeding and no test helpers:

1. Sign up, read the consent step, and grant consent. Nothing is ingested or processed before that.
2. Upload a Reddit export or an X archive and watch the ingestion run finish, with a kept-vs-dropped summary.
3. Run the audit on their own data and see the dashboard.
4. Confirm or deny an inference.
5. Change retention, export their data, and delete their account. After deletion their ciphertext is unrecoverable.

One Playwright test covers that journey end to end (§6, F5).

## 3. Design decisions

D1, D3, D5 and D8 are the material ones; all four were approved as proposed on 2026-10-11. D2, D4, D6 and D7 are engineering defaults, listed so they can be overridden.

### D1 — Object storage and the encrypted-object envelope are built now *(material)*

**Problem.** An uploaded file has to live somewhere between the API request and the worker. The queue must never carry content (`workers/attack.py`: "secrets never travel through the queue"; Redis would hold plaintext). Export bundles and M4's photos have the same need. Today there is no storage code at all (no settings class, no client).

**Constraint.** Decrypt model A (`05-backend/modules/crypto.md`): the per-user DEK never leaves Postgres. So the app cannot derive a media key from the DEK in-process, which is what `03-data/encryption.md` loosely describes ("SSE with a key derived from the DEK").

**Proposed design.**
- A storage **port** (`put`, `get`, `delete`, `delete_prefix`) with one S3-compatible adapter. Local dev and CI use **MinIO** in compose; deploy uses Cloudflare R2. No R2 account is needed until M7.
- Every object is encrypted **app-side** with **AES-256-GCM** under a random 256-bit **per-object key** (`cryptography`, already present through `pyjwt[crypto]`). The object key is wrapped **inside Postgres** with the existing `encrypt_field(user_id, key, master_key)` and stored as a T2 column next to the object reference.
- Result: the store only ever holds ciphertext; the DEK still never leaves Postgres; deleting the user's DEK makes every wrapped object key, and so every object, unrecoverable. Crypto-shred covers objects by construction, even an object the erasure job failed to delete.
- Object keys are namespaced `u/{user_id}/…` so erasure can delete by prefix.

**Alternatives rejected.**
- *Stage uploads in Postgres as encrypted `bytea`* — pushes multi-megabyte values through pgcrypto; slow and bloats the database.
- *Server-side encryption with customer keys (SSE-C)* — the store handles plaintext in transit to encryption, which contradicts "the store never holds plaintext" (`09-infra-devops/infrastructure.md`).
- *Parse and persist inside the request, no worker* — embedding is CPU-bound and belongs on the queue (`.claude/rules/backend.md`); no retry on failure.

**Cost.** One new compose service (MinIO), one new client dependency (`aiobotocore`; `boto3` in a threadpool is the fallback), and a spec correction to three security docs (§8).

### D2 — Ingestion and export are runs

Add `ingestion` and `export` to `runs.type` (CHECK constraint + `RunStatus` docs). `POST /v1/imports` and `POST /v1/account/export` return `202 + run_id` and reuse the existing polling and SSE, which the frontend already has. `RunCreate.type` is **not** widened (settled in WC, 2026-10-11): `POST /v1/runs` cannot carry an upload or drive the export service, so these two run types are created only by their own endpoints. `import_sources` gains `run_id`, `kept_count`, `dropped_count`; import status is derived from the run. Erasure is **not** a run (D5).

### D3 — Upload shape and limits *(material)*

- `POST /v1/imports` is multipart: `platform` (`reddit` | `x`) plus one or more files. Consent-gated. `Idempotency-Key` honoured like `/v1/runs`.
- **The browser extracts only the files the adapter needs** before upload: `comments.csv` and `posts.csv` from a Reddit export, `data/tweets.js` from an X archive. A full X archive with media is often several gigabytes; this keeps it on the user's device and is plain data minimisation. The server accepts the extracted files, or a zip under the cap, and treats both as untrusted.
- **X archives split their tweets:** large accounts have `data/tweets.js` plus `data/tweets-part1.js`, `tweets-part2.js`, …. The browser uploads each as a separate multipart file under its basename, and W2's adapter reads all parts in numeric order. **The adapters must accept these loose files, not only a zip** — today `XArchiveAdapter` takes zip bytes and reads the first `tweets.js` member only (found 2026-10-11).
- **Cap:** 50 MB per upload (env-configurable), enforced while streaming, before buffering.
- **Zip safety:** never extracted to disk; members read in memory by allow-listed name only; limits on member count and total uncompressed size (zip-bomb guard); no path handling at all.
- The raw upload is stored as an encrypted staging object (D1), the worker parses → normalises → **drops third-party content before anything is persisted** → encrypts + embeds + stores, then deletes the staging object. Filenames are never logged or stored.

### D4 — Consent API shape

- `POST /v1/account/consents {purpose}` grants; `DELETE /v1/account/consents/{purpose}` revokes. The current stub takes a body on `DELETE`, which proxies and generated clients handle badly.
- `ConsentRead` becomes `{self_audit, art9_inference, decoy}` booleans plus `policy_version` and `granted_at` per purpose. Today it has a boolean field named `purpose`.
- **The grant names the policy version the user saw** (amendment, 2026-10-11): `ConsentGrant {purpose, policy_version}`; `AccountRead` exposes the server's `current_policy_version`; a grant for any other version is refused with `409` and the client shows the current text. Without this the server would stamp a version the user may never have been shown, which undermines the consent record (GDPR Art. 7(1) demonstrability; Art. 9 explicit consent). The backend's configured policy version is the source of truth; the frontend keeps the policy text keyed by version and refuses to offer a grant for a version it has no text for. **Initial version: `2026-10-11`** (text in the frontend's `lib/consent/policy.ts`); W1 configures exactly this string. Before any public deploy the text needs a new version that names the AI model providers that receive content and states the retention period (see §9).
- Revocation is immediate (workers already re-check consent at execution). Revoking consent stops processing; it does not delete data. Deletion is erasure, and the UI says so.

### D5 — Erasure is synchronous, and the frontend deletes the Clerk identity *(material)*

- `DELETE /v1/account` runs on the privileged engine (the app role cannot delete `users` or touch `data_keys`). The user id comes from the verified token only, never from the request.
- Order: write the `erase` audit event → delete the user's objects by prefix → delete the `users` row, which cascades to every owned row and to `data_keys` (the crypto-shred). If object deletion fails the request fails with the database untouched and is safe to retry.
- It returns `204` when done. A `202 + run_id` (as `account.md` says today) cannot be polled, because the run row is deleted with the user.
- **Clerk:** after our `204`, the frontend calls Clerk's own account deletion and signs out. Clerk then sends `user.deleted`; our webhook handler finds no user and is a no-op. This adds no new backend egress. It needs "allow users to delete their accounts" switched on in the Clerk dashboard.
- The webhook path and the endpoint call the same `services/erasure.py`, so there is one erasure code path.

**Alternative.** The backend calls Clerk's admin API to delete the identity. Rejected for now: it is a new outbound call holding a Clerk secret, and `02-architecture/trust-boundaries.md` would gain an egress.

### D6 — Audit log writes go through a function

The app role has no privileges on `audit_log` today. Add a `SECURITY DEFINER` `write_audit_event(action, detail)` and grant only `EXECUTE`. The table stays append-only by construction: the app can add an event and nothing else. `detail` carries non-sensitive metadata only (purpose, policy version, counts).

### D7 — Confirm/deny storage

New table `inference_feedback (id, inference_id → inferences ON DELETE CASCADE, candidate_id → inference_candidates, confirmed bool, created_at)`, RLS as a child of `inferences`, one row per (inference, candidate) with upsert. The route takes `{candidate_id, confirmed}`, not `{value, confirmed}` as `inferences.md` says today, so a special-category value is never sent back to the server or stored twice.

### D8 — Retention: window and purge now; process-then-discard as its own task *(material)*

- `users.retention` (`retain` | `discard`, default `retain`). `items.expires_at` is set at ingest from `RETENTION_DAYS` (env; proposed default 180). A daily arq cron job, `workers/purge.py`, hard-deletes expired items and their objects.
- **Process-then-discard** deletes raw content right after a run and keeps only derived results. That removes what the attribution screen quotes and what Defend rewrites, so both need an honest "content discarded" state. It is a separate task (W7 + F4b) and lands last.

## 4. Backend tasks

Each task is one PR. Gates for every task: `ruff` + `mypy --strict` clean, tests added, `/code-review` and `/security-review` before done, OpenAPI republished when the contract changes (`definition-of-ready-done.md`).

| ID | Task | Needs | Done when |
|---|---|---|---|
| **WC** | Contract first: final DTOs and route signatures for every changed route (still 501), republish `openapi.json` | — | Frontend can generate its client and build on mocks |
| **W0** | Storage port + S3 adapter + encrypted-object envelope + MinIO in compose + settings | — | Round-trip works; store holds only ciphertext; tampered object fails authentication; after DEK deletion the object key cannot be unwrapped |
| **W1** | Consent grant / revoke, `GET /v1/account`, `write_audit_event` | WC | Grant then run succeeds; revoke then run is refused; every change writes an audit event; user A cannot see or change user B's consents |
| **W2** | `POST /v1/imports` + `GET` list / status, `ingestion` run type, ingestion worker, kept/dropped counts | WC, W0, W1 | Uploading the fixture Reddit export and X archive ends in a `succeeded` run with correct counts; third-party content never reaches the database or the store; over-cap and zip-bomb uploads are refused; no upload without consent |
| **W3** | Erasure service + `DELETE /v1/account`; webhook path reuses it | W0 | After erasure: owned rows gone, objects gone, a saved copy of the ciphertext cannot be decrypted, the audit row remains with `user_id` null; idempotent |
| **W4** | Retention setting, `expires_at` at ingest, purge cron | W2 | Expired items and their objects are deleted by the sweep; unexpired ones are not; setting is owner-scoped |
| **W5** | Export: `export` run type → encrypted bundle → owner-only expiring download → purge | W0, W1 | Bundle contains the user's own data only, no keys; download is refused for another user and after expiry; audit event written |
| **W6** | Confirm / deny (`inference_feedback`) | WC | Upsert works; refused for an inference the user does not own (404, no existence signal) |
| **W7** | Process-then-discard | W4 | After a run with `discard`, raw text and staging objects are gone and derived results remain; detail read reports "content discarded" instead of failing |

Order: **WC → W0 → W1 → W2 → W3 → W4 → W5 → W6 → W7.** W1 and W0 can swap. W3 comes straight after the first-run path because erasure must exist before any deploy.

Also closes `M1.4` for what this milestone uses (the Reddit and X adapters are exercised through the real route). The Takeout adapter stays unbuilt; photos are M4.1.

## 5. Security requirements, per task

These are the CLAUDE.md rules as they apply here. A PR that cannot show the matching test is not done.

| Rule | Applies to | How it is met |
|---|---|---|
| 1 Never log content, keys, prompts | all | Counts and ids only in logs; filenames never logged; a test asserts no plaintext or key appears in captured logs during upload, export and erasure |
| 2 Keys are bound parameters | W0, W5 | Object keys wrapped via `encrypt_field` with the master key bound; test asserts no key in the SQL text |
| 3 App role cannot read `data_keys` | W0, W3 | Unwrap only through the definer functions; erasure runs on the privileged engine in one narrow service |
| 4 RLS + app-layer scope on every tenant query | all | RLS-isolation test for each new or changed table and route; download and confirm re-check ownership; unknown ids return 404 |
| 5 Third-party content dropped at ingestion | W2 | Drop happens before encrypt, embed and persist; test uploads a fixture with third-party items and asserts none are stored anywhere, including the staging object after the run |
| 6 Special-category values encrypted + Art. 9 consent | W1, W5, W6 | Export includes special-category values only under `art9_inference` consent; confirm takes a candidate id, never a value |
| 7 No run without consent | W1, W2, W5 | Gate at the route and again in the worker; revocation between enqueue and execution fails the run closed |
| 8 Sub-processors see only what they must | W0 | The object store receives ciphertext only |

Untrusted-input handling for W2 (OWASP A05/A10): size cap enforced on the stream, content-type and member-name allow-lists, zip limits, parser errors mapped to a 422 problem response with no internals.

## 6. Frontend tasks

| ID | Task | Needs | Done when |
|---|---|---|---|
| **F1** | Onboarding: consent step wired; app routes refuse to load without `self_audit` consent (checked server-side in the DAL) | WC (mocks), then W1 | Consent recorded before any other screen is reachable; Art. 9 acknowledgement is a separate explicit choice; the no-false-safety statement is shown |
| **F2** | Connect: upload with in-browser extraction, run progress, kept-vs-dropped summary, error states | WC (mocks), then W2 | Fixture exports upload and complete; too-large, wrong-file and nothing-kept states render; large X archive never leaves the device whole |
| **F3** | Account: consents with revoke, retention switch, export request + download, delete account | WC (mocks), then W1, W3, W4, W5 | Each control round-trips against the live backend; delete needs a typed confirmation, then deletes the Clerk identity and signs out |
| **F4** | Confirm / deny on Attribution; **F4b** "content discarded" states | W6; W7 | Feedback persists across reloads; discarded content renders as a real state |
| **F5** | Playwright first-run journey against the local stack | F1–F3, W1–W3 | The journey in §2 passes with a Clerk test user |

The frontend starts F1–F3 on mocks as soon as WC is published and flips each to live when its backend task merges, as it did for the four data screens.

**Demo mode is explicit configuration, not inferred from failures** (added 2026-10-11). While the backend routes are stubs, the consent gate lets a 501 or an unreachable backend through so the public demo keeps working. At the W1 live flip that inference is removed: a build with no API base URL configured (or an explicit demo flag) runs on fixtures behind a visible "demo data" label with no gate; a build with a backend configured is strict — every failure denies, and data screens show an error state, never sample data. The public Vercel deployment has no backend until M7 and stays in demo mode until then.

**Model calls in F5.** The audit step needs the gateway. The test stack points LiteLLM at a small mock OpenAI-compatible server that returns schema-valid fixture responses, so the app code has no "fake" branch that could be switched on in production. Real-model behaviour is covered by the first real run at M7, not by this test.

## 7. Tests that must exist at the end

- RLS isolation for `inference_feedback` and for every new or changed route.
- Crypto: object round-trip, tamper detection, and shred (object key cannot be unwrapped after DEK deletion).
- Third-party drop through the real upload route.
- Consent gate at route and worker, including revoke-while-queued.
- Erasure: rows, objects, ciphertext and audit behaviour as in W3.
- Schemathesis over the newly implemented routes.
- Frontend: Vitest for the DAL and accessors, the Playwright journey, and the existing accessibility sweep extended to the three screens.

## 8. Spec documents to update with the code

Each backend task updates the docs it invalidates in the same change (`00-traceability.md`).

- **Encryption design (D1):** `03-data/encryption.md`, `05-backend/modules/crypto.md`, `08-security-privacy/key-management.md` — replace "SSE with a DEK-derived key" with the per-object key wrapped in-database; `08-security-privacy/sub-processors.md` (object store row: ciphertext only); `10-testing/crypto-tests.md`.
- **Schema (D2, D7, D8):** `03-data/database/tables/runs.md`, `import_sources.md`, `users.md`, `audit_log.md`, new `inference_feedback.md`; the ER diagram; `02-architecture/run-lifecycle.md` (run types).
- **API (D3, D4, D5, D7):** `06-api/endpoints/account.md`, `imports.md`, `inferences.md`, `runs.md`.
- **Services and workers:** `05-backend/modules/services-erasure.md` (synchronous; Clerk identity deleted by the frontend), `services-export.md`, `services-ingestion.md` (staging object), `workers.md` (ingestion, export, purge).
- **Infra:** `02-architecture/deployment-topology.md` and `09-infra-devops/infrastructure.md` (MinIO in dev, R2 at deploy).
- **Frontend flows:** `onboarding-consent.md`, `connect-import.md` (in-browser extraction), `account-data-rights.md`.
- **Roadmap:** task lines W* and F* added to `tasks-backend.md` and `tasks-frontend.md`; `milestones.md` and `build-order.md` gain this milestone before M4.

## 9. Risks and open points

| Risk | Effect | Handling |
|---|---|---|
| Clerk self-deletion is off by default | F3 delete cannot remove the identity | Switch it on in the Clerk dashboard before F3; until then the backend erasure still works and the identity is left behind, which the UI must not hide |
| Current AWS SDKs send checksums R2 has rejected | Uploads fail at deploy | Set checksum calculation to "when required" in the adapter; verify against R2 at M7, not here |
| `aiobotocore` lags `boto3` | Dependency friction | Fallback is `boto3` behind a threadpool; the port hides the choice |
| Low disk on the dev Mac (about 22 GB free) | MinIO image and volumes add pressure | MinIO is small (about 100 MB); upload cap keeps volumes small; prune only with the user's say-so |
| In-browser zip reading on very large archives | Slow or memory-heavy on old devices | Stream the zip index and read only the needed members; show progress; fall back to "upload the extracted file" instructions |
| Process-then-discard touches several reads | Regressions in Attribution and Defend | Isolated as W7 + F4b, last, behind its own tests |
| Consent text does not yet name the AI model providers or the retention period | Incomplete transparency if deployed as is | Acceptable while nothing is deployed with real users; a new policy version with both is required before M7's public deploy |
| No real-model run until M7 | A real run may expose gateway faults (temperature, refusals) after this milestone | Accepted by decision on 2026-10-07; not addressed here |

## 10. Size

About nine backend PRs and five frontend PRs. This is larger than the first estimate given on 2026-10-07 (six to nine backend, three frontend), because the object-storage foundation (W0) and the split of process-then-discard (W7) were not in that count.
