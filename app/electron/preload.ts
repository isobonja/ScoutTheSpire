import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

contextBridge.exposeInMainWorld('api', {
  readProfileSave: () => ipcRenderer.invoke('read-profile-save'),
  fetchBadgeData: () => ipcRenderer.invoke('fetch-badge-data'),
  fetchEnemyData: () => ipcRenderer.invoke('fetch-enemy-data'),
  fetchEncounterData: () => ipcRenderer.invoke('fetch-encounter-data'),
  fetchEpochsData: () => ipcRenderer.invoke('fetch-epochs-data'),
  getSteamAvatarURL: () => ipcRenderer.invoke('get-steam-avatar-url'),
  getImageCategoryData: (categoryID: string) => ipcRenderer.invoke('get-image-category-data', categoryID),
  
})
