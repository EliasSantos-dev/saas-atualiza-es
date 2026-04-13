"use client";

import { Save, RefreshCw, Folder, HardDrive, Link as LinkIcon, Plus, Trash2, ChevronRight, FileMusic } from 'lucide-react';
import { useState, useEffect } from 'react';
import { configService, snapshotService } from '@/services/api';

export default function PendriveBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [config, setConfig] = useState<any>({
    profile_id: 'master_profile',
    max_size_gb: 14.0,
    folder_rules: {}
  });
  const [latestSnapshot, setLatestSnapshot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'explorer'>('config');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [configData, snapshotData] = await Promise.all([
        configService.get('master_profile'),
        snapshotService.getLatest('master_profile').catch(() => null)
      ]);
      setConfig(configData);
      setLatestSnapshot(snapshotData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      await configService.update('master_profile', config);
      alert("Configuração salva com sucesso!");
    } catch (error) {
      alert("Erro ao salvar configuração.");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateMaster = async () => {
    try {
      setGenerating(true);
      const result = await snapshotService.generateMaster();
      alert(`Sucesso: ${result.message}\nTotal de arquivos: ${result.total_files}`);
      fetchData(); // Recarrega para ver o novo snapshot
    } catch (error) {
      alert("Erro ao gerar snapshot mestre.");
    } finally {
      setGenerating(false);
    }
  };

  const addFolderRule = () => {
    const folderName = prompt("Digite o nome exato da pasta (ex: 01. HITS):");
    if (folderName) {
      setConfig({
        ...config,
        folder_rules: {
          ...config.folder_rules,
          [folderName]: { max_files: 50, link: "" }
        }
      });
    }
  };

  const removeFolderRule = (name: string) => {
    const newRules = { ...config.folder_rules };
    delete newRules[name];
    setConfig({ ...config, folder_rules: newRules });
  };

  const updateFolderRule = (name: string, field: string, value: any) => {
    setConfig({
      ...config,
      folder_rules: {
        ...config.folder_rules,
        [name]: { ...config.folder_rules[name], [field]: value }
      }
    });
  };

  if (loading) return <div className="p-8 font-black animate-pulse uppercase tracking-widest text-center">Carregando Construtor...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Pendrive Builder</h1>
          <p className="text-pulse-textSecondary font-medium">Configure as regras de ouro para as atualizações mestras</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSaveConfig}
            disabled={saving}
            className="bg-pulse-surface border border-pulse-border hover:bg-pulse-border transition-all px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 uppercase tracking-widest"
          >
            <Save size={18} className={saving ? "animate-spin" : ""} /> {saving ? "Salvando..." : "Salvar Regras"}
          </button>
          <button 
            onClick={handleGenerateMaster}
            disabled={generating}
            className="bg-pulse-red hover:bg-red-500 transition-all px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(255,59,59,0.3)] uppercase tracking-widest"
          >
            <RefreshCw size={18} className={generating ? "animate-spin" : ""} /> {generating ? "Gerando..." : "Gerar Snapshot Mestre"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-pulse-border">
        <button 
          onClick={() => setActiveTab('config')}
          className={`px-8 py-4 font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'config' ? 'border-b-2 border-pulse-red text-pulse-textPrimary' : 'text-pulse-textSecondary hover:text-pulse-textPrimary'}`}
        >
          Configurações e Regras
        </button>
        <button 
          onClick={() => setActiveTab('explorer')}
          className={`px-8 py-4 font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'explorer' ? 'border-b-2 border-pulse-red text-pulse-textPrimary' : 'text-pulse-textSecondary hover:text-pulse-textPrimary'}`}
        >
          Explorador de Snapshot
        </button>
      </div>

      {activeTab === 'config' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Global Config */}
          <div className="space-y-6">
            <div className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <HardDrive size={18} className="text-pulse-red" /> Limite Global
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] text-pulse-textSecondary font-black uppercase">Tamanho Máximo (GB)</label>
                <input 
                  type="number" 
                  value={config.max_size_gb}
                  onChange={(e) => setConfig({...config, max_size_gb: parseFloat(e.target.value)})}
                  className="w-full bg-pulse-dark border border-pulse-border rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-pulse-red transition-colors"
                />
                <p className="text-[10px] text-pulse-textSecondary italic">Padrão: 14GB para pen drives de 16GB.</p>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl">
              <p className="text-xs text-blue-400 leading-relaxed">
                <strong>Dica:</strong> As pastas são processadas em ordem alfabética. O limite de arquivos por pasta ajuda a manter o conteúdo sempre fresco (Hits mais recentes primeiro).
              </p>
            </div>
          </div>

          {/* Folder Rules */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Folder size={18} className="text-pulse-red" /> Regras por Pasta
              </h3>
              <button 
                onClick={addFolderRule}
                className="bg-pulse-surface hover:bg-pulse-border p-2 rounded-lg transition-colors border border-pulse-border"
              >
                <Plus size={20} />
              </button>
            </div>

            {Object.keys(config.folder_rules).length === 0 ? (
              <div className="bg-pulse-surface p-12 rounded-3xl border border-pulse-border border-dashed text-center">
                <p className="text-pulse-textSecondary font-medium">Nenhuma regra específica definida.</p>
                <button onClick={addFolderRule} className="text-pulse-red text-xs font-black uppercase mt-4 hover:underline">Adicionar Primeira Regra</button>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(config.folder_rules).map(([folderName, rule]: [string, any]) => (
                  <div key={folderName} className="bg-pulse-surface p-6 rounded-3xl border border-pulse-border">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-black text-pulse-red uppercase tracking-widest">{folderName}</h4>
                          <button onClick={() => removeFolderRule(folderName)} className="text-pulse-textSecondary hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] text-pulse-textSecondary font-black uppercase">Max. Arquivos</label>
                            <input 
                              type="number" 
                              value={rule.max_files}
                              onChange={(e) => updateFolderRule(folderName, 'max_files', parseInt(e.target.value))}
                              className="w-full bg-pulse-dark border border-pulse-border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-pulse-red transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] text-pulse-textSecondary font-black uppercase">Link de Download</label>
                            <div className="flex gap-2">
                              <div className="bg-pulse-dark border border-pulse-border rounded-xl p-3 flex items-center justify-center">
                                <LinkIcon size={14} className="text-pulse-textSecondary" />
                              </div>
                              <input 
                                type="text" 
                                placeholder="https://..."
                                value={rule.link}
                                onChange={(e) => updateFolderRule(folderName, 'link', e.target.value)}
                                className="flex-1 bg-pulse-dark border border-pulse-border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-pulse-red transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {latestSnapshot ? (
            <div className="bg-pulse-surface rounded-3xl border border-pulse-border overflow-hidden">
              <div className="p-6 bg-pulse-dark border-b border-pulse-border flex items-center justify-between">
                <div>
                  <h3 className="font-black uppercase tracking-widest text-pulse-red">Snapshot Mestre - {latestSnapshot.version}</h3>
                  <p className="text-[10px] text-pulse-textSecondary font-mono">{new Date(latestSnapshot.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black">{latestSnapshot.files.length}</p>
                  <p className="text-[10px] text-pulse-textSecondary font-black uppercase">Arquivos Totais</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {Object.entries(latestSnapshot.folder_links || {}).map(([folder, link]: [string, any]) => {
                    const filesInFolder = latestSnapshot.files.filter((f: any) => f.path.startsWith(folder)).length;
                    return (
                      <div key={folder} className="flex items-center justify-between p-4 hover:bg-pulse-dark/50 rounded-2xl transition-all group">
                        <div className="flex items-center gap-4">
                          <Folder size={20} className="text-pulse-red" />
                          <div>
                            <p className="font-bold text-sm">{folder}</p>
                            <p className="text-[10px] text-pulse-textSecondary font-mono">{link}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs font-black">{filesInFolder} músicas</p>
                          </div>
                          <ChevronRight size={16} className="text-pulse-textSecondary group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-pulse-surface p-20 rounded-3xl border border-pulse-border text-center">
              <RefreshCw size={48} className="mx-auto text-pulse-border mb-4" />
              <p className="text-pulse-textSecondary font-medium">Nenhum snapshot gerado ainda.</p>
              <button onClick={handleGenerateMaster} className="bg-pulse-red px-6 py-3 rounded-xl font-black text-sm uppercase mt-6">Gerar Snapshot Agora</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
