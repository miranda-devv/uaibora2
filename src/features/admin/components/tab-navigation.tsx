"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { id: "solicitacoes", label: "Sugestões Pendentes", href: "/Admin/solicitacoes", emoji: "📋" },
  { id: "usuarios", label: "Usuários", href: "/Admin/usuarios", emoji: "👥" },
  { id: "metricas", label: "Relatórios & Métricas", href: "/Admin/metricas", emoji: "📈" },
];

export function TabNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-8 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-all duration-300 whitespace-nowrap text-sm font-medium ${
              isActive
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-white/20 hover:text-orange-400/60 hover:border-orange-500/20"
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
