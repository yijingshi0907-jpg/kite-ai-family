import { getInterviews, getNewsArticles, getPodcasts } from "@/lib/family-db";
import type { PersonalUpdate, PersonalNewsArticle, PodcastEpisode } from "@/lib/family-db";

function formatDateZh(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

function InterviewCard({ post }: { post: PersonalUpdate }) {
  const href = post.sourceUrl ?? "#";
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group">
      <div className="relative w-full aspect-video bg-gray-100">
        {post.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.imageUrl} alt={post.titleZh} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
            <span className="text-white text-xl ml-1">▶</span>
          </div>
        </div>
        {post.type === "interview" && (
          <span className="absolute top-3 left-3 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
            专访
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-rose-400 font-medium mb-1.5">{formatDateZh(post.date)}</p>
        <h2 className="text-sm font-bold text-gray-900 leading-snug flex-1">{post.titleZh}</h2>
        <p className="text-xs text-gray-500 leading-relaxed mt-2 line-clamp-3">{post.bodyZh}</p>
        <span className="mt-3 text-xs text-red-500 font-medium group-hover:underline">
          {post.youtubeId ? "▶ 在 YouTube 观看" : "查看详情 →"}
        </span>
      </div>
    </a>
  );
}

function translateUrl(url: string) {
  return `/api/translate-page?url=${encodeURIComponent(url)}`;
}

function NewsCard({ article }: { article: PersonalNewsArticle }) {
  const hasChineseTitle = article.titleZh && article.titleZh !== article.titleEn;
  const hasChineseDesc = article.descZh && !article.descZh.startsWith("（自动获取）");
  return (
    <a href={translateUrl(article.url)} target="_blank" rel="noopener noreferrer"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col group">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs font-bold text-rose-500 uppercase tracking-wide">{article.publisher}</span>
        <span className="text-gray-300">·</span>
        <span className="text-xs text-gray-400">{formatDateZh(article.date)}</span>
        {!hasChineseTitle && (
          <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">英文原文</span>
        )}
      </div>
      {hasChineseTitle ? (
        <>
          <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-rose-600 transition-colors">
            {article.titleZh}
          </h3>
          <p className="text-xs text-gray-400 mt-1 leading-snug line-clamp-2 italic">{article.titleEn}</p>
        </>
      ) : (
        <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-rose-600 transition-colors">
          {article.titleEn}
        </h3>
      )}
      {hasChineseDesc && (
        <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-3">{article.descZh}</p>
      )}
      <span className="mt-3 text-xs text-rose-500 group-hover:underline">🌐 阅读中文译文 →</span>
    </a>
  );
}

function PodcastCard({ ep }: { ep: PodcastEpisode }) {
  return (
    <a key={ep.id} href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer"
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group">
      <div className="relative w-full aspect-video bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ep.thumbnailUrl} alt={ep.titleZh} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white text-sm ml-0.5">▶</span>
          </div>
        </div>
        <span className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          第 {ep.episode} 集
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">{ep.titleZh}</h3>
        <p className="text-xs text-gray-500">嘉宾：{ep.guestZh}</p>
        <p className="text-xs text-gray-400 mt-0.5">{ep.guestOrgZh}</p>
        <span className="mt-3 text-xs text-red-500 group-hover:underline">▶ YouTube 观看</span>
      </div>
    </a>
  );
}

export default async function PersonalPage() {
  const [interviews, news, podcasts] = await Promise.all([
    getInterviews(),
    getNewsArticles(),
    getPodcasts(),
  ]);

  const interviewYtIds = new Set(interviews.map((u) => u.youtubeId).filter(Boolean));
  const remainingPodcasts = podcasts.filter((ep) => {
    const id = ep.youtubeUrl.match(/[?&]v=([^&]+)/)?.[1] ?? ep.youtubeUrl.split("/").pop() ?? "";
    return !interviewYtIds.has(id);
  });

  return (
    <section>
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex flex-col sm:flex-row gap-5 items-start">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-3xl flex-shrink-0">🌸</div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Chi Zhang（张弛）</h3>
          <p className="text-sm text-rose-500 font-medium mb-2">Kite AI 联合创始人 &amp; CEO</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            UC Berkeley PhD。正在构建 AI 代理经济时代的身份与支付基础设施——Kite AI。 接受多家中英文媒体专访，深度分享代理支付的愿景与实践。
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <a href="https://x.com/GoKiteAI" target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">𝕏 @GoKiteAI</a>
            <a href="https://www.youtube.com/@kiteai_official" target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">▶ YouTube</a>
            <a href="https://gokite.ai/podcast" target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">🎙 AI on Air</a>
          </div>
        </div>
      </div>

      {/* Interviews grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-900">Chi 的专访与对话</h2>
          <span className="text-xs text-gray-400">{interviews.length} 条</span>
        </div>
        <p className="text-sm text-gray-500 mb-5">中英文媒体专访、播客对话 · 最新在前</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviews.map((u) => <InterviewCard key={u.id} post={u} />)}
        </div>
      </div>

      {/* Written news about Chi */}
      {news.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-gray-900">Chi 的媒体报道</h2>
            <span className="text-xs text-gray-400">文章</span>
          </div>
          <p className="text-sm text-gray-500 mb-5">主流媒体对 Chi Zhang 的报道与人物专访</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((a) => <NewsCard key={a.id} article={a} />)}
          </div>
        </div>
      )}

      {/* Remaining AI on Air episodes */}
      {remainingPodcasts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-gray-900">AI on Air 全集</h2>
            <a href="https://gokite.ai/podcast" target="_blank" rel="noopener noreferrer"
              className="text-xs text-rose-500 hover:underline flex-shrink-0">官网收听 →</a>
          </div>
          <p className="text-sm text-gray-500 mb-5">
            Chi 主持的对话节目，嘉宾涵盖谷歌云、DeepMind、PayPal、Meta 等顶尖机构（共 {podcasts.length} 集）
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {remainingPodcasts.map((ep) => <PodcastCard key={ep.id} ep={ep} />)}
          </div>
        </div>
      )}
    </section>
  );
}
