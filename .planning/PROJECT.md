# Auto-Document Signing Tool

## What This Is

A web app that monitors Gmail, Slack, and Google Drive for documents needing signatures (detected by keywords like "sign", "contract", "agreement"), automatically sends them to Dropbox Sign for e-signing, posts the signing link to Slack, and tracks completion. Users specify signers manually per request. Once all parties sign, Dropbox Sign emails the signed document to everyone.

## Core Value

Zero manual steps from "document needs signing" to "signing link in Slack."

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Detect documents needing signing from Gmail, Slack messages, and Google Drive
- [ ] Send detected documents to Dropbox Sign API with manually-specified signers
- [ ] Post signing link to Slack automatically
- [ ] Dashboard to view, manage, and track all signing requests
- [ ] Webhook handling for Dropbox Sign completion events
- [ ] Notify when signing is complete (Dropbox Sign emails signed doc automatically)

### Out of Scope

- Automated signer detection — signers are always specified manually
- Built-in document editor — documents come from Gmail/Slack/Drive
- Payment/billing — internal tool for now

## Context

- Integrations required: Gmail API, Slack API, Google Drive API, Dropbox Sign API
- Stack: Next.js (App Router) + Prisma + PostgreSQL + Tailwind + NextAuth.js
- Background monitoring: polling or webhooks to detect new documents needing signing
- Dropbox Sign handles sending signed doc to all parties after completion

## Constraints

- **External APIs**: Gmail OAuth, Slack OAuth, Google Drive OAuth, Dropbox Sign API — all require credentials setup
- **Webhooks**: Dropbox Sign webhooks need a publicly accessible URL for dev (use ngrok)
- **Security**: OAuth tokens stored securely, never in client-side code

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js full-stack | One repo, API routes for webhooks + UI | — Pending |
| Dropbox Sign API | User specified this service | — Pending |
| Manual signer selection | User confirmed — no auto-detection of signers | — Pending |
| Keyword detection (sign/contract/agreement) | Simple, reliable trigger mechanism | — Pending |

---
*Last updated: 2026-04-04 after initial project questioning*
