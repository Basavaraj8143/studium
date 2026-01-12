const { ipcRenderer } = require("electron");

let isPDFOpen = false;

function loadURL() {
  const input = document.getElementById("url");
  const webview = document.getElementById("view");

  let url = input.value;
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  // If a PDF was open, clean it before loading site
  if (isPDFOpen) {
    cleanupPDF();
  }

  webview.loadURL(url);
}

function openPDF() {
  ipcRenderer.send("open-pdf");
}

// Receive PDF path from main process
ipcRenderer.on("load-pdf", (event, pdfPath) => {
  const webview = document.getElementById("view");
  isPDFOpen = true;
  webview.loadURL(`file://${pdfPath}`);
});

// Cleanup function
function cleanupPDF() {
  const webview = document.getElementById("view");

  // Stop loading
  webview.stop();

  // Force reload to blank page
  webview.loadURL("about:blank");

  isPDFOpen = false;
}

let studyMode = false;

function toggleStudyMode() {
  const topBar = document.getElementById("top-bar");

  studyMode = !studyMode;

  if (studyMode) {
    topBar.style.display = "none";
  } else {
    topBar.style.display = "flex";
  }
}
