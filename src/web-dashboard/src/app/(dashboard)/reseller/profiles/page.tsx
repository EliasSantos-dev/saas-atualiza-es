"use client";

import { Music, Plus, Search, Filter, MoreVertical, ExternalLink, RefreshCw, Disc } from 'lucide-react';
import { useState } from 'react';

export default function ResellerProfilesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const profiles = [
    { id: 1, name: 'DJ Kel CDS Vol. 45', source: 'SuaMusica', type: 'Arrocha', updates: 'Diário', status: 'Ativo', songs: 156 },
    { id: 2, name: 'Paredão do Sul Set Mix', source: 'PalcoMP3', type: 'Forró', updates: 'Semanal', status: 'Ativo', songs: 89 },
    { id: 3, name: 'As Melhores de 2026', source: 'SuaMusica', type: 'Variado', updates: 'Diário', status: 'Ativo', songs: 210 },
    { id: 4, name: 'Equipe Graves Hits', source: 'SuaMusica', type: 'Eletro', updates: 'Mensal', status: 'Processando', songs: 45 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Meus Perfis de Curadoria</h1>
          <p className="text-pulse-textSecondary font-medium">Gerencie o conteúdo que seus clientes recebem</p>
        </div>
        <button className="bg-pulse-red hover:bg-red-500 transition-all px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(255,59,59,0.3)] uppercase tracking-widest">
          <Plus size={18} /> Novo Perfil
        </button>
      </div>

      <div className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pulse-textSecondary group-focus-within:text-pulse-red transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar perfis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-pulse-dark border border-pulse-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-pulse-red transition-all"
            />
          </div>
          <button className="bg-pulse-dark border border-pulse-border px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-pulse-border transition-colors">
            <Filter size={18} /> Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-pulse-dark p-6 rounded-3xl border border-pulse-border group hover:border-pulse-red/50 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-pulse-red/10 flex items-center justify-center text-pulse-red border border-pulse-red/20 group-hover:scale-110 transition-transform">
                  <Music size={24} />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-pulse-surface rounded-lg transition-colors text-pulse-textSecondary">
                    <RefreshCw size={18} />
                  </button>
                  <button className="p-2 hover:bg-pulse-surface rounded-lg transition-colors text-pulse-textSecondary">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-lg font-black uppercase tracking-tight">{profile.name}</h3>
                <div className="flex items-center gap-2 text-xs text-pulse-textSecondary font-bold">
                  <span className="text-pulse-red">{profile.source}</span>
                  <span>•</span>
                  <span>{profile.type}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-pulse-surface/50 p-3 rounded-2xl border border-pulse-border/50">
                  <p className="text-[9px] text-pulse-textSecondary font-black uppercase tracking-widest mb-1">Músicas</p>
                  <p className="text-sm font-black">{profile.songs}</p>
                </div>
                <div className="bg-pulse-surface/50 p-3 rounded-2xl border border-pulse-border/50">
                  <p className="text-[9px] text-pulse-textSecondary font-black uppercase tracking-widest mb-1">Updates</p>
                  <p className="text-sm font-black">{profile.updates}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  profile.status === 'Ativo' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {profile.status}
                </span>
                <button className="flex items-center gap-2 text-xs font-black text-pulse-red hover:underline uppercase tracking-widest">
                  Ver Conteúdo <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* New Profile Card Action */}
          <button className="bg-pulse-dark/50 p-6 rounded-3xl border-2 border-dashed border-pulse-border hover:border-pulse-red hover:bg-pulse-red/5 transition-all group flex flex-col items-center justify-center text-pulse-textSecondary hover:text-pulse-red py-12">
            <div className="w-12 h-12 rounded-full bg-pulse-surface border border-pulse-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <p className="font-black uppercase tracking-widest text-xs">Adicionar Novo Perfil</p>
            <p className="text-[10px] mt-2 opacity-50">Sincronize novas fontes de música</p>
          </button>
        </div>
      </div>
    </div>
  );
}
