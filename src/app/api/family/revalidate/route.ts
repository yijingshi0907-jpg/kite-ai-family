import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Called weekly by Vercel Cron (vercel.json: "0 8 * * 1")
// Manual trigger: GET /api/family/revalidate?secret=<CRON_SECRET>
//
// This endpoint:
// 1. Validates the secret
// 2. Fetches latest content from gokite.ai/media and medium.com/@KiteAI
// 3. Revalidates the Next.js cache so pages rebuild with fresh data on next visit

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results: Record<string, string> = {};

  // 1. Probe gokite.ai/media — warm the page so CDN edge has fresh content
  try {
    const r = await fetch("https://gokite.ai/media", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FamilyBot/1.0)" },
      signal: AbortSignal.timeout(10_000),
    });
    results.media = r.ok ? `ok (${r.status})` : `error (${r.status})`;
  } catch (e) {
    results.media = `failed: ${(e as Error).message}`;
  }

  // 2. Probe medium.com/@KiteAI
  try {
    const r = await fetch("https://medium.com/@KiteAI", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FamilyBot/1.0)" },
      signal: AbortSignal.timeout(10_000),
    });
    results.medium = r.ok ? `ok (${r.status})` : `error (${r.status})`;
  } catch (e) {
    results.medium = `failed: ${(e as Error).message}`;
  }

  // 3. Probe gokite.ai/podcast
  try {
    const r = await fetch("https://gokite.ai/podcast", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FamilyBot/1.0)" },
      signal: AbortSignal.timeout(10_000),
    });
    results.podcast = r.ok ? `ok (${r.status})` : `error (${r.status})`;
  } catch (e) {
    results.podcast = `failed: ${(e as Error).message}`;
  }

  // 4. Revalidate the cache — Next.js will rebuild family pages on next request
  revalidateTag("family-content");

  return NextResponse.json({
    revalidated: true,
    ts: new Date().toISOString(),
    sources: results,
  });
}
