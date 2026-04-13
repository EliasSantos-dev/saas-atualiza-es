import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  listDrives: () => ipcRenderer.invoke('list-drives'),
  checkManifest: (drivePath: string) => ipcRenderer.invoke('check-manifest', drivePath),
  scanPendriveFiles: (drivePath: string) => ipcRenderer.invoke('scan-pendrive-files', drivePath),
  downloadFile: (url: string, destPath: string) => ipcRenderer.invoke('download-file', { url, destPath }),
  deleteFile: (filePath: string) => ipcRenderer.invoke('delete-file', filePath),
  renameFile: (oldPath: string, newPath: string) => ipcRenderer.invoke('rename-file', { oldPath, newPath }),
  writeManifest: (drivePath: string, manifest: any) => ipcRenderer.invoke('write-manifest', { drivePath, manifest }),
  onMainProcessMessage: (callback: (message: string) => void) => {
    ipcRenderer.on('main-process-message', (_event, value) => callback(value))
  }
})
