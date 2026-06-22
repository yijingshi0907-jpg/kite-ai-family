# PRD — Chi 家庭动态站 (Chi Family Update Site)

**Owner:** Yijing Shi
**Last updated:** 2026-06-22
**Status:** Live — https://cz-family.zeabur.app/family

---

## 1. Background & Problem

Chi Zhang is the CEO of Kite AI. His family in mainland China wants to follow his
work — interviews, podcasts, company news, and weekly updates — but the primary
sources are inaccessible or hard to use from China:

- Content is in **English** (family reads Chinese).
- Sources are on **X (Twitter), YouTube, Medium** — blocked or unreliable in mainland China.
- Hosting on **Vercel** is intermittently blocked in mainland China.

There is no single, Chinese-language, China-accessible place for the family to
keep up with Chi's public activity.

## 2. Goal

A simple, password-protected, **Chinese-language** website that aggregates Chi's
public updates into one place, hosted somewhere **reachable from mainland China**,
and updatable **weekly** with low effort.

### Non-goals
- Not a public marketing site (family-only, passcode-gated).
- Not real-time — weekly manual refresh is acceptable.
- No user accounts, comments, or social features.
- Does not host/mirror videos (links out; VPN noted for video playback).

## 3. Target users

- **Primary:** Chi's family members in mainland China (non-technical, mobile-first, Chinese-reading).
- **Secondary:** Yijing (maintainer) who updates content weekly.

## 4. Core features (current)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Passcode gate** | Visitors enter `20260606`; 90-day cookie. Protects the whole `/family` area. |
| 2 | **Weekly updates** | Chinese posts from @KiteAIChinese, grouped by week, each with a 1–2 sentence summary. |
| 3 | **Personal page** | Chi's interviews & "AI on Air" appearances + personal news, in Chinese. |
| 4 | **Company page** | Press coverage (Fortune, CoinDesk, etc.) + Medium blog, summarized in Chinese. |
| 5 | **Links page** | Podcast episodes + curated reference links. |
| 6 | **Mobile-friendly** | Responsive layout, smaller paddings/grids on phones. |
| 7 | **Image proxy** | YouTube thumbnails proxied through the server so they load in China. |
| 8 | **VPN notice** | Banner: 📺 观看视频需要翻墙 (videos require a VPN). |
| 9 | **Read-at-source** | External articles link directly to the original with "阅读原文 →". |

## 5. Content model

Five content types, all stored in PostgreSQL and edited via `prisma/seed-family.mjs`:

- `FamilyWeeklyPost` — weekly X/update posts (with `summaryZh`)
- `FamilyInterview` — interviews & video appearances
- `FamilyNewsArticle` — press / news coverage
- `FamilyPodcast` — podcast episodes
- `FamilyRefLink` — curated links

Current seed: 39 weekly posts, 16 interviews, 6 news, 15 podcasts, 8 ref links.

## 6. Tech architecture

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind.
- **DB:** PostgreSQL on **Zeabur** (Thailand/Aliyun region, co-located with the app).
- **ORM:** Prisma 7 via the `PrismaPg` driver adapter (no `url` in schema; adapter in `src/lib/db.ts`).
- **Auth:** Passcode cookie via `/api/family-auth`; NextAuth present only for the
  legacy internal signing tool, not used by the family site.
- **Hosting:** Zeabur, auto-deploy on push to `main`. Public domain
  `cz-family.zeabur.app` with automatic HTTPS.
- **China accessibility:** App + DB in an Asia region; no dependency on US-hosted
  services for page rendering.

### Key decisions / learnings
- **Vercel → Zeabur**: Vercel blocked in mainland China; Zeabur supports Asia regions.
- **External DB → co-located DB**: An external US (Neon) database was unreachable
  from the Asia app container. The DB now lives inside the Zeabur project; the app
  connects over the internal network (`postgresql.zeabur.internal`).
- **Removed integrations**: Google/Slack/Dropbox auth and the Baidu translation
  proxy were removed — the family site only needs the database. Translations are
  authored manually at seed time.

## 7. Maintenance workflow

Weekly content updates run through the **`/family-sync`** skill:
gather new items → edit `seed-family.mjs` → re-seed the Zeabur DB → push (auto-deploy)
→ verify. Re-seeding updates the live site immediately (data lives in the DB, not the build).

## 8. Open items / future work

| Item | Notes |
|------|-------|
| **Bilibili embeds** | Re-upload videos to Bilibili so family can watch without a VPN. Blocked on videos being uploaded there. |
| **Admin UI** | Replace hand-editing `seed-family.mjs` with a simple authenticated admin page (CRUD). |
| **Automated weekly pull** | Currently manual. An X/RSS pull could pre-fill new items (limited by X API access). |
| **Custom domain** | Optionally bind a friendlier domain. |
| **ICP filing** | If moving to a mainland China region for best performance, requires ICP 备案. |

## 9. Success criteria

- Family in mainland China can open the site and read updates **without a VPN**
  (video playback excepted).
- Weekly update takes the maintainer **< 30 minutes**.
- All content is in **Chinese** and **summarized** for quick reading.
