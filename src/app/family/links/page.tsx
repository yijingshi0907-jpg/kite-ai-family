import { getCachedPodcasts, refLinks } from "@/lib/family-fetcher";
import type { PodcastEpisode, RefLink } from "@/lib/family-fetcher";

function EpisodeCard({ ep }: { ep: PodcastEpisode }) {
  return (
    <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer"
      className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 group">
      <div className="relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ep.thumbnailUrl} alt={ep.titleZh} className="w-28 h-18 rounded-lg object-cover" style={{height:"4.5rem"}} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg group-hover:bg-black/30 transition-colors">
          <span className="text-white text-sm">▶</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-bold text-rose-400">第 {ep.episode} 集</span>
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mt-0.5">{ep.titleZh}</h3>
        <p className="text-xs text-gray-500 mt-1">{ep.guestZh} · {ep.guestOrgZh}</p>
        <span className="mt-1 inline-block text-xs text-rose-500 group-hover:underline">YouTube 收看 →</span>
      </div>
    </a>
  );
}

function LinkCard({ link }: { link: RefLink }) {
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer"
      className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 group">
      <span className="text-3xl flex-shrink-0">{link.icon}</span>
      <div>
        <p className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">{link.titleZh}</p>
        <p className="text-sm text-gray-500 mt-0.5">{link.descZh}</p>
        <p className="text-xs text-gray-400 mt-1 truncate">{link.url}</p>
      </div>
    </a>
  );
}

export default async function LinksPage() {
  const episodes = await getCachedPodcasts();

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">参考链接 &amp; 播客</h2>
        <p className="text-sm text-gray-500 mt-1">Kite AI 官方渠道、媒体资源，以及全部 {episodes.length} 集 AI on Air 播客</p>
      </div>

      <div className="mb-10">
        <h3 className="text-base font-semibold text-gray-700 mb-4">🔗 官方链接</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {refLinks.map((l) => <LinkCard key={l.id} link={l} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-700">🎙️ AI on Air 全集（{episodes.length} 集）</h3>
          <a href="https://gokite.ai/podcast" target="_blank" rel="noopener noreferrer"
            className="text-xs text-rose-500 hover:underline">官网查看 →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {episodes.map((ep) => <EpisodeCard key={ep.id} ep={ep} />)}
        </div>
      </div>
    </section>
  );
}
