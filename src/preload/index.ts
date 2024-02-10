import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  generateScan: (...args: string[]): Promise<string> =>
    ipcRenderer.invoke('generate-scan', ...args),
  viewGeneratedScans: (): void => ipcRenderer.send('view-generated-scans')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
