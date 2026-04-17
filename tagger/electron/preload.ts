import { contextBridge, ipcRenderer } from 'electron'
import { read } from 'node:fs'

contextBridge.exposeInMainWorld('api', {
  readTags: () => ipcRenderer.invoke('read-tags'),

  readCards: () => ipcRenderer.invoke('read-cards'),

  readCardTags: () => ipcRenderer.invoke('read-card-tags'),

  addTagCategory: (category: string, limit: number = -1, required: boolean = false) =>
    ipcRenderer.invoke('add-tag-category', category, limit, required),

  addTagsToCategory: (category: string, tags: string[]) =>
    ipcRenderer.invoke('add-tags-to-category', category, tags),

  addTagsToCard: (cardId: string, tags: string[]) =>
    ipcRenderer.invoke('add-tags-to-card', cardId, tags),
})