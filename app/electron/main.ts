import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_NAME } from '../../shared/constants';
import { cacheImageJSON, cacheImagesBulk } from './cache';
import { initializeProtocols } from './protocols';
import { fetchBadgeData, fetchEncounterData, fetchEnemyData, fetchEpochsData } from './requests';
import { getSteamPath, isRequiredAssetCategory } from './utils';

import type { BadgeData } from 'shared/types/badges';
import type { ImageFileCategory } from 'shared/types/images';
import type { ProfileSaveData } from '../shared/types/profileData';
import type { EnemiesData } from 'shared/types/enemies';
import type { EncountersData } from 'shared/types/encounters';
import type { EpochsData } from '../shared/types/epochs';

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

/**
 * Retrieve the path to the user's profile save file for Slay the Spire.
 * 
 * @returns The path to the profile save file, or null if not found
 */
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

  return jsonPath;
}

/**
 * Retrieve the URL for the user's Steam avatar based on the cached avatar ID.
 * 
 * @returns A Promise that resolves to the Steam avatar URL, or null if not available
 */
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

/**
 * Read the user's profile save data.
 * 
 * @returns The parsed profile save data, or null if not found
 */
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

// ***** Cached Data *****

let cachedImageData: ImageFileCategory[] = [];
let cachedBadgeData: BadgeData[] = [];
let cachedEnemyData: EnemiesData[] = [];
let cachedEncounterData: EncountersData[] = [];
let cachedEpochsData: EpochsData[] = [];

// ***** IPC Handlers *****

ipcMain.handle('read-profile-save', () => {
  return readProfileSave();
});

ipcMain.handle('fetch-badge-data', async () => {
  return cachedBadgeData;
});

ipcMain.handle('fetch-enemy-data', async () => {
  return cachedEnemyData;
});

ipcMain.handle('fetch-encounter-data', async () => {
  return cachedEncounterData;
});

ipcMain.handle('fetch-epochs-data', async () => {
  return cachedEpochsData;
});

ipcMain.handle('get-steam-avatar-url', async () => {
  return await getSteamAvatarURL();
});

ipcMain.handle('get-image-category-data', (_, categoryID: string) => {
  console.log("-Electron-: Getting image category data of category", categoryID)
  if (!isRequiredAssetCategory(categoryID)) {
    return null;
  }
  return cachedImageData.find((c) => c.id === categoryID) || null
})

// ***** Window creation *****

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

  initializeProtocols();

  try {
    cachedImageData = await Promise.all(
      cachedImageData.map((category) => {
        if (isRequiredAssetCategory(category.id)) {
          console.log("-Electron-: Caching Images for required asset category", category)
          return cacheImagesBulk(category);
        }

        return category
      })
    );
  } catch (err) {
    console.error("Error caching required assets:", err);
  }

  try {
    cachedBadgeData = await fetchBadgeData();

    console.log(`Fetched ${cachedBadgeData.length} badges from API`);

    console.log("Badge cache ready");
  } catch (err) {
    console.error("Failed to initialize badge cache", err);
  }

  /*
    Currently, the data below is fetched on-demand separately, and are never 
    saved locally like the images JSON. However, it might be worth changing this to 
    work similarly to the images JSON, where all badge and enemy data is fetched and 
    cached so that the endpoints do not need to be called whenever the app is booted or 
    the data is necessary. A local copy will be saved and only updated every X hours or 
    when the user clicks a "refresh data" button or something similar.

  */
  try {
    cachedEnemyData = await fetchEnemyData();

    console.log(`Fetched ${cachedEnemyData.length} enemies from API`);

    console.log("Enemy cache ready");
  } catch (err) {
    console.error("Failed to initialize enemy cache", err);
  }

  try {
    cachedEncounterData = await fetchEncounterData();

    console.log(`Fetched ${cachedEncounterData.length} encounters from API`);

    console.log("Encounter cache ready");
  } catch (err) {
    console.error("Failed to initialize encounter cache", err);
  }

  try {
    cachedEpochsData = await fetchEpochsData();

    console.log(`Fetched ${cachedEpochsData.length} epochs from API`);

    console.log("Epoch cache ready");
  } catch (err) {
    console.error("Failed to initialize epoch cache", err);
  }

  createWindow();
})
