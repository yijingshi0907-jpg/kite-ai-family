# Roadmap: Auto-Document Signing Tool

**Created:** 2026-04-04
**Stack:** Next.js (App Router) · Prisma · PostgreSQL · Tailwind CSS · NextAuth.js · Google OAuth · Slack OAuth · Dropbox Sign API

---

## Phase 1: Foundation

**Goal:** Working app with Google OAuth sign-in, database, and settings page skeleton.

### Tasks
- [ ] Initialize Next.js project (App Router, TypeScript, Tailwind)
- [ ] Configure Prisma schema (User, SigningRequest, DetectedDocument, Integration)
- [ ] Implement Google OAuth with NextAuth.js (reuses Gmail/Drive scope)
- [ ] Settings page: configure Slack channel, Drive folder, Gmail keywords
- [ ] Basic layout: nav, sidebar, authenticated shell

**Done when:** User can sign in with Google and see an empty dashboard.

---

## Phase 2: Source Monitoring

**Goal:** App detects documents needing signing from Gmail, Slack, and Google Drive.

### Tasks
- [ ] Gmail API integration: poll for emails matching keywords, extract attachments
- [ ] Google Drive API integration: monitor designated folder for new files
- [ ] Slack OAuth + API integration: monitor configured channels for keyword messages with attachments
- [ ] Background polling job (cron via Vercel or node-cron) to check sources on interval
- [ ] Detected documents queue: show "Pending Review" items in dashboard

**Done when:** A document sent via Gmail with "contract" in the subject appears in the dashboard.

---

## Phase 3: Signing Workflow

**Goal:** User can send a detected document to Dropbox Sign and get the link in Slack.

### Tasks
- [ ] Dropbox Sign API integration: create signing request with document + signers
- [ ] Signer selection UI: user specifies email addresses before sending
- [ ] Post signing link to configured Slack channel automatically
- [ ] Track signing request status in database
- [ ] Dashboard: signing request list with status badges

**Done when:** User clicks "Send for Signing", enters signer emails, and the Dropbox Sign link appears in Slack.

---

## Phase 4: Completion & Webhooks

**Goal:** App knows when signing is complete and updates dashboard accordingly.

### Tasks
- [ ] Dropbox Sign webhook endpoint: receive completion/decline events
- [ ] Update SigningRequest status on webhook receipt
- [ ] Dashboard status updates in real-time (or on refresh)
- [ ] Manual upload flow: user can upload any doc directly and send for signing
- [ ] Audit trail: show timeline of events per signing request

**Done when:** After all signers complete, dashboard shows "Completed" and audit trail is visible.

---

## Phase 5: Hardening & Deploy

**Goal:** Production-ready, deployed, usable.

### Tasks
- [ ] Input validation on all API routes
- [ ] Error handling: failed API calls, expired tokens, webhook failures
- [ ] OAuth token refresh handling (Gmail, Drive, Slack)
- [ ] Environment config for production
- [ ] Deploy to Vercel
- [ ] Production database setup and migration
- [ ] Smoke test full flow in production (detect → sign → complete)

**Done when:** The full flow works end-to-end in production with real documents.
