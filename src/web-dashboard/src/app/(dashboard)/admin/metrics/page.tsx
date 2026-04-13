"use client";

import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Music, 
  Zap, 
  Calendar, 
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useState } from 'react';

export default function AdminMetricsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const mainStats = [
    { label: 'Crescimento de Usuários', value: '+18.4%', trend: 'up', icon: Users },
    { label: 'Taxa de Retenção', value: '92.1%', trend: 'up', icon: Activity },
    { label: 'Conversão de Leads', value: '4.8%', trend: 'down', icon: TrendingDown },
    { label: 'Média de Playlists/User', value: '3.2', trend: 'up', icon: Music },
  ];

  const recentEvents = [
    { event: 'Pico de Acesso (Nordeste)', time: 'Há 2 horas', impact: 'Alto' },
    { event: 'Novo Revendedor Top Tier', time: 'Há 5 horas', impact: 'Médio' },
    { event: 'Sincronização em Lote', time: 'Há 12 horas', impact: 'Sistema' },
    { event: 'Recorde de Downloads (Diário)', time: 'Ontem', impact: 'Alto' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Métricas Globais Pulse</h1>
          <p className="text-pulse-textSecondary font-medium">Análise detalhada de crescimento e engajamento</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-pulse-surface border border-pulse-border p-1 rounded-xl flex gap-1">
            {['24h', '7d', '30d', '12m'].map((range) => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                  timeRange === range 
                    ? 'bg-pulse-red text-white shadow-lg' 
                    : 'text-pulse-textSecondary hover:text-pulse-textPrimary'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="bg-pulse-dark border border-pulse-border hover:bg-pulse-border transition-all px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
            <Download size={18} /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, idx) => (
          <div key={idx} className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border group hover:border-pulse-red/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-pulse-dark rounded-xl border border-pulse-border">
                <stat.icon size={20} className="text-pulse-textSecondary group-hover:text-pulse-red transition-colors" />
              </div>
              <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend === 'up' ? 'Crescendo' : 'Queda'}
              </span>
            </div>
            <p className="text-xs text-pulse-textSecondary font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-pulse-surface p-8 rounded-3xl border border-pulse-border">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
              <BarChart3 size={20} className="text-pulse-red" /> Performance de Volume (Downloads)
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pulse-red rounded-full"></div>
                <span className="text-[10px] font-bold text-pulse-textSecondary uppercase">HQ (320k)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pulse-border rounded-full"></div>
                <span className="text-[10px] font-bold text-pulse-textSecondary uppercase">Standard</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-3 px-4">
            {[45, 60, 40, 80, 55, 90, 70, 45, 65, 85, 100, 75].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col gap-1 items-center group">
                <div className="w-full relative">
                  <div 
                    className="w-full bg-pulse-border rounded-t-lg transition-all group-hover:bg-pulse-red/50" 
                    style={{ height: `${height * 0.8}%` }}
                  ></div>
                  <div 
                    className="w-full bg-pulse-red absolute bottom-0 left-0 rounded-t-lg shadow-[0_0_15px_rgba(255,59,59,0.3)] transition-all" 
                    style={{ height: `${height * 0.4}%` }}
                  ></div>
                </div>
                <span className="text-[8px] text-pulse-textSecondary font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] text-pulse-textSecondary font-bold uppercase tracking-[0.3em] mt-8">Ciclo Anual de Processamento</p>
        </div>

        <div className="bg-pulse-surface p-8 rounded-3xl border border-pulse-border">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2 uppercase tracking-tight">
            <Activity size={20} className="text-pulse-red" /> Atividade Recente
          </h3>
          <div className="space-y-6">
            {recentEvents.map((item, idx) => (
              <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:bg-pulse-red before:rounded-full after:absolute after:left-[2px] after:top-[60%] after:w-[2px] after:h-8 after:bg-pulse-border last:after:hidden transition-all hover:translate-x-1 group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-black text-pulse-textPrimary group-hover:text-pulse-red transition-colors">{item.event}</p>
                    <p className="text-[10px] text-pulse-textSecondary uppercase font-bold">{item.time}</p>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                    item.impact === 'Alto' ? 'text-pulse-red border-pulse-red/20 bg-pulse-red/5' : 'text-pulse-textSecondary border-pulse-border'
                  }`}>
                    {item.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-pulse-dark border border-pulse-border rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-pulse-border transition-all">
            Ver Log Completo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-pulse-surface p-8 rounded-3xl border border-pulse-border flex items-center gap-8">
          <div className="relative w-32 h-32 shrink-0">
             <div className="absolute inset-0 rounded-full border-[10px] border-pulse-border"></div>
             <div className="absolute inset-0 rounded-full border-[10px] border-pulse-red border-t-transparent border-l-transparent -rotate-45 shadow-[0_0_15px_rgba(255,59,59,0.2)]"></div>
             <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black">68%</span>
                <span className="text-[8px] font-bold text-pulse-textSecondary uppercase tracking-tighter">B2C</span>
             </div>
          </div>
          <div>
            <h4 className="text-lg font-black uppercase tracking-tight mb-2">Mix de Audiência</h4>
            <p className="text-sm text-pulse-textSecondary mb-4">A maioria dos usuários são motoristas finais (B2C), seguidos por profissionais de som.</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pulse-red rounded-full"></div>
                <span className="text-[10px] font-bold uppercase">Consumidor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pulse-border rounded-full"></div>
                <span className="text-[10px] font-bold uppercase">Profissional</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-pulse-surface p-8 rounded-3xl border border-pulse-border flex items-center gap-8">
           <div className="p-4 bg-pulse-red/10 rounded-3xl border border-pulse-red/20 text-pulse-red">
              <Zap size={48} className="animate-pulse" />
           </div>
           <div>
              <h4 className="text-lg font-black uppercase tracking-tight mb-2">Saúde do Crawler</h4>
              <p className="text-sm text-pulse-textSecondary mb-2">99.8% de sucesso nos downloads nas últimas 24h.</p>
              <div className="w-full bg-pulse-dark h-2 rounded-full overflow-hidden border border-pulse-border">
                <div className="bg-green-500 h-full w-[99.8%]"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
