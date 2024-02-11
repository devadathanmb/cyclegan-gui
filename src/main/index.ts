import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'node:fs'
import { spawn } from 'child_process'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

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

// @ts-ignore asdf
async function handleGenerateScan(event, ...args): Promise<string> {
  try {
    // Change directory into model project directory
    process.chdir('/home/devadathan/repos/cycle-gan')
    // Create directory to store generated scans if not exists
    await fs.promises.mkdir('generated-scans', { recursive: true })
    // Store generated scans by date of generation
    const dateFolder = new Date().toISOString().replace(/:/g, '-')

    // Figure out the input and target scan types
    let targetScanType: string
    let inputScanType: string
    if (args[0] === 'ct') {
      inputScanType = 'mri'
      targetScanType = 'ct'
    } else {
      inputScanType = 'ct'
      targetScanType = 'mri'
    }

    // Set input and output file paths
    const inputFilePath = `generated-scans/${dateFolder}/${inputScanType}.jpg`
    const outputFilePath = `generated-scans/${dateFolder}/${targetScanType}.jpg`

    // Create generated scans directory and copy input file
    await fs.promises.mkdir(`generated-scans/${dateFolder}`, { recursive: true })
    await fs.promises.copyFile(args[1], `${inputFilePath}`)

    // Run the pretrained model to generate the scan
    const pythonProcess = spawn(
      'poetry',
      [
        'run',
        'python',
        '~/repos/cycle-gan/inference.py',
        `--target-scan-type ${targetScanType}`,
        `--input-file ${inputFilePath}`,
        `--output-file ${outputFilePath}`
      ],
      { shell: true }
    )

    // Log the stderr
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python process: ${data}`)
    })

    // Wrap the process in a promise and resolve or reject based on the exit code
    return await new Promise<string>((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(`${process.cwd()}/generated-scans/${dateFolder}/${targetScanType}.jpg`)
        } else {
          reject(`Python process exited with code ${code}.`)
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
}

async function handleViewGeneratedScans(): Promise<void> {
  shell.openPath('/home/devadathan/repos/cycle-gan/generated-scans')
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

  // IPC handle generate scan
  ipcMain.handle('generate-scan', handleGenerateScan)

  // IPC hanldle view scan
  ipcMain.on('view-generated-scans', handleViewGeneratedScans)

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
