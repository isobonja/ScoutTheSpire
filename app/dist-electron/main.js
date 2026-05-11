import { ipcMain, app, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs";
createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let profileSavePath = null;
const getProfileSavePath = () => {
  const steamDir = path.join(
    app.getPath("appData"),
    "SlayTheSpire2",
    "steam"
  );
  const childDirs = fs.readdirSync(steamDir, { withFileTypes: true });
  const idFolder = childDirs.find(
    (dir) => dir.isDirectory() && /^\d+$/.test(dir.name)
  );
  if (!idFolder) {
    return null;
  }
  const jsonPath = path.join(
    steamDir,
    idFolder.name,
    "profile1",
    "saves",
    "progress.save"
  );
  return jsonPath;
};
function readProfileSave() {
  if (!profileSavePath) {
    return null;
  }
  const data = fs.readFileSync(profileSavePath, "utf-8");
  if (!data) {
    console.error("Failed to read profile save data");
    return null;
  }
  return JSON.parse(data);
}
ipcMain.handle("read-profile-save", () => {
  return readProfileSave();
});
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.cjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  profileSavePath = getProfileSavePath();
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
