const {app, BrowserWindow, session, Menu} = require('electron');
const path = require('path');
const isDevelopment = process.env.NODE_ENV === 'development';
const {format} = require('url');
const port = 9002;

// isDevelopment && require('react-devtools-electron');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
const createWindow = () => {
  let template = [];
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about',
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        },
      },
    ],
  });
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Create the browser window.
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Chrome';
    callback({cancel: false, requestHeaders: details.requestHeaders});
  });

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
    },
    show: false,
  });

  mainWindow.webContents.on(
    'new-window',
    (event, url, frameName, disposition, options, additionalFeatures) => {
      // console.log('modal opened', event, url, frameName, disposition, options);
      if (frameName === 'modal') {
        // open window as modal
        event.preventDefault();
        Object.assign(options, {
          modal: true,
          parent: mainWindow,
          // frame: false,
        });
        event.newGuest = new BrowserWindow(options);
      }
    },
  );

  // and load the index.html of the app.
  // mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${port}`);
  } else {
    mainWindow.loadURL(
      format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    );
  }

  // Open the DevTools.
  // isDevelopment && mainWindow.webContents.openDevTools();
  mainWindow.once('ready-to-show', () => {
    if (process.platform === 'win32' && isDevelopment) {
      mainWindow.reload();
    }
    mainWindow.show();
  });
};

let deeplinkingUrl;
app.setAsDefaultProtocolClient('appbuilder');
if (isDevelopment && process.platform === 'win32') {
  // Set the path of electron.exe and your app.
  // These two additional parameters are only available on windows.
  // Setting this is required to get this working in dev mode.
  app.setAsDefaultProtocolClient('appbuilder', process.execPath, [
    resolve(process.argv[1])
  ]);
} else {
  app.setAsDefaultProtocolClient('appbuilder');
}

const gotTheLock = app.requestSingleInstanceLock();
if (gotTheLock) {
  app.on('second-instance', (e, argv) => {
    // Someone tried to run a second instance, we should focus our window.

    // Protocol handler for win32
    // argv: An array of the second instance’s (command line / deep linked) arguments
    if (process.platform == 'win32') {
      // Keep only command line / deep linked arguments
      deeplinkingUrl = argv.slice(1)
    }
    logEverywhere('app.makeSingleInstance# ' + deeplinkingUrl)

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
} 

app.on('will-finish-launching', function() {
  // Protocol handler for osx
  app.on('open-url', function(event, url) {
    event.preventDefault()
    deeplinkingUrl = url
    logEverywhere('open-url# ' + deeplinkingUrl)
  })
})

// Log both at dev console and at running node console instance
function logEverywhere(s) {
  console.log(s)
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
