"use client";

import { useEffect, useState } from 'react';
import { Zap, Users, TrendingUp, Music, Loader2 } from 'lucide-react';
import { profileService, engineService } from '../../../services/api';

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [engineStatus, setEngineStatus] = useState('offline');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profilesData, health] = await Promise.all([
        profileService.list(),
        engineService.getHealth()
      ]);
      setProfiles(profilesData);
      setEngineStatus(health.status === 'ok' ? 'online' : 'error');
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoUpdate = async (profileId: string, currentState: boolean) => {
    try {
      await profileService.update(profileId, { auto_update: !currentState });
      // Atualiza localmente para feedback instantâneo
      setProfiles(prev => prev.map(p => 
        p.id === profileId ? { ...p, auto_update: !currentState } : p
      ));
    } catch (err) {
      alert("Erro ao atualizar piloto automático.");
    }
  };

  const stats = [
    { label: 'Assinantes Ativos', value: '1.284', icon: Users, color: 'text-blue-500' },
    { label: 'Revendedores', value: '56', icon: Music, color: 'text-purple-500' },
    { label: 'Receita Mensal', value: 'R$ 42.500', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Músicas Processadas', value: '12.450', icon: Zap, color: 'text-pulse-red' },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-pulse-red" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border">
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={24} className={stat.color} />
              <span className="text-xs font-bold text-pulse-textSecondary uppercase tracking-widest">Global</span>
            </div>
            <p className="text-sm text-pulse-textSecondary mb-1 font-medium">{stat.label}</p>
            <h3 className="text-3xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-pulse-surface p-8 rounded-3xl border border-pulse-border">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Zap size={20} className="text-pulse-red" /> Status do Motor Crawler
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-pulse-dark rounded-2xl border border-pulse-border">
              <span className="text-sm font-bold">Status da API</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                engineStatus === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {engineStatus === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="p-4 bg-pulse-dark rounded-2xl border border-pulse-border opacity-50">
              <p className="text-xs text-pulse-textSecondary uppercase mb-2 font-bold">Dica</p>
              <p className="text-sm">O motor realiza buscas automáticas a cada 12h nos perfis ativos abaixo.</p>
            </div>
          </div>
        </div>

        <div className="bg-pulse-surface p-8 rounded-3xl border border-pulse-border">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Music size={20} className="text-pulse-red" /> Gestão de Perfis (Auto-Update)
          </h3>
          <div className="space-y-4">
            {profiles.length === 0 ? (
              <p className="text-sm text-pulse-textSecondary text-center py-4">Nenhum perfil cadastrado no banco.</p>
            ) : (
              profiles.map((profile) => (
                <div key={profile.id} className="flex justify-between items-center p-4 bg-pulse-dark rounded-2xl border border-pulse-border">
                  <div>
                    <p className="text-sm font-bold">{profile.name}</p>
                    <p className="text-[10px] text-pulse-textSecondary uppercase tracking-tighter">{profile.source_type} • {profile.target_dir}</p>
                  </div>
                  <button 
                    onClick={() => toggleAutoUpdate(profile.id, profile.auto_update)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      profile.auto_update 
                        ? 'bg-pulse-red text-white shadow-[0_0_10px_rgba(255,59,59,0.3)]' 
                        : 'bg-pulse-surface text-pulse-textSecondary border border-pulse-border'
                    }`}
                  >
                    {profile.auto_update ? 'PILOTO ATIVO' : 'LIGAR PILOTO'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
