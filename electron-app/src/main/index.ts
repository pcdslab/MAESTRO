import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/saeedlogo.png?asset'
import { spawn } from 'child_process'
import fs from 'fs'

console.log(path.resolve(process.cwd(), './env.json'))

let configPath: string

if (fs.existsSync(path.resolve(process.cwd(), '../../env.json'))) {
  configPath = path.resolve(process.cwd(), '../../env.json')
} else if (fs.existsSync(path.resolve(process.cwd(), './env.json'))) {
  configPath = path.resolve(process.cwd(), './env.json')
} else if (fs.existsSync(path.resolve(process.cwd(), '../env.json'))) {
  configPath = path.resolve(process.cwd(), '../env.json')
} else {
  console.log('env.json can not be found, exiting')
  process.exit()
}

const rawData = fs.readFileSync(configPath, 'utf-8')
const config = JSON.parse(rawData)

let cmd



function createWindow(): void { 
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  // Listen for command execution requests
  ipcMain.on('run-cmd', (event, command) => {
    cmd = spawn(command, { shell: true })

    cmd.stdout.on('data', (data) => {
      event.reply('cmd-output', data.toString())
    })

    cmd.stderr.on('data', (data) => {
      event.reply('cmd-output', `Error: ${data.toString()}`)
    })

    cmd.on('close', (code) => {
      event.reply('cmd-output', `Process exited with code ${code}`)
    })
  })

  ipcMain.on('terminate-cmd', () => {
    if (cmd) {
      cmd.kill('SIGTERM') // Send termination signal
    }
  })

  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })
    return result.canceled ? null : result.filePaths[0]
  })

  ipcMain.handle('write-file', async (_event, filePath, data) => {
    try {
      fs.writeFileSync(filePath, data, 'utf-8')
      return { success: true }
    } catch (error: any) {
      console.error('Failed to write file:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('get-env-variable', (_event, variableName) => {
    return config[variableName]
  })

  ipcMain.handle('isWindows', () => process.platform === 'win32')

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
