import React, { useState, useEffect } from 'react';
import { HeroCard } from './HeroCard';
import { ActivityFeed } from './ActivityFeed';
import { SyncModal } from './SyncModal';

interface DashboardProps {
  onUsbChange: (connected: boolean, status: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onUsbChange }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [drives, setDrives] = useState<any[]>([]);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        // @ts-ignore
        const availableDrives = await window.ipcRenderer.invoke('list-drives');
        setDrives(availableDrives || []);
        
        if (availableDrives && availableDrives.length > 0) {
          const drivePath = availableDrives[0].mountpoints[0]?.path || 'Desconhecido';
          onUsbChange(true, `USB Detectado: [${drivePath}]`);
        } else {
          onUsbChange(false, 'Aguardando Pendrive USB...');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDrives();
    const interval = setInterval(fetchDrives, 5000);
    return () => clearInterval(interval);
  }, [onUsbChange]);

  const handleStartSync = () => {
    if (drives.length === 0) {
      alert('Por favor, conecte um pendrive USB primeiro.');
      return;
    }
    setShowSyncModal(true);
  };

  return (
    <div className="h-full p-6 lg:p-8 max-w-7xl mx-auto flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <HeroCard onSyncClick={handleStartSync} isSyncing={isSyncing} />
          
          <div className="flex-1 bg-pulse-surface rounded-2xl border border-pulse-border p-6 flex items-center justify-center text-pulse-textSecondary">
            <p className="text-sm">Os gráficos de desempenho do seu plano aparecerão aqui.</p>
          </div>
        </div>
        
        <div className="lg:col-span-1 h-full">
          <ActivityFeed />
        </div>
      </div>

      {showSyncModal && (
        <SyncModal 
          drive={drives[0]} 
          onClose={() => setShowSyncModal(false)} 
          onSyncStateChange={setIsSyncing}
        />
      )}
    </div>
  );
};
