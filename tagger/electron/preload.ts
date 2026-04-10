import { contextBridge, ipcRenderer } from 'electron'
import { read } from 'node:fs'

contextBridge.exposeInMainWorld('api', {
  readTags: () => ipcRenderer.invoke('read-tags'),

  readCards: () => ipcRenderer.invoke('read-cards'),

  addTagCategory: (category: string) =>
    ipcRenderer.invoke('add-tag-category', category),

  addTagsToCategory: (category: string, tags: string[]) =>
    ipcRenderer.invoke('add-tags-to-category', category, tags),
})