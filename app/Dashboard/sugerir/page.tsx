"use client";

import { useRouter } from "next/navigation";
import { SuggestionForm } from "@/features/suggestions/components/suggestion-form";

export default function SugerirLocalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <div className="max-w-2xl mx-auto py-12">
        <header className="mb-12">
          <button 
            onClick={() => router.back()}
            className="text-white/40 hover:text-white mb-6 transition-colors flex items-center gap-2"
          >
            ← Voltar
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Sugerir Novo Local 📍
          </h1>
          <p className="text-white/50 text-lg mt-2">
            Contribua com a comunidade e recomende seus lugares favoritos de BH.
          </p>
        </header>

        <SuggestionForm />

        <p className="text-center text-white/30 text-xs mt-8">
          Sua sugestão será revisada por nossos administradores antes de aparecer no feed.
        </p>
      </div>
    </div>
  );
}
