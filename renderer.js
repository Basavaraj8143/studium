const { ipcRenderer } = require("electron");

const MAX_TABS = 5;

let tabs = [];
let activeTabIndex = 0;
let isPDFOpen = false;
let readerMode = false;

/* ---------- INIT ---------- */
window.onload = () => {
  tabs.push({ url: "https://google.com" });
  loadActiveTab();
  renderTabs();
};

/* ---------- TAB CORE ---------- */
function loadActiveTab() {
  const webview = document.getElementById("view");
  webview.loadURL(tabs[activeTabIndex].url);
}

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
    alert("Tab limit reached .");
    return;
  }

  tabs.push({ url: "https://example.com" });
  activeTabIndex = tabs.length - 1;
  loadActiveTab();
  renderTabs();
}

function switchTab(index) {
  if (index === activeTabIndex) return;

  if (isPDFOpen) {
    cleanupPDF(() => {
      activeTabIndex = index;
      loadActiveTab();
      renderTabs();
    });
  } else {
    activeTabIndex = index;
    loadActiveTab();
    renderTabs();
  }
}
function closeTab(index) {
  if (tabs.length === 1) {
    // Always keep at least one tab
    tabs[0].url = "https://example.com";
    activeTabIndex = 0;
    loadActiveTab();
    renderTabs();
    return;
  }

  if (index === activeTabIndex) {
    if (isPDFOpen) {
      cleanupPDF(() => removeTab(index));
    } else {
      removeTab(index);
    }
  } else {
    removeTab(index);
  }
}

function removeTab(index) {
  tabs.splice(index, 1);

  if (activeTabIndex >= index) {
    activeTabIndex = Math.max(0, activeTabIndex - 1);
  }

  loadActiveTab();
  renderTabs();
}


/* ---------- NAVIGATION ---------- */
function loadURL() {
  const input = document.getElementById("url");
  let url = input.value.trim();

  if (!url.startsWith("http")) url = "https://" + url;

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

function goBack() {
  const webview = document.getElementById("view");
  if (webview.canGoBack()) webview.goBack();
}

function goForward() {
  const webview = document.getElementById("view");
  if (webview.canGoForward()) webview.goForward();
}

/* ---------- PDF ---------- */
function openPDF() {
  ipcRenderer.send("open-pdf");
}

ipcRenderer.on("load-pdf", (_, pdfPath) => {
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

        document.querySelectorAll(
          "nav, header, footer, aside, iframe, .ads, .ad, .sidebar"
        ).forEach(e => e.remove());
      })();
    `);
  } else {
    webview.reload();
  }
}
