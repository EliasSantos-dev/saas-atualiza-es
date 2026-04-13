import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import crypto from 'node:crypto'
import axios from 'axios'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

function calculateFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const stream = fs.createReadStream(filePath)
    stream.on('data', data => hash.update(data))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', err => reject(err))
  })
}

// IPC Handlers
ipcMain.handle('list-drives', async () => {
  return new Promise((resolve) => {
    // 2 = Removable disk (USB)
    exec('wmic logicaldisk get caption,drivetype /format:csv', (error, stdout) => {
      if (error) {
        console.error('Error listing drives:', error)
        return resolve([])
      }
      
      const drives = []
      const lines = stdout.trim().split('\n').slice(1) // Skip header
      
      for (const line of lines) {
        const parts = line.trim().split(',')
        if (parts.length >= 3) {
          const letter = parts[1]
          const type = parts[2]
          
          if (type === '2') { // Removable
            drives.push({
              device: letter,
              mountpoints: [{ path: letter + '\\' }],
              isRemovable: true,
              isUSB: true
            })
          }
        }
      }
      resolve(drives)
    })
  })
})

ipcMain.handle('scan-pendrive-files', async (_, drivePath: string) => {
  const files: any[] = []
  
  const walk = async (dir: string) => {
    const list = fs.readdirSync(dir)
    for (const item of list) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        await walk(fullPath)
      } else if (item.endsWith('.mp3')) {
        const relPath = path.relative(drivePath, fullPath).replace(/\\/g, '/')
        const hash = await calculateFileHash(fullPath)
        files.push({ path: relPath, hash, size: stat.size })
      }
    }
  }

  if (fs.existsSync(drivePath)) {
    await walk(drivePath)
  }
  return files
})

ipcMain.handle('download-file', async (_, { url, destPath }: { url: string, destPath: string }) => {
  const dir = path.dirname(destPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const writer = fs.createWriteStream(destPath)
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
})

ipcMain.handle('delete-file', async (_, filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    return true
  }
  return false
})

ipcMain.handle('rename-file', async (_, { oldPath, newPath }: { oldPath: string, newPath: string }) => {
  const dir = path.dirname(newPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath)
    return true
  }
  return false
})

ipcMain.handle('write-manifest', async (_, { drivePath, manifest }: { drivePath: string, manifest: any }) => {
  const manifestPath = path.join(drivePath, '.saas-pendrive.json')
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  return true
})

ipcMain.handle('check-manifest', async (_, drivePath: string) => {
  const manifestPath = path.join(drivePath, '.saas-pendrive.json')
  if (fs.existsSync(manifestPath)) {
    try {
      const data = fs.readFileSync(manifestPath, 'utf-8')
      return JSON.parse(data)
    } catch (e) {
      return null
    }
  }
  return null
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
