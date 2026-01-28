const { ipcRenderer } = require("electron");

/* ---------- CONSTANTS ---------- */
const MAX_TABS = 5;
const NEW_TAB = "NEW_TAB";

/* ---------- STATE ---------- */
let tabs = [];
let activeTabIndex = 0;
let isPDFOpen = false;
let readerMode = false;

/* ---------- INIT ---------- */
window.addEventListener("DOMContentLoaded", () => {
  // Start with New Tab
  tabs = [{ url: NEW_TAB }];
  activeTabIndex = 0;

  renderTabs();
  loadActiveTab();
});

/* ---------- CORE LOADER ---------- */
function loadActiveTab() {
  const tab = tabs[activeTabIndex];
  if (!tab) return;

  if (tab.url === NEW_TAB) {
    loadNewTab();
  } else {
    loadWebURL(tab.url);
  }
}

/* ---------- UI LOADERS ---------- */
function loadNewTab() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <iframe
      src="./pages/newtab.html"
      style="width:100%; height:100%; border:none;">
    </iframe>
  `;
}

function loadWebURL(url) {
  const content = document.getElementById("content");
  content.innerHTML = `
    <webview
      id="view"
      src="${url}"
      style="width:100%; height:100%;"
      webpreferences="contextIsolation=no">
    </webview>
  `;
}

/* ---------- TABS ---------- */
function renderTabs() {
  const tabsDiv = document.getElementById("tabs");
  tabsDiv.innerHTML = "";

  tabs.forEach((_, index) => {
    const tab = document.createElement("div");
    tab.className = "tab" + (index === activeTabIndex ? " active" : "");

    const title = document.createElement("span");
    title.innerText = `Tab ${index + 1}`;
    title.onclick = () => switchTab(index);

    const close = document.createElement("span");
    close.innerText = "×";
    close.className = "close";
    close.onclick = (e) => {
      e.stopPropagation();
      closeTab(index);
    };

    tab.appendChild(title);
    tab.appendChild(close);
    tabsDiv.appendChild(tab);
  });

  document.getElementById("tab-info").innerText =
    `Tabs: ${tabs.length} / ${MAX_TABS}`;
}

function newTab() {
  if (tabs.length >= MAX_TABS) {
    alert("Tab limit reached");
    return;
  }

  tabs.push({ url: NEW_TAB });
  activeTabIndex = tabs.length - 1;

  renderTabs();
  loadActiveTab();
}

function switchTab(index) {
  if (index === activeTabIndex) return;

  activeTabIndex = index;
  renderTabs();
  loadActiveTab();
}

function closeTab(index) {
  if (tabs.length === 1) {
    tabs[0].url = NEW_TAB;
    activeTabIndex = 0;
    loadActiveTab();
    renderTabs();
    return;
  }

  tabs.splice(index, 1);

  if (activeTabIndex >= index) {
    activeTabIndex = Math.max(0, activeTabIndex - 1);
  }

  renderTabs();
  loadActiveTab();
}

/* ---------- NAVIGATION ---------- */
function loadURL() {
  const input = document.getElementById("url");
  let url = input.value.trim();

  if (!url) return;
  if (!url.startsWith("http")) url = "https://" + url;

  tabs[activeTabIndex].url = url;
  loadActiveTab();
}

function goBack() {
  const webview = document.getElementById("view");
  if (!webview) return;

  if (webview.canGoBack()) {
    webview.goBack();
  }
}

function goForward() {
  const webview = document.getElementById("view");
  if (!webview) return;

  if (webview.canGoForward()) {
    webview.goForward();
  }
}

/* ---------- PDF ---------- */
function openPDF() {
  ipcRenderer.send("open-pdf");
}

ipcRenderer.on("load-pdf", (_, pdfPath) => {
  tabs[activeTabIndex].url = `file://${pdfPath}`;
  loadActiveTab();
});

/* ---------- MODES ---------- */
function toggleStudyMode() {
  const topBar = document.getElementById("top-bar");
  const tabsBar = document.getElementById("tabs-bar");

  const hidden = topBar.style.display === "none";
  topBar.style.display = hidden ? "flex" : "none";
  tabsBar.style.display = hidden ? "flex" : "none";
}

function toggleReaderMode() {
  const webview = document.getElementById("view");
  if (!webview) return;

  readerMode = !readerMode;
  if (!readerMode) return;

  function navigateFromNewTab(value) {
  let url = value.trim();

  if (!url) return;

  // If user types a domain or text
  if (!url.startsWith("http")) {
    // Treat as search
    url = "https://www.google.com/search?q=" + encodeURIComponent(url);
  }

  tabs[activeTabIndex].url = url;
  loadActiveTab();
}


  webview.executeJavaScript(`
    (function () {
      document.body.style.background = "#fdfdfd";
      document.body.style.color = "#000";
      document.body.style.fontSize = "18px";
      document.body.style.lineHeight = "1.7";
      document.body.style.padding = "40px";
      document.body.style.maxWidth = "800px";
      document.body.style.margin = "auto";

      document.querySelectorAll(
        "nav, header, footer, aside, iframe, .ads, .ad, .sidebar"
      ).forEach(e => e.remove());
    })();
  `);
}

/* ---------- NEW TAB MESSAGE LISTENER ---------- */
window.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "NAVIGATE") return;

  navigateFromNewTab(event.data.url);
});


function navigateFromNewTab(value) {
  let url = value.trim();
  if (!url) return;

  // If user typed text or domain
  if (!url.startsWith("http")) {
    url = "https://www.google.com/search?q=" + encodeURIComponent(url);
  }

  tabs[activeTabIndex].url = url;
  loadActiveTab();
}


/* ---------- EXPORTS ---------- */
window.newTab = newTab;
window.loadURL = loadURL;
window.goBack = goBack;
window.goForward = goForward;
window.openPDF = openPDF;
window.toggleStudyMode = toggleStudyMode;
window.toggleReaderMode = toggleReaderMode;
