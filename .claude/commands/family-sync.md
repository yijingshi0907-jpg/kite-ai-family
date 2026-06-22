# /family-sync — Chi 家庭站 内容同步 & 部署

Use this skill to add new weekly content, re-seed the database, and deploy to Vercel.

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
- `mediaUrl` — YouTube thumbnail URL if video (use maxresdefault.jpg format)
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

If the Prisma schema was changed:
```bash
DATABASE_URL="postgresql://neondb_owner:npg_fZm6TNYDFCg3@ep-wild-fog-atjnpxfs-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" npx prisma db push
npx prisma generate
```

---

## Step 4 — Re-seed the database

```bash
DATABASE_URL="postgresql://neondb_owner:npg_fZm6TNYDFCg3@ep-wild-fog-atjnpxfs-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" node prisma/seed-family.mjs
```

Confirm output shows the expected counts (weekly posts, interviews, news, podcasts, ref links).

---

## Step 5 — Commit and deploy

```bash
git add prisma/seed-family.mjs
git commit -m "content: weekly sync YYYY-MM-DD — add N new posts"
git push origin main
npx vercel deploy --prod --yes
```

Wait for "Aliased → kite-ai-family.vercel.app" in the output.

---

## Step 6 — Verify

Open https://kite-ai-family.vercel.app/family/weekly and confirm:
- New week section appears at top
- Summaries show correctly
- Thumbnails load for video cards

---

## Key files

| File | Purpose |
|------|---------|
| `prisma/seed-family.mjs` | All content data — edit this for updates |
| `prisma/schema.prisma` | DB schema — edit if adding new fields |
| `src/lib/family-db.ts` | DB query functions + interfaces |
| `src/app/family/weekly/page.tsx` | Weekly posts page |
| `src/app/family/personal/page.tsx` | Chi's interviews + news |
| `src/app/family/company/page.tsx` | Press + Medium articles |
| `src/app/family/links/page.tsx` | Podcasts + ref links |
| `src/app/api/translate-page/route.ts` | Baidu translation proxy |
| `src/app/api/image-proxy/route.ts` | YouTube thumbnail proxy |

## Environment variables (Vercel production)

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `BAIDU_APP_ID` | `20260622002635864` |
| `BAIDU_SECRET` | `pnxaDwi85aQpAiAs_edD` |
| `NEXTAUTH_SECRET` | (set in Vercel) |
| `GOOGLE_CLIENT_ID` | (set in Vercel) |
| `GOOGLE_CLIENT_SECRET` | (set in Vercel) |

## Notes

- YouTube thumbnails: always use `hqdefault.jpg` (not `maxresdefault.jpg` — often missing)
- Weekly posts page is `force-dynamic` — always fetches fresh data from DB
- Image proxy is public (no auth required)
- Translation proxy uses Baidu API (5M chars/month free tier)
- Binance Square and X.com posts cannot be auto-translated (JS-rendered, bot-protected)
