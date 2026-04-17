import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs'

import type { TagsData, ApiResponse, CardsData, Card, CardTagData } from '../shared/types';

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

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

// ✅ Centralized file path
const getTagsFilePath = () =>
  path.join(process.env.APP_ROOT!, '..', 'data', 'tags_test.json')

const getCardDataFilePath = () =>
  path.join(process.env.APP_ROOT!, '..', 'data', 'cards.json')

const getCardTagDataFilePath = () =>
  path.join(process.env.APP_ROOT!, '..', 'data', 'card_tags.json')

// ✅ Helpers
function readTags(): TagsData {
  const content = fs.readFileSync(getTagsFilePath(), 'utf-8')
  return JSON.parse(content)
}

function writeTags(data: TagsData) {
  fs.writeFileSync(getTagsFilePath(), JSON.stringify(data, null, 2))
}

function readCards(): CardsData {
  const content = fs.readFileSync(getCardDataFilePath(), 'utf-8')
  return JSON.parse(content)
}

function readCardTags(): CardTagData {
  const content = fs.readFileSync(getCardTagDataFilePath(), 'utf-8')
  return JSON.parse(content)
}

function writeCardTags(data: CardTagData) {
  fs.writeFileSync(getCardTagDataFilePath(), JSON.stringify(data, null, 2))
}

// ✅ IPC HANDLERS

ipcMain.handle('read-tags', () => {
  return readTags()
})

ipcMain.handle('read-cards', () => {
  return readCards()
})

ipcMain.handle('add-tag-category', (_event, category: string, limit: number = -1, required: boolean = false) => {
  const json = readTags()

  if (json[category]) {
    return { success: false, error: 'Category already exists' }
  }

  json[category] = { limit, required, weight: 1, tags: [] }
  writeTags(json)

  return { success: true, data: json };
})

ipcMain.handle(
  'add-tags-to-category',
  (_event, category: string, tags: string[]) => {
    const json = readTags()

    if (!json[category]) {
      return { success: false, error: 'Category does not exist' }
    }

    json[category].tags = Array.from(
      new Set([...json[category].tags, ...tags])
    )

    writeTags(json)

    return { success: true, data: json };
  }
)

ipcMain.handle(
  'add-tags-to-card',
  (_event, cardId: string, tags: string[]) => {
    const cardTags = readCardTags()
    cardTags[cardId] = Array.from(new Set([...(cardTags[cardId] || []), ...tags]) )
    writeCardTags(cardTags)
    return { success: true, data: cardTags };
  }
)

// Window setup
function createWindow() {
  win = new BrowserWindow({
    minWidth: 960,
    minHeight: 720,
    icon: path.join(process.env.VITE_PUBLIC!, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: false,
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send(
      'main-process-message',
      new Date().toLocaleString()
    )
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)