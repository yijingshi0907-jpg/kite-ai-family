import { getCachedPressArticles, getCachedMediumArticles, companyIntro } from "@/lib/family-fetcher";
import type { PressArticle, MediumArticle } from "@/lib/family-fetcher";

function formatDateZh(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

const publisherColors: Record<string, string> = {
  Fortune: "text-blue-700",
  CoinDesk: "text-yellow-700",
  Cointelegraph: "text-green-700",
  BeInCrypto: "text-purple-700",
  "General Catalyst": "text-indigo-700",
  "Samsung Next": "text-cyan-700",
  "Dispersion Capital": "text-orange-700",
  "PayPal Ventures": "text-blue-600",
};

function translateUrl(url: string) {
  return `/api/translate-page?url=${encodeURIComponent(url)}`;
}

function PressCard({ article }: { article: PressArticle }) {
  const color = publisherColors[article.publisher] ?? "text-gray-600";
  return (
    <a href={translateUrl(article.url)} target="_blank" rel="noopener noreferrer"
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={article.imageUrl} alt={article.titleZh} className="w-full h-44 object-cover" />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <p className={`text-xs font-bold uppercase tracking-wide ${color}`}>{article.publisher}</p>
          <p className="text-xs text-gray-400">{formatDateZh(article.date)}</p>
        </div>
        <h2 className="text-sm font-bold text-gray-900 leading-snug mb-2">{article.titleZh}</h2>
        <p className="text-xs text-gray-500 leading-relaxed flex-1">{article.descZh}</p>
        <span className="mt-4 text-xs text-rose-500 font-medium group-hover:underline">🌐 阅读中文译文 →</span>
      </div>
    </a>
  );
}

function MediumCard({ article }: { article: MediumArticle }) {
  return (
    <a href={translateUrl(article.url)} target="_blank" rel="noopener noreferrer"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex gap-4 group items-start">
      <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">M</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-500">Medium · @KiteAI</span>
          <span className="text-xs text-gray-400">{formatDateZh(article.date)}</span>
        </div>
        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-rose-600 transition-colors">
          {article.titleZh}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2">{article.descZh}</p>
      </div>
    </a>
  );
}

export default async function CompanyPage() {
  const [press, medium] = await Promise.all([
    getCachedPressArticles(),
    getCachedMediumArticles(),
  ]);

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">公司媒体报道</h2>
        <p className="text-sm text-gray-500 mt-1">融资报道、投资人观点与官方博客，全部译为中文</p>
      </div>

      {/* Company intro */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">🪁</div>
          <div>
            <h3 className="text-lg font-bold">{companyIntro.nameZh}</h3>
            <p className="text-sm text-gray-300">{companyIntro.taglineZh}</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">{companyIntro.descZh}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {companyIntro.productsZh.map((p, i) => (
            <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-200">{p}</span>
          ))}
        </div>
        <div className="border-t border-white/10 pt-4">
          <p className="text-xs text-gray-400 mb-2">投资方</p>
          <div className="flex flex-wrap gap-2">
            {companyIntro.investors.map((inv) => (
              <span key={inv} className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300">{inv}</span>
            ))}
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <a href="https://gokite.ai/about-company" target="_blank" rel="noopener noreferrer"
            className="text-xs px-4 py-1.5 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            了解更多
          </a>
          <a href="https://gokite.ai" target="_blank" rel="noopener noreferrer"
            className="text-xs px-4 py-1.5 border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors">
            官网
          </a>
        </div>
      </div>

      {/* Press coverage */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">📰 主流媒体报道</h3>
          <a href="https://gokite.ai/media" target="_blank" rel="noopener noreferrer"
            className="text-xs text-rose-500 hover:underline">查看全部 →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {press.map((a) => <PressCard key={a.id} article={a} />)}
        </div>
      </div>

      {/* Medium blog */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">✍️ 官方博客（Medium）</h3>
          <a href="https://medium.com/@KiteAI" target="_blank" rel="noopener noreferrer"
            className="text-xs text-rose-500 hover:underline">全部文章 →</a>
        </div>
        <div className="flex flex-col gap-3">
          {medium.map((a) => <MediumCard key={a.id} article={a} />)}
        </div>
      </div>
    </section>
  );
}
