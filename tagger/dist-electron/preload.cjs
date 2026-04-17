"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  readTags: () => electron.ipcRenderer.invoke("read-tags"),
  readCards: () => electron.ipcRenderer.invoke("read-cards"),
  readCardTags: () => electron.ipcRenderer.invoke("read-card-tags"),
  addTagCategory: (category, limit = -1, required = false) => electron.ipcRenderer.invoke("add-tag-category", category, limit, required),
  addTagsToCategory: (category, tags) => electron.ipcRenderer.invoke("add-tags-to-category", category, tags),
  addTagsToCard: (cardId, tags) => electron.ipcRenderer.invoke("add-tags-to-card", cardId, tags)
});
