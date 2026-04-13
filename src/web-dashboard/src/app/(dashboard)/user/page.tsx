import { Download, Music, Settings, Zap } from 'lucide-react';

export default function UserDashboard() {
  const stats = [
    { label: 'Assinatura', value: 'Plano Pulse Pro', icon: Settings, color: 'text-green-500' },
    { label: 'Próxima Renovação', value: '13/05/2026', icon: Zap, color: 'text-pulse-red' },
    { label: 'Última Sincronização', value: 'Há 2 dias', icon: Music, color: 'text-blue-500' },
    { label: 'Apps Instalados', value: '1/3', icon: Download, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border">
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={24} className={stat.color} />
              <span className="text-xs font-bold text-pulse-textSecondary uppercase tracking-widest">Portal do Cliente</span>
            </div>
            <p className="text-sm text-pulse-textSecondary mb-1 font-medium">{stat.label}</p>
            <h3 className="text-xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-pulse-surface p-8 rounded-3xl border border-pulse-border">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Download size={20} className="text-pulse-red" /> Central de Downloads
          </h3>
          <p className="text-pulse-textSecondary mb-8">
            Baixe o PulseDrive Desktop para manter seu pendrive atualizado automaticamente.
          </p>
          <div className="space-y-4">
            <button className="w-full flex justify-between items-center p-6 bg-pulse-dark rounded-2xl border border-pulse-border hover:border-pulse-red/50 transition-all">
              <div className="text-left">
                <p className="font-bold">PulseDrive para Windows</p>
                <p className="text-xs text-pulse-textSecondary">Versão 1.2.0 • 120MB</p>
              </div>
              <Download size={20} className="text-pulse-red" />
            </button>
            <button className="w-full flex justify-between items-center p-6 bg-pulse-dark rounded-2xl border border-pulse-border hover:border-pulse-red/50 transition-all opacity-50 cursor-not-allowed">
              <div className="text-left">
                <p className="font-bold">PulseDrive para macOS</p>
                <p className="text-xs text-pulse-textSecondary">Em breve</p>
              </div>
              <Download size={20} />
            </button>
          </div>
        </div>

        <div className="bg-pulse-surface p-8 rounded-3xl border border-pulse-border">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Music size={20} className="text-pulse-red" /> Meu Repertório Atual
          </h3>
          <div className="flex items-center gap-6 p-6 bg-pulse-dark rounded-2xl border border-pulse-border">
            <div className="w-24 h-24 bg-pulse-surface rounded-xl flex items-center justify-center text-pulse-red border border-pulse-border">
              <Music size={40} />
            </div>
            <div>
              <p className="text-lg font-bold">Atualização de Abril</p>
              <p className="text-sm text-pulse-textSecondary">Kel CDs • 128 músicas</p>
              <p className="text-xs text-green-500 font-bold uppercase mt-2">Assinatura Ativa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
