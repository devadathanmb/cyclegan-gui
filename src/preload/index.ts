import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  generateScan: (...args: string[]): Promise<string> =>
    ipcRenderer.invoke('generate-scan', ...args),
  viewGeneratedScans: (): Promise<string> => ipcRenderer.invoke('view-generated-scans'),
  openImage: (...args: string[]): void => ipcRenderer.send('open-image', ...args)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)

    contextBridge.exposeInMainWorld('electron', electronAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
