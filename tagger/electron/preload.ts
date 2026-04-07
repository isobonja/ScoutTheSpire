import { ipcRenderer, contextBridge } from 'electron'
import path from 'path'
import fs from "fs"

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

contextBridge.exposeInMainWorld("api", {
  readPrototypeJSONFromFile: () => {
    const filePath = path.join(process.cwd(), "..", "data", "cards.json");
    const content = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(content);
    //console.log("Read file json:", json); // Debug log to check the file content
    return json;
  },
});
