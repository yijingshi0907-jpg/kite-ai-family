import type { ReactNode } from "react";
import FamilyNav from "./FamilyNav";

export const metadata = {
  title: "Chi 家庭动态站",
  description: "Chi 的个人与公司最新资讯，专为家人打造",
};

export default function FamilyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-3 border-b border-gray-100">
            <span className="text-2xl">🌸</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">Chi 家庭动态站</h1>
              <p className="text-xs text-gray-400 mt-0.5">每周更新 · 仅供家人阅览</p>
            </div>
          </div>
          <FamilyNav />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-gray-400">
          内容每周自动更新 · 数据来源：
          <a href="https://gokite.ai/media" className="underline ml-1" target="_blank" rel="noopener noreferrer">gokite.ai/media</a>
          <span className="mx-1">·</span>
          <a href="https://gokite.ai/podcast" className="underline" target="_blank" rel="noopener noreferrer">gokite.ai/podcast</a>
          <span className="mx-1">·</span>
          <a href="https://x.com/GoKiteAI" className="underline" target="_blank" rel="noopener noreferrer">@GoKiteAI</a>
        </div>
      </footer>
    </div>
  );
}
