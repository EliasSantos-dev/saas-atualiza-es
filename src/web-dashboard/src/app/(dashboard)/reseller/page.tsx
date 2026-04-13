import { TrendingUp, Users, Link as LinkIcon, Wallet } from 'lucide-react';

export default function ResellerDashboard() {
  const stats = [
    { label: 'Assinaturas Ativas', value: '142', icon: Users, color: 'text-blue-500' },
    { label: 'Vendas (30 dias)', value: '28', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Comissão Acumulada', value: 'R$ 2.840', icon: Wallet, color: 'text-yellow-500' },
    { label: 'Link de Vendas', value: 'pulsedrive.com/dj-teste', icon: LinkIcon, color: 'text-pulse-red' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border">
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={24} className={stat.color} />
              <span className="text-xs font-bold text-pulse-textSecondary uppercase tracking-widest">Resumo</span>
            </div>
            <p className="text-sm text-pulse-textSecondary mb-1 font-medium">{stat.label}</p>
            <h3 className={`text-2xl font-black ${stat.label === 'Link de Vendas' ? 'text-sm break-all font-mono' : 'text-3xl'}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-pulse-surface p-8 rounded-3xl border border-pulse-border">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-pulse-red" /> Histórico de Vendas Recentes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-pulse-textSecondary border-b border-pulse-border">
              <tr>
                <th className="pb-4 font-bold uppercase tracking-widest text-xs">Cliente</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-xs">Data</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-xs">Plano</th>
                <th className="pb-4 font-bold uppercase tracking-widest text-xs text-right">Comissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pulse-border">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 font-medium">João Silva (joao***@email.com)</td>
                  <td className="py-4 text-pulse-textSecondary">13/04/2026</td>
                  <td className="py-4">Mensal Pulse</td>
                  <td className="py-4 text-right font-black text-green-500">R$ 40,00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
