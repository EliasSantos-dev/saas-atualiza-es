# PulseDrive Desktop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the new "Pulse Red Edition" user interface for the desktop application, including the Hybrid Dashboard and the Sync Flow.

**Architecture:** Electron for desktop APIs (USB detection, file system) communicating with a React frontend via IPC. The frontend will be styled using Tailwind CSS and Lucide React icons.

**Tech Stack:** React 18, Tailwind CSS v3, Electron, Vite, TypeScript.

---

### Task 1: Scaffolding the Application Layout

**Files:**
- Create: `src/app-desktop/src/components/Layout.tsx`
- Create: `src/app-desktop/src/components/Header.tsx`
- Create: `src/app-desktop/src/components/Footer.tsx`
- Modify: `src/app-desktop/src/App.tsx`

- [ ] **Step 1: Create the Header component**
```tsx
import React from 'react';
import { Disc, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-pulse-dark border-b border-pulse-border">
      <div className="flex items-center gap-3 text-pulse-red">
        <Disc size={28} className="animate-[spin_4s_linear_infinite]" />
        <h1 className="text-xl font-bold tracking-wider text-pulse-textPrimary">
          PULSE<span className="text-pulse-red">DRIVE</span>
        </h1>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-pulse-surface hover:bg-pulse-border transition-colors text-pulse-textPrimary">
        <User size={16} />
        Entrar
      </button>
    </header>
  );
};
```

- [ ] **Step 2: Create the Footer component**
```tsx
import React from 'react';
import { Usb, HardDrive } from 'lucide-react';

interface FooterProps {
  status: string;
  connected: boolean;
}

export const Footer: React.FC<FooterProps> = ({ status, connected }) => {
  return (
    <footer className="flex items-center justify-between px-6 py-3 bg-pulse-dark border-t border-pulse-border text-xs text-pulse-textSecondary">
      <div className="flex items-center gap-2">
        <Usb size={14} className={connected ? "text-pulse-red" : "text-pulse-textSecondary"} />
        <span>{status}</span>
      </div>
      <div className="flex items-center gap-2">
        <HardDrive size={14} />
        <span>SaaS Pendrive Engine v1.0</span>
      </div>
    </footer>
  );
};
```

- [ ] **Step 3: Create the Layout wrapper**
```tsx
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  usbStatus: string;
  usbConnected: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, usbStatus, usbConnected }) => {
  return (
    <div className="flex flex-col h-screen bg-pulse-dark text-pulse-textPrimary overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Footer status={usbStatus} connected={usbConnected} />
    </div>
  );
};
```

- [ ] **Step 4: Update App.tsx to use Layout**
```tsx
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';

function App() {
  const [usbStatus, setUsbStatus] = useState('Aguardando Pendrive...');
  const [usbConnected, setUsbConnected] = useState(false);

  return (
    <Layout usbStatus={usbStatus} usbConnected={usbConnected}>
      <Dashboard onUsbChange={(connected, status) => {
        setUsbConnected(connected);
        setUsbStatus(status);
      }} />
    </Layout>
  );
}

export default App;
```

---

### Task 2: Build the Hybrid Dashboard

**Files:**
- Create: `src/app-desktop/src/components/Dashboard.tsx`
- Create: `src/app-desktop/src/components/HeroCard.tsx`
- Create: `src/app-desktop/src/components/ActivityFeed.tsx`

- [ ] **Step 1: Create the HeroCard component**
```tsx
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
```

- [ ] **Step 2: Create the ActivityFeed component**
```tsx
import React from 'react';
import { Radio } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const recentTracks = [
    { id: 1, artist: "Gusttavo Lima", title: "Milionário", time: "Há 5 min" },
    { id: 2, artist: "Wesley Safadão", title: "Volta", time: "Há 12 min" },
    { id: 3, artist: "Xand Avião", title: "Role", time: "Há 25 min" },
    { id: 4, artist: "Nattan", title: "Love Gostosinho", time: "Há 1h" },
  ];

  return (
    <div className="bg-pulse-surface rounded-2xl border border-pulse-border p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pulse-red opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-pulse-red"></span>
        </div>
        <h3 className="font-bold text-lg">Atividade do Sistema</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {recentTracks.map(track => (
          <div key={track.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-pulse-dark/50 transition-colors">
            <div className="mt-1 p-2 rounded-md bg-pulse-dark text-pulse-red">
              <Radio size={14} />
            </div>
            <div>
              <p className="font-medium text-sm text-pulse-textPrimary">{track.title}</p>
              <p className="text-xs text-pulse-textSecondary">{track.artist}</p>
            </div>
            <div className="ml-auto text-[10px] text-pulse-textSecondary mt-1">
              {track.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Create the Dashboard component**
```tsx
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
```

---

### Task 3: Build the Sync Progress Modal

**Files:**
- Create: `src/app-desktop/src/components/SyncModal.tsx`

- [ ] **Step 1: Create the SyncModal component with dummy sync logic**
```tsx
import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { syncService } from '../services/api';

interface SyncModalProps {
  drive: any;
  onClose: () => void;
  onSyncStateChange: (isSyncing: boolean) => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({ drive, onClose, onSyncStateChange }) => {
  const [step, setStep] = useState<string>('scanning'); // scanning, downloading, complete, error
  const [progress, setProgress] = useState({ current: 0, total: 100 });
  const [log, setLog] = useState<string>('Analisando arquivos do pendrive...');

  useEffect(() => {
    runSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSync = async () => {
    onSyncStateChange(true);
    try {
      const drivePath = drive?.mountpoints?.[0]?.path;
      if (!drivePath) throw new Error("Caminho do drive não encontrado");

      // 1. Scan (Simulado para UI fluida se não houver backend)
      setLog(`Lendo arquivos em ${drivePath}...`);
      await new Promise(r => setTimeout(r, 1500));
      
      setStep('downloading');
      setProgress({ current: 0, total: 42 }); // Dummy numbers
      
      // Simulating download progress
      for (let i = 1; i <= 42; i++) {
        await new Promise(r => setTimeout(r, 100));
        setProgress({ current: i, total: 42 });
        setLog(`Processando faixa ${i} de 42...`);
      }

      setStep('complete');
      setLog('Sincronização concluída com sucesso!');
    } catch (err: any) {
      setStep('error');
      setLog(`Erro: ${err.message}`);
    } finally {
      onSyncStateChange(false);
    }
  };

  const percentage = Math.round((progress.current / progress.total) * 100) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-pulse-surface border border-pulse-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-pulse-border">
          <h3 className="font-bold text-lg">Atualizando Pendrive</h3>
          {step !== 'scanning' && step !== 'downloading' && (
            <button onClick={onClose} className="text-pulse-textSecondary hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-8 flex flex-col items-center">
          {step === 'scanning' && (
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pulse-red mb-6"></div>
          )}
          
          {step === 'downloading' && (
            <div className="relative flex items-center justify-center mb-6">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="45" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-pulse-dark" />
                <circle cx="48" cy="48" r="45" stroke="currentColor" strokeWidth="6" fill="transparent" 
                  strokeDasharray={283} 
                  strokeDashoffset={283 - (283 * percentage) / 100} 
                  className="text-pulse-red transition-all duration-300" />
              </svg>
              <span className="absolute text-xl font-bold">{percentage}%</span>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-green-500 mb-6">
              <CheckCircle2 size={64} />
            </div>
          )}

          {step === 'error' && (
            <div className="text-pulse-red mb-6">
              <X size={64} />
            </div>
          )}

          <p className="text-center text-pulse-textPrimary font-medium mb-2">{log}</p>
          
          {step === 'complete' && (
            <button onClick={onClose} className="mt-6 px-8 py-3 bg-pulse-red hover:bg-red-500 text-white rounded-xl font-bold transition-all">
              FECHAR E OUVIR
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```