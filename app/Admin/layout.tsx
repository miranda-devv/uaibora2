import { TabNavigation } from "@/features/admin/components/tab-navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0908] text-white flex flex-col">
      {/* Header Admin */}
      <header className="border-b border-orange-500/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              UaiBora Admin 🛡️
            </h1>
            <div className="h-6 w-[1px] bg-white/10 ml-2" />
            <span className="text-xs font-medium text-white/30 uppercase tracking-widest mt-1">
              Control Panel
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Administrador</p>
              <p className="text-[10px] text-orange-500/60 font-semibold uppercase tracking-tighter">Status: Online</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/10">
              A
            </div>
          </div>
        </div>
        
        {/* Tab Navigation (Rotas Físicas) */}
        <div className="max-w-7xl mx-auto px-6">
          <TabNavigation />
        </div>
      </header>

      {/* Conteúdo das Abas */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {children}
      </main>

      {/* Footer Minimalista */}
      <footer className="py-6 border-t border-white/5 text-center text-white/20 text-xs">
        &copy; 2024 UaiBora Admin &bull; Sistema de Curadoria
      </footer>
    </div>
  );
}
