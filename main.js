const { app, BrowserWindow, dialog, ipcMain, webContents } = require("electron");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
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

ipcMain.handle("tab-memory-usage", async (_, payload) => {
  const id = Number(payload && payload.webContentsId);
  const explicitPid = Number(payload && payload.pid);

  let resolvedPid = null;
  let targetContents = null;

  if (Number.isInteger(id) && id > 0) {
    targetContents = webContents.fromId(id) || null;
  }

  if (targetContents) {
    try {
      if (typeof targetContents.getProcessMemoryInfo === "function") {
        const mem = await targetContents.getProcessMemoryInfo();
        const kb =
          typeof mem.private === "number" ? mem.private :
          typeof mem.residentSet === "number" ? mem.residentSet :
          typeof mem.workingSetSize === "number" ? mem.workingSetSize :
          null;

        if (typeof kb === "number") {
          return { ok: true, memoryMB: kb / 1024 };
        }
      }
    } catch {
      // fall through to app metrics
    }

    let pid = null;
    if (typeof targetContents.getOSProcessId === "function") {
      pid = Number(targetContents.getOSProcessId());
    }
    if (!Number.isInteger(pid) || pid <= 0) {
      pid = Number(targetContents.getProcessId());
    }
    if (Number.isInteger(pid) && pid > 0) {
      resolvedPid = pid;
    }
  }

  if (resolvedPid === null && Number.isInteger(explicitPid) && explicitPid > 0) {
    resolvedPid = explicitPid;
  }

  if (resolvedPid === null) {
    return { ok: false, reason: "pid-not-available" };
  }

  const metric = app.getAppMetrics().find((item) => item.pid === resolvedPid);
  if (!metric || !metric.memory) {
    return { ok: false, reason: "metric-not-found" };
  }

  const kb =
    typeof metric.memory.workingSetSize === "number" ? metric.memory.workingSetSize :
    typeof metric.memory.privateBytes === "number" ? metric.memory.privateBytes / 1024 :
    null;

  if (typeof kb !== "number") {
    return { ok: false, reason: "memory-not-available" };
  }

  return { ok: true, memoryMB: kb / 1024 };
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }

});
