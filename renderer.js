const { ipcRenderer } = require("electron");



const DISCARD_AFTER_MS = 5 * 60 * 1000; // 5 minutes
const DISCARD_CHECK_INTERVAL = 30 * 1000; // check every 30s

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
  if (hasPreviousSession()) {
    document.getElementById("restore-bar").style.display = "flex";
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      dismissRestoreBar();
    }, 5000);

    // Start with a clean New Tab until user decides
    tabs = [{
      url: NEW_TAB,
      title: "New Tab",
      lastActive: Date.now(),
      discarded: false
    }];
    activeTabIndex = 0;

    renderTabs();
    loadActiveTab();
  } else {
    restoreSession();   // normal flow
    renderTabs();
    loadActiveTab();
  }

  setInterval(discardInactiveTabs, DISCARD_CHECK_INTERVAL);
});

/* ---------- CORE LOADER ---------- */
function loadActiveTab() {

  tabs[activeTabIndex].lastActive = Date.now();
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

  tabs[activeTabIndex].title = "New Tab";
  renderTabs();

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

  const webview = document.getElementById("view");

  // Update title when page title changes
  webview.addEventListener("page-title-updated", (e) => {
    tabs[activeTabIndex].title = e.title || "Untitled";
    renderTabs();
  });
}

/* ---------- TABS ---------- */

function discardInactiveTabs() {
  const now = Date.now();

  tabs.forEach((tab, index) => {
    if (
      index !== activeTabIndex &&          // never discard active tab
      !tab.discarded &&
      now - tab.lastActive > DISCARD_AFTER_MS
    ) {
      tab.discarded = true;
      console.log("Discarding tab:", tab.title);
    }
  });

  renderTabs();
}

function discardTab(index) {
  if (index === activeTabIndex) return; // never discard active tab

  tabs[index].discarded = true;
  tabs[index].lastActive = Date.now();

  renderTabs();
  saveSession();
}

function renderTabs() {
  const tabsDiv = document.getElementById("tabs");
  tabsDiv.innerHTML = "";

  tabs.forEach((_, index) => {
    const tab = document.createElement("div");
    tab.className = "tab" + (index === activeTabIndex ? " active" : "");

    if (tabs[index].discarded) {
      tab.style.opacity = "0.6";
    }

    const title = document.createElement("span");
    title.className = "title";
    title.innerText = tabs[index].title || `Tab ${index + 1}`;

    if (tabs[index].discarded) {
      title.innerText = "⏸ " + title.innerText;
    }

    title.onclick = () => switchTab(index);

    const discardBtn = document.createElement("span");
    discardBtn.innerText = "🧊";
    discardBtn.title = "Discard tab";
    discardBtn.style.cursor = "pointer";
    discardBtn.onclick = (e) => {
      e.stopPropagation();
      discardTab(index);
    };

    const close = document.createElement("span");
    close.innerText = "×";
    close.className = "close";
    close.onclick = (e) => {
      e.stopPropagation();
      closeTab(index);
    };

    tab.appendChild(title);
    tab.appendChild(discardBtn);
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

tabs.push({
  url: NEW_TAB,
  title: "New Tab",
  lastActive: Date.now(),
  discarded: false
});
activeTabIndex = tabs.length - 1;

  renderTabs();
  loadActiveTab();
  saveSession();
}

function switchTab(index) {
  if (index === activeTabIndex) return;

  activeTabIndex = index;
  tabs[index].lastActive = Date.now();

  if (tabs[index].discarded) {
    tabs[index].discarded = false;
  }

  renderTabs();
  loadActiveTab();
  saveSession();
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
  saveSession();
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
  tabs[activeTabIndex].title = "PDF: " + pdfPath.split("\\").pop();
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

/* ---------- restore sessions  ---------- */

function hasPreviousSession() {
  const raw = localStorage.getItem("lastSession");
  if (!raw) return false;

  try {
    const session = JSON.parse(raw);
    if (!session.tabs || session.tabs.length === 0) return false;
    
    // Don't consider it a "previous session" if it's just the default new tab
    if (session.tabs.length === 1) {
      const tab = session.tabs[0];
      if (tab.url === NEW_TAB && tab.title === "New Tab") {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

function restoreSession() {
  const raw = localStorage.getItem("lastSession");

  if (!raw) {
    tabs = [{
      url: NEW_TAB,
      title: "New Tab",
      lastActive: Date.now(),
      discarded: false
    }];
    activeTabIndex = 0;
    return;
  }

  const session = JSON.parse(raw);

  const activeIndex = session.activeTabIndex || 0;

  tabs = session.tabs.map((t, index) => ({
    url: t.url,
    title: t.title,
    lastActive: Date.now(),
    discarded: index !== activeIndex  // Only discard non-active tabs
  }));

  activeTabIndex = activeIndex;
}

function saveSession() {
  const sessionData = {
    tabs: tabs.map(t => ({
      url: t.url,
      title: t.title,
      discarded: true   // restore everything as discarded
    })),
    activeTabIndex
  };

  localStorage.setItem("lastSession", JSON.stringify(sessionData));
}

function restorePreviousSession() {
  document.getElementById("restore-bar").style.display = "none";

  restoreSession();
  renderTabs();
  loadActiveTab();
}

function startFresh() {
  document.getElementById("restore-bar").style.display = "none";
  localStorage.removeItem("lastSession");
}

function dismissRestoreBar() {
  const bar = document.getElementById("restore-bar");
  if (bar) {
    bar.style.display = "none";
  }
}




/* ---------- EXPORTS ---------- */
window.newTab = newTab;
window.loadURL = loadURL;
window.goBack = goBack;
window.goForward = goForward;
window.openPDF = openPDF;
window.toggleStudyMode = toggleStudyMode;
window.toggleReaderMode = toggleReaderMode;
window.restorePreviousSession = restorePreviousSession;
window.startFresh = startFresh;
window.dismissRestoreBar = dismissRestoreBar;
