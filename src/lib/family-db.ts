import { db } from "./db";

function proxyImg(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

function ytProxy(youtubeId: string): string {
  return proxyImg(`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`)!;
}

// ── Weekly posts ─────────────────────────────────────────────────────────────

export interface XPost {
  id: string;
  date: string;
  textZh: string;
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
