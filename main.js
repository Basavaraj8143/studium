const { app, BrowserWindow, dialog, ipcMain } = require("electron");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
}

ipcMain.on("open-pdf", async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openFile"],
    filters: [
      { name: "PDF Files", extensions: ["pdf"] }
    ]
  });

  if (!result.canceled) {
    const pdfPath = result.filePaths[0];
    win.webContents.send("load-pdf", pdfPath);
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
