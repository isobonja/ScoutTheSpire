import { app, BrowserWindow, ipcMain, protocol } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs';

import type { ProfileSaveData } from '../shared/types/profileData'

import { fetchBadgeData, fetchImagesJSON } from './requests';
import { cacheAllBadgeImages, cacheImageJSON } from './cache';
import { BadgeData } from 'shared/types/badges';
import { APP_NAME } from '../../shared/constants';
import { getSteamPath } from './utils';
import { ImageFileCategory } from 'shared/types/images';

app.setName("ScoutTheSpire");

app.setPath(
  "userData",
  path.join(
    app.getPath("appData"),
    APP_NAME,
    "app"
  )
);

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let profileSavePath: string | null = null
let steamAvatarID: string | null = null

const getProfileSavePath = () => {
  const steamDir = path.join(
    app.getPath('appData'),
    'SlayTheSpire2',
    'steam'
  )

  const childDirs = fs.readdirSync(steamDir, { withFileTypes: true })

  const idFolder = childDirs.find(
    dir => dir.isDirectory() && /^\d+$/.test(dir.name)
  );

  if (!idFolder) {
    return null;
  }

  steamAvatarID = idFolder.name;

  const jsonPath = path.join(
    steamDir,
    idFolder.name,
    'profile1',
    'saves',
    'progress.save'
  );

  //console.log(jsonPath);

  return jsonPath;
}

async function getSteamAvatarURL(): Promise<string | null> {
  if (!steamAvatarID) {
    return null;
  }

  const steamPath = await getSteamPath();
  if (!steamPath) {
    return null;
  }

  const avatarPath = path.join(
    steamPath,
    "config",
    "avatarcache",
    `${steamAvatarID}.png`
  );

  if (!fs.existsSync(avatarPath)) {
    return null;
  }

  return `steam-avatar:///${steamAvatarID}.png`;
}

function readProfileSave(): ProfileSaveData | null {
  //console.log('Reading profile save data');
  if (!profileSavePath) {
    return null;
  }

  const data = fs.readFileSync(profileSavePath, 'utf-8');
  if (!data) {
    console.error('Failed to read profile save data');
    return null;
  }

  //console.log('Profile save data:', data);
  return JSON.parse(data);
}


// IPC Handlers

let cachedImageData: ImageFileCategory[] = [];
let cachedBadgeData: BadgeData[] = [];

ipcMain.handle('read-profile-save', () => {
  //console.log('Reading profile save data');
  return readProfileSave();
});

ipcMain.handle('fetch-badge-data', async () => {
  //return await fetchBadgeData();
  return cachedBadgeData;
});

ipcMain.handle('get-steam-avatar-url', async () => {
  return await getSteamAvatarURL();
});


// Window creation

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

//app.whenReady().then(createWindow)
app.whenReady().then(async () => {
  profileSavePath = getProfileSavePath();

  cachedImageData = await cacheImageJSON();

  protocol.handle("asset", async (request) => {
    try {
      const url = new URL(request.url);

      // Example:
      // asset://badges/ELITE.png
      // hostname = "badges"
      // pathname = "/ELITE.png"

      const relativePath = path.normalize(
        path.join(url.hostname, url.pathname)
      );

      const cacheRoot = path.join(
        app.getPath("userData"),
        "asset_cache"
      );

      const filePath = path.join(
        cacheRoot,
        relativePath
      );

      console.log("Asset path:", filePath);

      // Prevent path traversal attacks
      if (!filePath.startsWith(cacheRoot)) {
        return new Response("Forbidden", {
          status: 403,
        });
      }

      try {
        await fs.promises.access(filePath);
      } catch {
        return new Response("Not found", {
          status: 404,
        });
      }

      const data = await fs.promises.readFile(filePath);

      const ext = path.extname(filePath).toLowerCase();

      const mimeTypes: Record<string, string> = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
      };

      return new Response(data, {
        headers: {
          "Content-Type":
            mimeTypes[ext] ||
            "application/octet-stream",
        },
      });
    } catch (err) {
      console.error("Asset protocol error", err);

      return new Response("Internal error", {
        status: 500,
      });
    }
  });

  protocol.handle(
    "steam-avatar",
    async (request) => {
      try {
        const steamPath = await getSteamPath();

        if (!steamPath) {
          return new Response("Steam not found", {
            status: 404,
          });
        }

        const url = new URL(request.url);

        const safeName = path.basename(
          url.pathname
        );

        const filePath = path.join(
          steamPath,
          "config",
          "avatarcache",
          safeName
        );

        if (!fs.existsSync(filePath)) {
          return new Response("Not found", {
            status: 404,
          });
        }

        const data =
          await fs.promises.readFile(filePath);

        return new Response(data, {
          headers: {
            "Content-Type": "image/png",
          },
        });
      } catch (err) {
        console.error(
          "Steam avatar protocol error",
          err
        );

        return new Response("Internal error", {
          status: 500,
        });
      }
    }
  );

  try {
    const badgeData = await fetchBadgeData();

    console.log(`Fetched ${badgeData.length} badges from API`);

    cachedBadgeData = await cacheAllBadgeImages(
      badgeData
    );

    console.log("Badge cache ready");
  } catch (err) {
    console.error("Failed to initialize badge cache", err);
  }

  createWindow();
})
