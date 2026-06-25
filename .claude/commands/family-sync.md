# /family-sync — Chi 家庭站 内容同步 & 部署

Use this skill to add new weekly content, re-seed the database, and deploy.

## Live site

- **URL**: https://cz-family.zeabur.app/family
- **Passcode**: `20260606` (visitors must enter this; 90-day cookie)
- **Host**: Zeabur (Thailand / Aliyun region) — chosen for China accessibility (Vercel is unreliable in mainland China)
- **Database**: PostgreSQL hosted **on Zeabur** (same project/region as the app)
- **Repo**: https://github.com/yijingshi0907-jpg/kite-ai-family

---

## Deployment options

The app is a standard Next.js app and can run on either platform. Pick by audience.

### Option A — Zeabur (CHINA / current production) ⭐

Best when the audience is in **mainland China**. Vercel's `*.vercel.app` is
intermittently blocked there; Zeabur supports Asia regions that are reachable.

- **Region**: Thailand / Aliyun (Asia). For best mainland performance, a China
  region is possible but requires an **ICP 备案** license.
- **Database**: PostgreSQL **co-located in the same Zeabur project**. The app must
  use the **internal** host (`postgresql.zeabur.internal:5432`); the public IP is
  NOT reachable from inside Zeabur. Use the public host only for local seeding.
- **Deploy**: auto-deploys on push to `main`. No CLI step.
- **HTTPS**: automatic on the `*.zeabur.app` domain.
- **Env vars** (Variable tab): `DATABASE_URL` (internal host), `NEXTAUTH_SECRET`,
  `NEXTAUTH_URL=https://cz-family.zeabur.app`, `AUTH_TRUST_HOST=true`, `FAMILY_PASSCODE`.
- **Live**: https://cz-family.zeabur.app/family

### Option B — Vercel (GLOBAL / outside China)

Best when the audience is **outside mainland China** (US, EU, etc.). Simplest
Next.js hosting, fastest global CDN.

- **Database**: any managed Postgres works — e.g. **Neon** (serverless, US/EU regions).
  No co-location requirement; Vercel functions reach external DBs fine.
  Example Neon URL: `postgresql://...@ep-...neon.tech/neondb?sslmode=require`
- **Deploy**: `npx vercel deploy --prod --yes` (or auto-deploy via GitHub integration).
- **HTTPS**: automatic on `*.vercel.app` and custom domains.
- **Env vars** (Project Settings → Environment Variables): `DATABASE_URL` (Neon),
  `NEXTAUTH_SECRET`, `NEXTAUTH_URL=https://<project>.vercel.app`, `FAMILY_PASSCODE`.
  (`AUTH_TRUST_HOST` not needed on Vercel.)
- **Note**: do NOT use a US-hosted DB with a China-region app server — the cross-region
  hop fails. Match DB locality to the host (Vercel↔Neon US/EU; Zeabur↔Zeabur Asia DB).

### Switching platforms — checklist

1. Provision a DB reachable from the chosen host (co-located if China).
2. Migrate schema + seed data into that DB (Steps 3–4 below) using its **public** URL.
3. Set `DATABASE_URL` on the host to the **runtime** URL (internal for Zeabur).
4. Set `NEXTAUTH_URL` to the new domain; add `AUTH_TRUST_HOST=true` on Zeabur only.
5. Deploy and verify `/family` loads (Step 6).

## When to run

- Every week when new posts appear on @KiteAIChinese / @GoKiteAI
- When new interviews, podcasts, or news articles are published
- When any family site content needs updating

---

## Step 1 — Gather new content

Ask the user for this week's new items. For each type, collect:

**Weekly posts** (from @KiteAIChinese on X):
- `date` — post date (YYYY-MM-DD)
- `weekOf` — Monday of that week (YYYY-MM-DD)
- `weekLabel` — e.g. "2026 年 6 月 29 日 当周"
- `textZh` — full Chinese post text
- `summaryZh` — 1-2 sentence summary (write this yourself based on textZh)
- `url` — X post URL or YouTube URL
- `mediaUrl` — YouTube thumbnail URL if video
- `likes` — like count if notable (optional)

**Interviews / AI on Air episodes** (new YouTube videos):
- `date`, `titleZh`, `bodyZh` (description), `type` ("interview" or "podcast")
- `youtubeId` — the video ID from YouTube URL
- `sourceUrl` — full YouTube URL

**News articles** (Fortune, CoinDesk, Cointelegraph, Medium, etc.):
- `date`, `titleEn`, `titleZh` (translate it), `descZh`, `publisher`, `url`

**Podcasts** (AI on Air new episodes):
- `episode` number, `titleZh`, `guestZh`, `guestOrgZh`, `youtubeUrl`

---

## Step 2 — Update seed-family.mjs

Edit `prisma/seed-family.mjs`:

1. Add new weekly posts to the TOP of the `weeklyGroups` array (newest first). If the week already exists, add posts to that week's `posts` array.
2. Add new interviews to the TOP of the `interviews` array.
3. Add new news articles to the TOP of the `newsArticles` array.
4. Add new podcasts to the TOP of the `podcasts` array (sorted by episode descending).

**sortOrder** is assigned automatically by the seed script — no need to set it manually.

Write a `summaryZh` for every new weekly post. Keep it 1-2 sentences, factual, in Chinese.

---

## Step 3 — Run database migration (only if schema changed)

The seed/migration runs from your local machine against the Zeabur DB **public**
connection string (the internal `.zeabur.internal` host only works from inside Zeabur).

`prisma db push` needs `datasource.url` in `prisma.config.ts`. It is normally
removed (it breaks the Zeabur build). To migrate, temporarily add it back:

```ts
// prisma.config.ts — TEMPORARY for migrations only
import "dotenv/config";
import { defineConfig } from "prisma/config";
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: process.env.DATABASE_URL },
});
```

Then:
```bash
DATABASE_URL="postgresql://root:sne1ZR3945pB8yDYOkvM6FfhdVo0W7x2@47.81.30.93:32606/zeabur" npx prisma db push
```

**Revert `prisma.config.ts`** afterward (remove the datasource block) — otherwise the Zeabur build fails.

---

## Step 4 — Re-seed the database

Seeding does NOT need the datasource in config — run directly with the public URL:

```bash
DATABASE_URL="postgresql://root:sne1ZR3945pB8yDYOkvM6FfhdVo0W7x2@47.81.30.93:32606/zeabur" node prisma/seed-family.mjs
```

Confirm output shows the expected counts (weekly posts, interviews, news, podcasts, ref links).

---

## Step 4.5 — Self-host new videos (interviews / podcasts)

Videos play **in-page** from Cloudflare R2 (no VPN needed in China). The player
derives each URL automatically from `VIDEO_BASE_URL` + the YouTube ID, so the ONLY
requirement is: **every video's `<youtube-id>.mp4` must exist in the R2 bucket.**
No DB field, no per-video config — just add the interview/podcast to the seed
(Step 2) with its `youtubeId`, then upload the file here.

**Flow for new videos:**

1. **Find new videos** on the Kite YouTube channel: https://www.youtube.com/@kiteai_official/videos
   Collect each new video's **ID** (the `v=XXXX` part of the URL).

2. **Download** them by ID (the script names them `<id>.mp4` automatically):
   ```bash
   bash scripts/download-family-videos.sh ID1 ID2 ID3   # pass only the NEW ids
   ```
   > Uses `yt-dlp` (reliable, scriptable). The greenvideo.cc website also works but
   > is manual (captchas, 1 file at a time) — `yt-dlp` is the automated path.

3. **Upload** to R2 (skips files already there, resumes on network drops):
   ```bash
   bash scripts/upload-family-videos.sh
   ```
   One-time setup for `rclone` is documented at the top of that script.

4. **Confirm** all expected files are in the bucket — the upload script prints the
   list, or run `rclone ls r2:cz-family-videos`.

That's it. Because `VIDEO_BASE_URL` is already set on Zeabur, once a `<id>.mp4` is in
the bucket AND the matching interview/podcast row is seeded, the in-page player
appears. Missing file → that card falls back to the YouTube link automatically.

> `VIDEO_BASE_URL` = `https://pub-b604ad8e33a347029effe5e91124b38d.r2.dev` (R2 public).
> If China playback is slow, put the bucket behind a custom domain and update this var.

---

## Step 5 — Commit and deploy

Zeabur auto-deploys on every push to `main` (no CLI deploy needed):

```bash
git add prisma/seed-family.mjs
git commit -m "content: weekly sync YYYY-MM-DD — add N new posts"
git push origin main
```

Watch the build in **Zeabur → service → Deployments**. Wait for **Running**.

> Note: Data lives in the DB, not the build. Re-seeding (Step 4) updates the live
> site immediately — a redeploy is only needed for code/schema changes.

---

## Step 6 — Verify

Open https://cz-family.zeabur.app/family/weekly (enter passcode if prompted) and confirm:
- New week section appears at top
- Summaries show correctly
- Thumbnails load for video cards

---

## Key files

| File | Purpose |
|------|---------|
| `prisma/seed-family.mjs` | All content data — edit this for updates |
| `prisma/schema.prisma` | DB schema — edit if adding new fields |
| `prisma.config.ts` | Prisma CLI config — keep datasource OUT for builds |
| `src/lib/family-db.ts` | DB query functions + interfaces |
| `src/lib/db.ts` | Prisma client (PrismaPg driver adapter) |
| `src/app/family/layout.tsx` | Shell + passcode gate |
| `src/app/family/PasscodeGate.tsx` | Passcode entry UI |
| `src/app/api/family-auth/route.ts` | Passcode check → sets cookie |
| `src/app/family/weekly/page.tsx` | Weekly posts page |
| `src/app/family/personal/page.tsx` | Chi's interviews + news |
| `src/app/family/company/page.tsx` | Press + Medium articles |
| `src/app/family/links/page.tsx` | Podcasts + ref links |
| `src/app/api/image-proxy/route.ts` | YouTube thumbnail proxy |

## Environment variables (Zeabur — app service)

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://root:...@postgresql.zeabur.internal:5432/zeabur` (internal host!) |
| `NEXTAUTH_SECRET` | `AKJDO+Qtnn8DnPTkpqOIF12wazW9urcwCQT6WJ725QY=` |
| `NEXTAUTH_URL` | `https://cz-family.zeabur.app` |
| `AUTH_TRUST_HOST` | `true` (required by NextAuth v5 behind Zeabur proxy) |
| `FAMILY_PASSCODE` | `20260606` |

- **App** uses the **internal** DB host (`postgresql.zeabur.internal:5432`) — the public
  IP is NOT reachable from inside Zeabur.
- **Local migration/seed** uses the **public** host (`47.81.30.93:32606`).

## Architecture notes

- **Prisma 7** — `url` is NOT allowed in `schema.prisma`. Connection comes via the
  `PrismaPg` driver adapter in `src/lib/db.ts` (`previewFeatures = ["driverAdapters"]`).
- Pages that read the DB use `export const dynamic = "force-dynamic"`.
- YouTube thumbnails: always use `hqdefault.jpg` (not `maxresdefault.jpg` — often missing).
- Image proxy and `/family/*` are public routes (no Google login) — see `src/lib/auth.config.ts`.
- Google / Slack / Dropbox auth and the Baidu translation proxy were **removed** — the
  family site only needs the database. External article links go directly to the source
  with "阅读原文 →".
- Videos require a VPN in China (banner says 📺 观看视频需要翻墙). Bilibili re-uploads
  are a future option once videos are posted there.
