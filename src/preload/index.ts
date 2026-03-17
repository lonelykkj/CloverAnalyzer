import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  startScan: (path: string) => ipcRenderer.send('scan:start', path),
  cancelScan: () => ipcRenderer.send('scan:cancel'),
  deleteFile: (path: string) => ipcRenderer.invoke('file:delete', path),
  revealInFinder: (path: string) => ipcRenderer.send('file:reveal', path),
  onScanProgress: (cb: (data: { scanned: number; current: string }) => void) =>
    ipcRenderer.on('scan:progress', (_e, data) => cb(data)),
  onScanComplete: (cb: (node: unknown) => void) =>
    ipcRenderer.on('scan:complete', (_e, node) => cb(node)),
  onScanError: (cb: (err: { message: string }) => void) =>
    ipcRenderer.on('scan:error', (_e, err) => cb(err)),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
})