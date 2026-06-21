"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/family/personal", label: "🌸 Chi 个人动态" },
  { href: "/family/company", label: "📰 公司媒体报道" },
  { href: "/family/weekly", label: "📅 每周动态" },
  { href: "/family/links", label: "🔗 参考链接" },
];

export default function FamilyNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto">
      {tabs.map((t) => {
        const active = path.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              active
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
