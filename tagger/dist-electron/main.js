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
let win;
const getTagsFilePath = () => path.join(process.env.APP_ROOT, "..", "data", "tags_test.json");
const getCardDataFilePath = () => path.join(process.env.APP_ROOT, "..", "data", "cards.json");
const getCardTagDataFilePath = () => path.join(process.env.APP_ROOT, "..", "data", "card_tags.json");
function readTags() {
  const content = fs.readFileSync(getTagsFilePath(), "utf-8");
  return JSON.parse(content);
}
function writeTags(data) {
  fs.writeFileSync(getTagsFilePath(), JSON.stringify(data, null, 2));
}
function readCards() {
  const content = fs.readFileSync(getCardDataFilePath(), "utf-8");
  return JSON.parse(content);
}
function readCardTags() {
  const content = fs.readFileSync(getCardTagDataFilePath(), "utf-8");
  return JSON.parse(content);
}
function writeCardTags(data) {
  fs.writeFileSync(getCardTagDataFilePath(), JSON.stringify(data, null, 2));
}
ipcMain.handle("read-tags", () => {
  return readTags();
});
ipcMain.handle("read-cards", () => {
  return readCards();
});
ipcMain.handle("read-card-tags", () => {
  return readCardTags();
});
ipcMain.handle("add-tag-category", (_event, category, limit = 0, required = false) => {
  const json = readTags();
  if (json[category]) {
    return { success: false, error: "Category already exists" };
  }
  json[category] = { limit, required, weight: 1, tags: [] };
  writeTags(json);
  return { success: true, data: json };
});
ipcMain.handle(
  "add-tags-to-category",
  (_event, category, tags) => {
    const json = readTags();
    if (!json[category]) {
      return { success: false, error: "Category does not exist" };
    }
    json[category].tags = Array.from(
      /* @__PURE__ */ new Set([...json[category].tags, ...tags])
    );
    writeTags(json);
    return { success: true, data: json };
  }
);
ipcMain.handle(
  "add-tags-to-card",
  (_event, cardId, tags) => {
    const cardTags = readCardTags();
    cardTags[cardId] = tags;
    writeCardTags(cardTags);
    return { success: true, data: cardTags };
  }
);
function createWindow() {
  win = new BrowserWindow({
    minWidth: 960,
    minHeight: 720,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.cjs"),
      sandbox: false
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
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
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
