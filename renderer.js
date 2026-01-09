function loadURL() {
  const input = document.getElementById("url");
  const webview = document.getElementById("view");

  let url = input.value;

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  webview.loadURL(url);
}

const { ipcRenderer } = require("electron");

function loadURL() {
  const input = document.getElementById("url");
  const webview = document.getElementById("view");

  let url = input.value;
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  webview.loadURL(url);
}

function openPDF() {
  ipcRenderer.send("open-pdf");
}
ipcRenderer.on("load-pdf", (event, pdfPath) => {
  const webview = document.getElementById("view");
  webview.loadURL(`file://${pdfPath}`);
});
