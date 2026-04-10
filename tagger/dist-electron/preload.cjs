"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  readTags: () => electron.ipcRenderer.invoke("read-tags"),
  readCards: () => electron.ipcRenderer.invoke("read-cards"),
  addTagCategory: (category) => electron.ipcRenderer.invoke("add-tag-category", category),
  addTagsToCategory: (category, tags) => electron.ipcRenderer.invoke("add-tags-to-category", category, tags)
});
