import { db } from "./db";

function proxyImg(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

function ytProxy(youtubeId: string): string {
  // hqdefault always exists; maxresdefault is missing for some videos
  return proxyImg(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`)!;
}

// Self-hosted video URL on R2 (files named <youtube-id>.mp4). Falls back to
// undefined when VIDEO_BASE_URL is unset → UI keeps the original YouTube link.
function selfHostedVideo(youtubeId: string | null | undefined): string | undefined {
  const base = process.env.VIDEO_BASE_URL;
  if (!base || !youtubeId) return undefined;
  return `${base.replace(/\/$/, "")}/${youtubeId}.mp4`;
}

// ── Weekly posts ─────────────────────────────────────────────────────────────

export interface XPost {
  id: string;
  date: string;
  textZh: string;
  summaryZh?: string;
  url: string;
  mediaUrl?: string;
  likes?: number;
}

export interface WeeklyGroup {
  weekOf: string;
  weekLabelZh: string;
  posts: XPost[];
}

export async function getWeeklyUpdates(): Promise<WeeklyGroup[]> {
  const rows = await db.familyWeeklyPost.findMany({ orderBy: { sortOrder: "asc" } });
  const map = new Map<string, WeeklyGroup>();
  for (const r of rows) {
    if (!map.has(r.weekOf)) {
      map.set(r.weekOf, { weekOf: r.weekOf, weekLabelZh: r.weekLabel, posts: [] });
    }
    map.get(r.weekOf)!.posts.push({
      id: r.id,
      date: r.date,
      textZh: r.textZh,
      summaryZh: r.summaryZh ?? undefined,
      url: r.url,
      mediaUrl: r.mediaUrl ? proxyImg(r.mediaUrl) : undefined,
      likes: r.likes ?? undefined,
    });
  }
  return Array.from(map.values());
}

// ── Interviews ────────────────────────────────────────────────────────────────

export interface PersonalUpdate {
  id: string;
  date: string;
  titleZh: string;
  bodyZh: string;
  type: string;
  youtubeId?: string;
  imageUrl?: string;
  sourceUrl?: string;
  videoUrl?: string;
}

export async function getInterviews(): Promise<PersonalUpdate[]> {
  const rows = await db.familyInterview.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    titleZh: r.titleZh,
    bodyZh: r.bodyZh,
    type: r.type,
    youtubeId: r.youtubeId ?? undefined,
    imageUrl: r.youtubeId ? ytProxy(r.youtubeId) : (r.imageUrl ? proxyImg(r.imageUrl) : undefined),
    sourceUrl: r.sourceUrl ?? undefined,
    videoUrl: selfHostedVideo(r.youtubeId),
  }));
}

// ── News articles ─────────────────────────────────────────────────────────────

export interface PersonalNewsArticle {
  id: string;
  date: string;
  titleZh?: string;
  titleEn: string;
  descZh?: string;
  publisher: string;
  url: string;
}

export async function getNewsArticles(): Promise<PersonalNewsArticle[]> {
  const rows = await db.familyNewsArticle.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    titleZh: r.titleZh ?? undefined,
    titleEn: r.titleEn,
    descZh: r.descZh ?? undefined,
    publisher: r.publisher,
    url: r.url,
  }));
}

// ── Podcasts ──────────────────────────────────────────────────────────────────

export interface PodcastEpisode {
  id: string;
  episode: number;
  titleZh: string;
  guestZh: string;
  guestOrgZh: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  videoUrl?: string;
}

export async function getPodcasts(): Promise<PodcastEpisode[]> {
  const rows = await db.familyPodcast.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((r) => {
    const ytId = r.youtubeUrl.match(/[?&]v=([^&]+)/)?.[1] ?? r.youtubeUrl.split("/").pop() ?? "";
    return {
      id: r.id,
      episode: r.episode,
      titleZh: r.titleZh,
      guestZh: r.guestZh,
      guestOrgZh: r.guestOrgZh,
      youtubeUrl: r.youtubeUrl,
      thumbnailUrl: ytProxy(ytId),
      videoUrl: selfHostedVideo(ytId),
    };
  });
}

// ── Ref links ─────────────────────────────────────────────────────────────────

export interface RefLink {
  id: string;
  icon: string;
  titleZh: string;
  descZh: string;
  url: string;
}

export async function getRefLinks(): Promise<RefLink[]> {
  const rows = await db.familyRefLink.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    icon: r.icon,
    titleZh: r.titleZh,
    descZh: r.descZh,
    url: r.url,
  }));
}
