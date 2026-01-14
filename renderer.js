const { ipcRenderer } = require("electron");

const MAX_TABS = 5;

let tabs = [];
let activeTabIndex = 0;
let isPDFOpen = false;

// Initial tab
window.onload = () => {
  tabs.push({ url: "https://example.com" });
  loadActiveTab();
  updateTabInfo();
};

function loadActiveTab() {
  const webview = document.getElementById("view");
  webview.loadURL(tabs[activeTabIndex].url);
}

function updateTabInfo() {
  document.getElementById("tab-info").innerText =
    `Tabs: ${tabs.length} / ${MAX_TABS}`;
}

function newTab() {
  if (tabs.length >= MAX_TABS) {
    alert("Tab limit reached. Close a tab to open a new one.");
    return;
  }

  tabs.push({ url: "https://example.com" });
  activeTabIndex = tabs.length - 1;
  loadActiveTab();
  updateTabInfo();
}

function loadURL() {
  const input = document.getElementById("url");
  let url = input.value;

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  if (isPDFOpen) {
    cleanupPDF(() => {
      tabs[activeTabIndex].url = url;
      loadActiveTab();
    });
  } else {
    tabs[activeTabIndex].url = url;
    loadActiveTab();
  }
}

function openPDF() {
  ipcRenderer.send("open-pdf");
}

ipcRenderer.on("load-pdf", (event, pdfPath) => {
  isPDFOpen = true;
  tabs[activeTabIndex].url = `file://${pdfPath}`;
  loadActiveTab();
});

function cleanupPDF(callback) {
  const webview = document.getElementById("view");
  webview.stop();
  webview.loadURL("about:blank");

  setTimeout(() => {
    isPDFOpen = false;
    if (callback) callback();
  }, 300);
}

function toggleStudyMode() {
  const topBar = document.getElementById("top-bar");
  const tabsBar = document.getElementById("tabs-bar");

  const hidden = topBar.style.display === "none";

  topBar.style.display = hidden ? "flex" : "none";
  tabsBar.style.display = hidden ? "flex" : "none";
}
let readerMode = false;

function toggleReaderMode() {
  const webview = document.getElementById("view");

  readerMode = !readerMode;

  if (readerMode) {
    webview.executeJavaScript(`
      (function () {
        document.body.style.background = "#fdfdfd";
        document.body.style.color = "#000";
        document.body.style.fontSize = "18px";
        document.body.style.lineHeight = "1.7";
        document.body.style.padding = "40px";
        document.body.style.maxWidth = "800px";
        document.body.style.margin = "auto";

        const unwanted = document.querySelectorAll(
          "nav, header, footer, aside, iframe, ads, .ads, .ad, .sidebar"
        );
        unwanted.forEach(el => el.remove());
      })();
    `);
  } else {
    // Reload page to restore original content
    webview.reload();
  }
}
