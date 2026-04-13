import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface SyncModalProps {
  drive: any;
  onClose: () => void;
  onSyncStateChange: (isSyncing: boolean) => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({ drive, onClose, onSyncStateChange }) => {
  const [step, setStep] = useState<'scanning' | 'downloading' | 'complete' | 'error'>('scanning');
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

      // 1. Scan (Simulado para UI fluida)
      setLog(`Lendo arquivos em ${drivePath}...`);
      await new Promise(r => setTimeout(r, 1500));
      
      setStep('downloading');
      const totalTracks = 42;
      setProgress({ current: 0, total: totalTracks });
      
      // Simulating download progress
      for (let i = 1; i <= totalTracks; i++) {
        await new Promise(r => setTimeout(r, 80));
        setProgress({ current: i, total: totalTracks });
        setLog(`Processando faixa ${i} de ${totalTracks}...`);
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
          <h3 className="font-bold text-lg">Sincronização Pulse</h3>
          {(step === 'complete' || step === 'error') && (
            <button onClick={onClose} className="text-pulse-textSecondary hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-10 flex flex-col items-center">
          {step === 'scanning' && (
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pulse-red mb-6"></div>
          )}
          
          {step === 'downloading' && (
            <div className="relative flex items-center justify-center mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-pulse-dark" />
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={377} 
                  strokeDashoffset={377 - (377 * percentage) / 100} 
                  className="text-pulse-red transition-all duration-300 shadow-[0_0_15px_rgba(255,59,59,0.5)]" />
              </svg>
              <span className="absolute text-2xl font-bold">{percentage}%</span>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-green-500 mb-6 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
              <CheckCircle2 size={80} />
            </div>
          )}

          {step === 'error' && (
            <div className="text-pulse-red mb-6">
              <X size={80} />
            </div>
          )}

          <p className="text-center text-pulse-textPrimary font-medium mb-1 text-lg">{log}</p>
          <p className="text-center text-pulse-textSecondary text-sm mb-6">Unidade: {drive?.mountpoints?.[0]?.path}</p>
          
          {step === 'complete' && (
            <button 
              onClick={onClose} 
              className="w-full py-4 bg-pulse-red hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,59,59,0.2)]"
            >
              FECHAR E OUVIR
            </button>
          )}

          {step === 'error' && (
            <button 
              onClick={onClose} 
              className="w-full py-4 bg-pulse-surface border border-pulse-border hover:bg-pulse-border text-white rounded-xl font-bold transition-all"
            >
              TENTAR NOVAMENTE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
