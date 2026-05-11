import { contextBridge, ipcRenderer } from 'electron'

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
  readTags: () => ipcRenderer.invoke('read-tags'),

  readCards: () => ipcRenderer.invoke('read-cards'),

  readCardTags: () => ipcRenderer.invoke('read-card-tags'),

  addTagCategory: (category: string, limit: number = 0, required: boolean = false) =>
    ipcRenderer.invoke('add-tag-category', category, limit, required),

  addTagsToCategory: (category: string, tags: string[]) =>
    ipcRenderer.invoke('add-tags-to-category', category, tags),

  addTagsToCard: (cardId: string, tags: string[]) =>
    ipcRenderer.invoke('add-tags-to-card', cardId, tags),
})