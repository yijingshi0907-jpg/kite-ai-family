import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const APP_ID = process.env.BAIDU_APP_ID!;
const SECRET = process.env.BAIDU_SECRET!;

function baiduSign(query: string, salt: number) {
  return crypto.createHash("md5").update(APP_ID + query + salt + SECRET).digest("hex");
}

async function translateChunk(text: string): Promise<string> {
  if (!text.trim()) return text;
  const salt = Math.floor(Math.random() * 1000000);
  const params = new URLSearchParams({
    q: text,
    from: "en",
    to: "zh",
    appid: APP_ID,
    salt: String(salt),
    sign: baiduSign(text, salt),
  });
  const res = await fetch(`https://fanyi-api.baidu.com/api/trans/vip/translate?${params}`);
  const data = await res.json();
  if (data.trans_result) {
    return data.trans_result.map((r: { dst: string }) => r.dst).join("\n");
  }
  return text;
}

async function translateAll(text: string): Promise<string> {
  const CHUNK = 1800;
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += CHUNK) {
    chunks.push(text.slice(i, i + CHUNK));
  }
  const results: string[] = [];
  for (const chunk of chunks) {
    results.push(await translateChunk(chunk));
    await new Promise((r) => setTimeout(r, 120)); // stay under 10 QPS
  }
  return results.join("\n");
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  let html: string;
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    html = await r.text();
  } catch {
    return new NextResponse("无法获取原文，请检查链接是否有效。", { status: 502 });
  }

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1].replace(/\s*[|\-–—].*$/, "").trim() : "";

  // Extract paragraphs from <p> tags (at least 40 chars)
  const paragraphs: string[] = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = pRegex.exec(html)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text.length >= 40) paragraphs.push(text);
  }

  if (paragraphs.length === 0) {
    return new NextResponse("无法提取文章内容，请直接访问原文。", { status: 422 });
  }

  const [translatedTitle, translatedBody] = await Promise.all([
    rawTitle ? translateChunk(rawTitle) : Promise.resolve(""),
    translateAll(paragraphs.join("\n\n")),
  ]);

  const bodyParagraphs = translatedBody
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => `<p>${p}</p>`)
    .join("\n");

  const page = `<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${translatedTitle || "中文翻译"}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, "PingFang SC", "Noto Sans SC", sans-serif;
      max-width: 740px;
      margin: 0 auto;
      padding: 24px 20px 60px;
      color: #1a1a1a;
      line-height: 1.9;
      background: #fafafa;
    }
    .badge {
      display: inline-block;
      background: #e11d48;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: .5px;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 12px;
    }
    h1 { font-size: 1.35rem; font-weight: 700; line-height: 1.4; margin-bottom: 8px; color: #111; }
    .source { font-size: 12px; color: #999; margin-bottom: 28px; }
    .source a { color: #e11d48; text-decoration: none; }
    p { margin-bottom: 1.1rem; font-size: 1rem; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #aaa; }
  </style>
</head>
<body>
  <div class="badge">机器翻译 · 百度</div>
  <h1>${translatedTitle || rawTitle}</h1>
  <p class="source">原文：<a href="${url}" target="_blank" rel="noopener">${url}</a></p>
  ${bodyParagraphs}
  <div class="footer">本页面由百度翻译 API 自动翻译，内容仅供参考，请以原文为准。</div>
</body>
</html>`;

  return new NextResponse(page, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
