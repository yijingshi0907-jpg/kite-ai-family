import { getWeeklyUpdates } from "@/lib/family-db";
import type { XPost, WeeklyGroup } from "@/lib/family-db";
import TwitterTimeline from "./TwitterTimeline";

function PostCard({ post }: { post: XPost }) {
  const d = new Date(post.date);
  const dateStr = `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
  const isYouTube = post.url.includes("youtube.com") || post.url.includes("youtu.be");

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* YouTube thumbnail */}
      {post.mediaUrl && isYouTube && (
        <a href={post.url} target="_blank" rel="noopener noreferrer" className="block relative w-full aspect-video bg-gray-100 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white text-sm ml-0.5">▶</span>
            </div>
          </div>
        </a>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">𝕏</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800">@KiteAIChinese</p>
            <p className="text-xs text-gray-400">{dateStr}</p>
          </div>
          {post.likes && (
            <span className="ml-auto text-xs text-gray-400">❤ {post.likes.toLocaleString()}</span>
          )}
        </div>

        {/* Summary (or full text as fallback) */}
        <p className="text-sm text-gray-800 leading-relaxed">{post.summaryZh ?? post.textZh}</p>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-3">
          {isYouTube ? (
            <a href={post.url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-red-500 hover:underline">▶ 观看视频</a>
          ) : (
            <a href={post.url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:underline">在 X 查看原文</a>
          )}
        </div>
      </div>
    </div>
  );
}

function WeekSection({ group }: { group: WeeklyGroup }) {
  return (
    <div className="mb-10">
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
  const groups = await getWeeklyUpdates();

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">每周动态</h2>
        <p className="text-sm text-gray-500 mt-1">
          来自{" "}
          <a href="https://x.com/KiteAIChinese" target="_blank" rel="noopener noreferrer"
            className="text-rose-500 hover:underline">@KiteAIChinese</a>{" "}
          的中文精选公告 · 按周整理
        </p>
      </div>

      {/* Live Twitter timelines */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-gray-800">🔴 实时 X 动态</h3>
            <p className="text-xs text-gray-400 mt-0.5">完整推文 · 原图 · 实时更新（需翻墙）</p>
          </div>
          <a href="https://x.com/KiteAIChinese" target="_blank" rel="noopener noreferrer"
            className="text-xs px-2 py-1 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors">
            去关注
          </a>
        </div>
        <TwitterTimeline account="KiteAIChinese" />
      </div>

      {/* Chinese curated posts from DB */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gray-200" />
          <h3 className="text-base font-semibold text-gray-600 whitespace-nowrap px-2">📋 中文公告精选</h3>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <p className="text-xs text-gray-400 mb-6 text-center">
          @KiteAIChinese 重要公告中文全文 · 按周整理 · 无需访问 X.com
        </p>
        {groups.map((g) => <WeekSection key={g.weekOf} group={g} />)}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4 pb-4">
        内容来自 @KiteAIChinese 官方 X 账号 · 中文摘要每周更新
      </p>
    </section>
  );
}
