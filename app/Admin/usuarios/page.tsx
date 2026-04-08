export default function UsuariosPage() {
  const usuarios = [
    { id: 1, nome: "Marco Silva", email: "marco.silva@email.com", papel: "COMUM", desde: "Jan 2024" },
    { id: 2, nome: "Ana Claudia", email: "ana.claudia@email.com", papel: "PROPRIETARIO", desde: "Fev 2024" },
    { id: 3, nome: "Admin Master", email: "admin@uaibora.com", papel: "ADMIN", desde: "Dez 2023" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h2>
          <p className="text-white/30 text-base mt-1">Gerencie permissões e visualize a base de usuários.</p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 px-5 py-2 rounded-xl text-orange-500 text-sm font-bold shadow-lg shadow-orange-500/5">
          {usuarios.length} usuários
        </div>
      </div>

      <div className="overflow-hidden border border-white/5 rounded-3xl bg-[#1c1917] shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              <th className="px-8 py-5">Usuário</th>
              <th className="px-8 py-5">Papel</th>
              <th className="px-8 py-5">Membro desde</th>
              <th className="px-8 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <p className="font-bold text-white/80 group-hover:text-white transition-colors">{u.nome}</p>
                  <p className="text-xs text-white/20">{u.email}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    u.papel === 'ADMIN' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-500/5' :
                    u.papel === 'PROPRIETARIO' ? 'bg-amber-600/10 text-amber-500 border border-amber-500/20' :
                    'bg-white/5 text-white/40 border border-white/10'
                  }`}>
                    {u.papel}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-white/30 font-medium">{u.desde}</td>
                <td className="px-8 py-6 text-right">
                  <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-orange-500 transition-all">
                    Configurar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
