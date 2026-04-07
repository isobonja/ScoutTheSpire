"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("api", {
  readPrototypeJSONFromFile: () => {
    const filePath = path.join(process.cwd(), "..", "data", "cards.json");
    const content = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(content);
    return json;
  }
});
