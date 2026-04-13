"use client";

import { Zap, Play, Square, RefreshCcw, Database, AlertTriangle, CheckCircle2, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { engineService } from '@/services/api';

export default function EnginePage() {
  const [status, setStatus] = useState<'online' | 'offline' | 'error'>('online');
  const [logs, setLogs] = useState([
    { id: 1, time: '14:32:01', msg: 'Buscando novos CDs em SuaMusica...', type: 'info' },
    { id: 2, time: '14:32:05', msg: 'DJ Kel CDS Vol. 45 - 2 novas músicas encontradas.', type: 'success' },
    { id: 3, time: '14:32:10', msg: 'Iniciando download: "Música do Paredão.mp3"', type: 'info' },
    { id: 4, time: '14:32:15', msg: 'Download concluído. Aplicando tags ID3...', type: 'info' },
    { id: 5, time: '14:32:20', msg: 'Sincronização finalizada para perfil: Paredão Pro.', type: 'success' },
  ]);

  const stats = [
    { label: 'Uptime', value: '14 dias 4h', icon: RefreshCcw },
    { label: 'Banco de Dados', value: '4.2GB', icon: Database },
    { label: 'Erros (24h)', value: '0', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Motor Crawler Pulse</h1>
          <p className="text-pulse-textSecondary font-medium">Monitoramento em tempo real do processamento de áudio</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-pulse-surface border border-pulse-border hover:bg-pulse-border transition-all px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 uppercase tracking-widest">
            <Square size={18} className="fill-current" /> Parar Motor
          </button>
          <button className="bg-pulse-red hover:bg-red-500 transition-all px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(255,59,59,0.3)] uppercase tracking-widest">
            <Play size={18} className="fill-current" /> Reiniciar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border">
            <div className="flex items-center gap-3 text-pulse-textSecondary mb-4">
              <stat.icon size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
            </div>
            <h3 className="text-2xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-pulse-dark rounded-3xl border border-pulse-border overflow-hidden">
          <div className="bg-pulse-surface px-6 py-4 border-b border-pulse-border flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Terminal size={18} className="text-pulse-red" /> Log do Sistema
            </h3>
            <span className="text-[10px] text-pulse-textSecondary font-mono">Real-time Feed</span>
          </div>
          <div className="p-6 font-mono text-xs space-y-3 h-[400px] overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 border-l-2 border-pulse-border pl-4 hover:border-pulse-red transition-colors">
                <span className="text-pulse-textSecondary shrink-0">{log.time}</span>
                <span className={log.type === 'success' ? 'text-green-500' : 'text-pulse-textPrimary'}>
                  {log.type === 'success' && '✓ '}
                  {log.msg}
                </span>
              </div>
            ))}
            <div className="animate-pulse flex gap-4 pl-4">
              <span className="text-pulse-red">_</span>
              <span className="text-pulse-textSecondary">Aguardando novos eventos...</span>
            </div>
          </div>
        </div>

        <div className="bg-pulse-surface p-8 rounded-3xl border border-pulse-border space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest">Configurações Ativas</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-pulse-dark rounded-2xl border border-pulse-border">
              <p className="text-[10px] text-pulse-textSecondary font-bold uppercase mb-1">Intervalo de Busca</p>
              <p className="text-sm font-black">12 horas</p>
            </div>
            <div className="p-4 bg-pulse-dark rounded-2xl border border-pulse-border">
              <p className="text-[10px] text-pulse-textSecondary font-bold uppercase mb-1">Qualidade do Áudio</p>
              <p className="text-sm font-black text-pulse-red">320kbps (HQ)</p>
            </div>
            <div className="p-4 bg-pulse-dark rounded-2xl border border-pulse-border">
              <p className="text-[10px] text-pulse-textSecondary font-bold uppercase mb-1">Normalização</p>
              <p className="text-sm font-black text-green-500">Ativa (Loudness-match)</p>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-4 rounded-2xl border border-green-500/20">
              <CheckCircle2 size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Todos os sistemas operacionais</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
