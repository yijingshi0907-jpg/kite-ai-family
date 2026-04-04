# Requirements: Auto-Document Signing Tool

**Defined:** 2026-04-04
**Core Value:** Zero manual steps from "document needs signing" to "signing link in Slack."

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can sign in with Google OAuth (reuses Gmail/Drive credentials)
- [ ] **AUTH-02**: Session persists across browser refresh
- [ ] **AUTH-03**: User can connect Slack workspace via OAuth

### Source Monitoring

- [ ] **SRC-01**: App monitors user's Gmail for emails with "sign", "contract", or "agreement" in subject or body
- [ ] **SRC-02**: App monitors connected Slack channels for messages with those keywords containing file attachments
- [ ] **SRC-03**: App monitors a designated Google Drive folder for new documents
- [ ] **SRC-04**: Detected documents appear in dashboard as "Pending Review" before being sent for signing

### Signing Workflow

- [ ] **SIGN-01**: User reviews a detected document and specifies signer email addresses
- [ ] **SIGN-02**: App sends document to Dropbox Sign API with specified signers
- [ ] **SIGN-03**: Dropbox Sign signing link is posted to a configured Slack channel automatically
- [ ] **SIGN-04**: Signing request is tracked in the dashboard with status (Pending, In Progress, Completed, Declined)

### Completion & Notifications

- [ ] **NOTIF-01**: App receives Dropbox Sign webhook on signing completion
- [ ] **NOTIF-02**: Dashboard status updates to "Completed" on webhook receipt
- [ ] **NOTIF-03**: Dropbox Sign automatically emails signed document to all signers (built-in behavior)

### Dashboard

- [ ] **DASH-01**: Dashboard shows all signing requests with status, document name, signers, and date
- [ ] **DASH-02**: User can view document details and audit trail (sent at, signed at, by whom)
- [ ] **DASH-03**: User can manually trigger a document for signing (upload + specify signers)
- [ ] **DASH-04**: Settings page to configure: Slack channel for notifications, Drive folder to monitor, Gmail filter keywords

## v2 Requirements

### Enhanced Detection

- **DET-V2-01**: AI-powered document classification (not just keyword matching)
- **DET-V2-02**: Auto-suggest signers based on email sender/recipients

### Advanced Workflow

- **WF-V2-01**: Sequential multi-stage signing (signer 1 must sign before signer 2)
- **WF-V2-02**: Signing templates with pre-configured signer roles

### Reporting

- **REP-V2-01**: Signing completion time analytics
- **REP-V2-02**: Exportable audit log

## Out of Scope

| Feature | Reason |
|---------|--------|
| Built-in document editor | Documents always come from Gmail/Slack/Drive |
| Automated signer detection | User confirmed manual selection every time |
| Payment / billing | Internal tool, not SaaS v1 |
| Mobile app | Web-first |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 – AUTH-03 | Phase 1 | Pending |
| DASH-04 (settings scaffolding) | Phase 1 | Pending |
| SRC-01 – SRC-03 | Phase 2 | Pending |
| SRC-04, DASH-01 – DASH-02 | Phase 2 | Pending |
| SIGN-01 – SIGN-04 | Phase 3 | Pending |
| NOTIF-01 – NOTIF-03 | Phase 4 | Pending |
| DASH-03 | Phase 4 | Pending |
| Phase 5 | Hardening & Deploy | Pending |
