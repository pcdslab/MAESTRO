import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      runCmd: (command: string) => ipcRenderer.send('run-cmd', command),
      terminateCmd: () => ipcRenderer.send('terminate-cmd'),
      onCmdOutput: (callback: any) =>
        ipcRenderer.on('cmd-output', (event, ...args) => callback(...args)),
      offCmdOutput: (callback) => ipcRenderer.removeListener('cmd-output', callback),
      getEnvVariable: (key: any) => ipcRenderer.invoke('get-env-variable', key),
      isWindows: async () => await ipcRenderer.invoke('isWindows')
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
