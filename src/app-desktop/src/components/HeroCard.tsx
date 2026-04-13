import React from 'react';
import { Play, Music, HardDrive, RefreshCw } from 'lucide-react';

interface HeroCardProps {
  onSyncClick: () => void;
  isSyncing: boolean;
}

export const HeroCard: React.FC<HeroCardProps> = ({ onSyncClick, isSyncing }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-pulse-surface border border-pulse-border p-8">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-pulse-red rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest rounded-full bg-pulse-red/10 text-pulse-red border border-pulse-red/20">
          REPERTÓRIO OFICIAL
        </div>
        
        <h2 className="text-4xl font-extrabold mb-2 text-white">Atualização de Abril</h2>
        <p className="text-pulse-textSecondary text-lg mb-8 max-w-md">
          O som mais tocado nos paredões do Brasil agora no seu pendrive. Curadoria exclusiva Kel CDs.
        </p>

        <div className="flex gap-6 mb-8 text-sm text-pulse-textSecondary">
          <div className="flex items-center gap-2"><Music size={16} className="text-pulse-red"/> 128 Músicas</div>
          <div className="flex items-center gap-2"><HardDrive size={16} className="text-pulse-red"/> 1.2 GB</div>
          <div className="flex items-center gap-2"><Play size={16} className="text-pulse-red"/> 320kbps Normalizado</div>
        </div>

        <button 
          onClick={onSyncClick}
          disabled={isSyncing}
          className={`flex items-center gap-3 px-8 py-4 font-bold text-white rounded-xl transition-all shadow-[0_0_20px_rgba(255,59,59,0.3)]
            ${isSyncing 
              ? 'bg-pulse-border cursor-not-allowed shadow-none' 
              : 'bg-pulse-red hover:bg-red-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,59,59,0.5)]'
            }`}
        >
          <RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "SINCRONIZANDO..." : "ATUALIZAR MEU PENDRIVE"}
        </button>
      </div>
    </div>
  );
};
