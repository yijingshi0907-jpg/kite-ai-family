import { getCachedWeeklyUpdates } from "@/lib/family-fetcher";
import type { XPost, WeeklyGroup } from "@/lib/family-fetcher";
import TwitterTimeline from "./TwitterTimeline";

function PostCard({ post }: { post: XPost }) {
  const d = new Date(post.date);
  const dateStr = `${d.getMonth() + 1}月${d.getDate()}日`;
  const isYouTube = post.url.includes("youtube.com") || post.url.includes("youtu.be");
  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer"
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group block">
      {post.mediaUrl && (
        <div className="relative w-full aspect-video bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.mediaUrl} alt={post.textZh} className="w-full h-full object-cover" />
          {isYouTube && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white text-sm ml-0.5">▶</span>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">𝕏</span>
          </div>
          <span className="text-xs text-gray-500 font-medium">@KiteAIChinese</span>
          <span className="text-xs text-gray-400 ml-auto">{dateStr}</span>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed">{post.textZh}</p>
        {post.likes && (
          <p className="text-xs text-gray-400 mt-2">❤ {post.likes.toLocaleString()}</p>
        )}
        <span className="mt-2 inline-block text-xs text-rose-500 group-hover:underline">
          {isYouTube ? "▶ 观看视频 →" : "在 X 查看 →"}
        </span>
      </div>
    </a>
  );
}

function WeekSection({ group }: { group: WeeklyGroup }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-sm font-semibold text-gray-600 whitespace-nowrap px-2">
          📅 {group.weekLabelZh}
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {group.posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}

export default async function WeeklyPage() {
  const groups = await getCachedWeeklyUpdates();

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">每周动态</h2>
        <p className="text-sm text-gray-500 mt-1">
          来自{" "}
          <a href="https://x.com/GoKiteAI" target="_blank" rel="noopener noreferrer"
            className="text-rose-500 hover:underline">@GoKiteAI</a>{" "}
          的社媒内容 · 实时动态 + 中文精选
        </p>
      </div>

      {/* Live Twitter timelines — shows ALL real posts with real images */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-gray-800">🔴 实时 X 动态</h3>
            <p className="text-xs text-gray-400 mt-0.5">完整推文 · 原图 · 实时更新</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">🌐 英文官方 @GoKiteAI</p>
              <a href="https://x.com/GoKiteAI" target="_blank" rel="noopener noreferrer"
                className="text-xs px-2 py-1 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors">
                去关注
              </a>
            </div>
            <TwitterTimeline account="GoKiteAI" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">🇨🇳 中文官方 @KiteAIChinese</p>
              <a href="https://x.com/KiteAIChinese" target="_blank" rel="noopener noreferrer"
                className="text-xs px-2 py-1 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors">
                去关注
              </a>
            </div>
            <TwitterTimeline account="KiteAIChinese" />
          </div>
        </div>
      </div>

      {/* Curated weekly highlights in Chinese */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gray-200" />
          <h3 className="text-base font-semibold text-gray-600 whitespace-nowrap px-2">📋 中文精选公告</h3>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <p className="text-xs text-gray-400 mb-6 text-center">以下为重要公告的中文摘要，按周整理，自 2025 年 6 月起</p>

        {groups.map((g) => <WeekSection key={g.weekOf} group={g} />)}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4 pb-4">
        实时动态来自 @GoKiteAI 官方 X 账号 · 中文摘要每周更新
      </p>
    </section>
  );
}
