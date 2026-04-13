import React, { useState, useEffect } from 'react'
import { Disc, Download, RefreshCw, Smartphone, User, CheckCircle2, AlertCircle } from 'lucide-react'
import axios from 'axios'

// API Base URL (adjust to your FastAPI dev server)
const API_BASE = 'http://localhost:8000'

// Define types for Electron API
declare global {
  interface Window {
    electronAPI: {
      listDrives: () => Promise<any[]>
      checkManifest: (path: string) => Promise<any>
      scanPendriveFiles: (path: string) => Promise<any[]>
      downloadFile: (url: string, destPath: string) => Promise<void>
      deleteFile: (path: string) => Promise<void>
      renameFile: (oldPath: string, newPath: string) => Promise<void>
      writeManifest: (path: string, manifest: any) => Promise<void>
      onMainProcessMessage: (cb: (m: string) => void) => void
    }
  }
}

function App() {
  const [drives, setDrives] = useState<any[]>([])
  const [selectedDrive, setSelectedDrive] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' })

  useEffect(() => {
    const scanDrives = async () => {
      setIsScanning(true)
      try {
        const detected = await window.electronAPI.listDrives()
        setDrives(detected)
      } catch (err) {
        console.error('Scan failed:', err)
      } finally {
        setIsScanning(false)
      }
    }

    scanDrives()
    const interval = setInterval(scanDrives, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSync = async () => {
    if (!selectedDrive) return
    const drivePath = selectedDrive.mountpoints[0].path
    
    setSyncStatus('syncing')
    setProgress({ current: 0, total: 0, label: 'Lendo pendrive...' })

    try {
      // 1. Scan local files and manifest
      const localFiles = await window.electronAPI.scanPendriveFiles(drivePath)
      const localManifest = await window.electronAPI.checkManifest(drivePath) || {
        profile_id: 'perfil_oficial_abril',
        version: 'v0',
        files: localFiles
      }

      // 2. Call API for Delta
      setProgress({ ...progress, label: 'Consultando novidades na nuvem...' })
      const response = await axios.post(`${API_BASE}/sync/delta`, localManifest)
      const { latest_version, delta } = response.data

      const totalOps = delta.to_download.length + delta.to_delete.length + (delta.to_rename?.length || 0)
      let currentOp = 0

      // 3. Execute Renames
      if (delta.to_rename) {
        for (const item of delta.to_rename) {
          setProgress({ current: ++currentOp, total: totalOps, label: `Renomeando: ${item.new_path}` })
          await window.electronAPI.renameFile(
            `${drivePath}/${item.old_path}`,
            `${drivePath}/${item.new_path}`
          )
        }
      }

      // 4. Execute Deletes
      for (const path of delta.to_delete) {
        setProgress({ current: ++currentOp, total: totalOps, label: `Removendo: ${path}` })
        await window.electronAPI.deleteFile(`${drivePath}/${path}`)
      }

      // 5. Execute Downloads
      for (const file of delta.to_download) {
        setProgress({ current: ++currentOp, total: totalOps, label: `Baixando: ${file.path}` })
        // In a real scenario, the API would provide the download URL. 
        // For MVP, we assume a static storage path or proxy.
        const downloadUrl = `${API_BASE}/media/download/${file.hash}` 
        await window.electronAPI.downloadFile(downloadUrl, `${drivePath}/${file.path}`)
      }

      // 6. Update Local Manifest
      const newManifest = {
        profile_id: localManifest.profile_id,
        version: latest_version,
        files: (await window.electronAPI.scanPendriveFiles(drivePath))
      }
      await window.electronAPI.writeManifest(drivePath, newManifest)

      setSyncStatus('success')
    } catch (err) {
      console.error('Sync failed:', err)
      setSyncStatus('error')
    }
  }

  return (
    <div className="container">
      {/* Sidebar/Login Bar */}
      <header className="header">
        <div className="logo">
          <Smartphone size={24} />
          <h1>SaaS Pendrive</h1>
        </div>
        <div className="user-profile">
          <User size={18} />
          <span>{isLogged ? 'Admin' : 'Visitante'}</span>
          <button onClick={() => setIsLogged(!isLogged)} className="login-btn">
            {isLogged ? 'Sair' : 'Entrar'}
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <h2>Atualize seu Pendrive Automotivo</h2>
          <p>Conecte o seu pendrive e receba as novidades do mês de Abril 2026.</p>
        </section>

        <section className="drive-list">
          <h3>Dispositivos Detectados</h3>
          {drives.length === 0 ? (
            <div className="empty-state">
              <RefreshCw className={isScanning ? 'spin' : ''} />
              <p>Aguardando pendrive...</p>
            </div>
          ) : (
            <div className="drives-grid">
              {drives.map((drive, idx) => (
                <div 
                  key={idx} 
                  className={`drive-card ${selectedDrive?.device === drive.device ? 'active' : ''}`}
                  onClick={() => setSelectedDrive(drive)}
                >
                  <Disc size={32} />
                  <div className="drive-info">
                    <strong>{drive.description || 'Disco Removível'}</strong>
                    <span>{drive.mountpoints[0]?.path || 'Sem montagem'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedDrive && (
          <section className="sync-panel">
            <div className="sync-header">
              <CheckCircle2 color="#4CAF50" />
              <div>
                <h4>Pronto para Sincronizar</h4>
                <p>O pendrive em <strong>{selectedDrive.mountpoints[0].path}</strong> está pronto.</p>
              </div>
            </div>
            
            <div className="sync-actions">
              <button 
                disabled={syncStatus === 'syncing'} 
                className={`sync-main-btn ${syncStatus === 'syncing' ? 'loading' : ''}`}
                onClick={handleSync}
              >
                {syncStatus === 'syncing' ? <RefreshCw className="spin" /> : <Download size={20} />}
                {syncStatus === 'syncing' ? 'Sincronizar Agora' : 'Sincronizar Agora'}
              </button>
            </div>

            {syncStatus === 'syncing' && progress.total > 0 && (
              <div className="progress-container">
                <div className="progress-label">
                  <span>{progress.label}</span>
                  <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
                <p className="progress-sub">{progress.current} de {progress.total} tarefas concluídas</p>
              </div>
            )}

            {syncStatus === 'success' && (
              <div className="status-banner success">
                <CheckCircle2 size={18} />
                <span>Sincronização concluída! Pode remover o pendrive.</span>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <span>V1.0 - SaaS Pendrive © 2026</span>
      </footer>
    </div>
  )
}

export default App
