const { ipcRenderer } = require("electron");



const DISCARD_AFTER_MS = 5 * 60 * 1000; // 5 minutes
const DISCARD_CHECK_INTERVAL = 30 * 1000; // check every 30s

/* ---------- CONSTANTS ---------- */
const MAX_TABS = 5;
const NEW_TAB = "NEW_TAB";
const SSH_PROFILES_KEY = "ssh_profiles";
const SSH_FEATURES_ENABLED_KEY = "ssh_features_enabled";

/* ---------- STATE ---------- */
let tabs = [];
let activeTabIndex = 0;
let isPDFOpen = false;
let readerMode = false;
let restoreBarDisplayBeforeStudy = null;
let topBarDisplayBeforeStudy = null;
let tabsBarDisplayBeforeStudy = null;
let studyMode = false;
let sshProfiles = [];
let editingProfileId = null;
let sshFeaturesEnabled = false;

/* ---------- INIT ---------- */
window.addEventListener("DOMContentLoaded", () => {
  const studyIndicator = document.getElementById("study-indicator");
  if (studyIndicator) {
    studyIndicator.addEventListener("click", () => {
      if (studyMode) toggleStudyMode();
    });
  }

  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  if (menuBtn && menu) {
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
    };

    document.body.addEventListener("click", () => {
      menu.classList.add("hidden");
    });
  }

  const settingsClose = document.getElementById("settings-close");
  const settingsBackdrop = document.querySelector(
    "#settings-modal .modal-backdrop"
  );
  if (settingsClose) {
    settingsClose.addEventListener("click", closeSettings);
  }
  if (settingsBackdrop) {
    settingsBackdrop.addEventListener("click", closeSettings);
  }

  const sshToggle = document.getElementById("ssh-features-toggle");
  sshFeaturesEnabled = loadSSHFeaturesEnabled();
  if (sshToggle) {
    sshToggle.checked = sshFeaturesEnabled;
    sshToggle.addEventListener("change", () => {
      sshFeaturesEnabled = sshToggle.checked;
      saveSSHFeaturesEnabled();
      applySSHFeatureState();
      if (!sshFeaturesEnabled) {
        closeSSHProfiles();
      }
    });
  }

  applySSHFeatureState();

  const sshModalClose = document.getElementById("ssh-profiles-close");
  const sshModalBackdrop = document.querySelector(
    "#ssh-profiles-modal .modal-backdrop"
  );
  if (sshModalClose) {
    sshModalClose.addEventListener("click", closeSSHProfiles);
  }
  if (sshModalBackdrop) {
    sshModalBackdrop.addEventListener("click", closeSSHProfiles);
  }

  const sshAddBtn = document.getElementById("ssh-add-profile");
  const sshAddBtnBottom = document.getElementById("ssh-add-profile-bottom");
  if (sshAddBtn) {
    sshAddBtn.addEventListener("click", () => {
      showSSHProfileForm();
    });
  }
  if (sshAddBtnBottom) {
    sshAddBtnBottom.addEventListener("click", () => {
      showSSHProfileForm();
    });
  }

  const sshCancelBtn = document.getElementById("ssh-cancel-profile");
  if (sshCancelBtn) {
    sshCancelBtn.addEventListener("click", () => {
      showSSHProfilesListView();
    });
  }

  const sshSaveBtn = document.getElementById("ssh-save-profile");
  if (sshSaveBtn) {
    sshSaveBtn.addEventListener("click", saveSSHProfileFromForm);
  }

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
      discarded: false,
      isLoading: false
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

function setTabLoading(index, isLoading) {
  const tab = tabs[index];
  if (!tab) return;
  if (tab.isLoading === isLoading) return;
  tab.isLoading = isLoading;
  renderTabs();
}

async function getActiveWebviewMemoryMB() {
  const webview = document.getElementById("view");
  if (!webview) {
    return { ok: false, reason: "webview-not-found" };
  }

  const canGetWebContentsId = typeof webview.getWebContentsId === "function";
  const canGetPid = typeof webview.getProcessId === "function";
  if (!canGetWebContentsId && !canGetPid) {
    return { ok: false, reason: "webview-api-unavailable" };
  }

  let webContentsId = null;
  let pid = null;

  try {
    if (canGetWebContentsId) {
      const candidate = Number(webview.getWebContentsId());
      if (Number.isInteger(candidate) && candidate > 0) {
        webContentsId = candidate;
      }
    }
  } catch {
    // fallback to pid
  }

  try {
    if (canGetPid) {
      const candidatePid = Number(webview.getProcessId());
      if (Number.isInteger(candidatePid) && candidatePid > 0) {
        pid = candidatePid;
      }
    }
  } catch {
    // fallback to other pid sources
  }

  try {
    if (typeof webview.getOSProcessId === "function") {
      const candidateOsPid = Number(webview.getOSProcessId());
      if (Number.isInteger(candidateOsPid) && candidateOsPid > 0) {
        pid = candidateOsPid;
      }
    }
  } catch {
    // keep current pid value
  }

  if (webContentsId === null && pid === null) {
    return { ok: false, reason: "ids-not-available" };
  }

  try {
    const result = await ipcRenderer.invoke("tab-memory-usage", { webContentsId, pid });
    if (!result || !result.ok || typeof result.memoryMB !== "number") {
      return {
        ok: false,
        reason: (result && result.reason) || "memory-not-available"
      };
    }
    return { ok: true, memoryMB: result.memoryMB };
  } catch {
    return { ok: false, reason: "ipc-failed" };
  }
}

async function updateCloseTooltip(index, closeEl) {
  if (!closeEl) return;

  if (index !== activeTabIndex) {
    closeEl.title = "Close tab (RAM: active tab only)";
    return;
  }

  const tab = tabs[activeTabIndex];
  if (!tab || tab.url === NEW_TAB) {
    closeEl.title = "Close tab (RAM: not available on New Tab)";
    return;
  }

  closeEl.title = "Close tab (RAM: checking...)";
  const result = await getActiveWebviewMemoryMB();

  if (!closeEl.isConnected || index !== activeTabIndex) return;

  if (!result.ok) {
    closeEl.title = `Close tab (RAM: unavailable - ${result.reason})`;
    return;
  }

  closeEl.title = `Close tab (RAM: ${result.memoryMB.toFixed(1)} MB)`;
}

/* ---------- UI LOADERS ---------- */
function loadNewTab() {

  tabs[activeTabIndex].title = "New Tab";
  setTabLoading(activeTabIndex, false);
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
  const tabIndex = activeTabIndex;
  setTabLoading(tabIndex, true);

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

  if (!webview) {
    setTabLoading(tabIndex, false);
    return;
  }

  // Update title when page title changes
  webview.addEventListener("page-title-updated", (e) => {
    if (!tabs[tabIndex]) return;
    tabs[tabIndex].title = e.title || "Untitled";
    renderTabs();
  });

  // Ensure links that would open a new window load in the same webview
  webview.addEventListener("new-window", (e) => {
    e.preventDefault();
    if (!tabs[tabIndex]) return;
    const nextURL = e.url;
    tabs[tabIndex].url = nextURL;
    setTabLoading(tabIndex, true);
    webview.loadURL(nextURL);
    saveSession();
    renderTabs();
  });

  // Keep the tab URL in sync when navigation occurs
  webview.addEventListener("will-navigate", (e) => {
    if (!tabs[tabIndex]) return;
    tabs[tabIndex].url = e.url;
    setTabLoading(tabIndex, true);
    saveSession();
  });

  webview.addEventListener("did-start-loading", () => {
    setTabLoading(tabIndex, true);
  });

  webview.addEventListener("did-stop-loading", () => {
    setTabLoading(tabIndex, false);
  });

  webview.addEventListener("did-fail-load", () => {
    setTabLoading(tabIndex, false);
  });

  // DOM ready: override window.open and catch _blank links inside the page
  webview.addEventListener('dom-ready', () => {
    try {
      webview.executeJavaScript(`
        (function(){
          window.open = function(url){ window.location = url; };
          document.addEventListener('click', function(e){
            const a = e.target.closest && e.target.closest('a');
            if (!a) return;
            if (a.target === '_blank'){
              e.preventDefault();
              window.location = a.href;
            }
          }, true);
        })();
      `);
    } catch (err) {
      console.warn('Failed to inject link override into webview', err);
    }
  });

  // Allow study mode toggle even when focus is inside the webview
  webview.addEventListener("before-input-event", (event) => {
    const input = event.input || event;
    if (!input) return;
    if (input.type && input.type !== "keyDown") return;

    const key = (input.key || "").toLowerCase();
    if (input.control && input.shift && key === "s") {
      if (typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      toggleStudyMode();
    }
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

    title.onclick = () => switchTab(index);

    const status = document.createElement("span");
    status.className = "status";
    if (tabs[index].isLoading) {
      status.classList.add("loading");
      status.title = "Loading...";
      status.setAttribute("aria-label", "Loading");
    } else {
      status.classList.add("discard");
      status.innerText = "\uD83E\uDDCA";
      if (index === activeTabIndex) {
        status.classList.add("disabled");
        status.title = "Cannot discard active tab";
      } else {
        status.title = "Discard tab";
        status.onclick = (e) => {
          e.stopPropagation();
          discardTab(index);
        };
      }
    }

    const close = document.createElement("span");
    close.innerText = "x";
    close.className = "close";
    close.title = "Close tab";
    close.onmouseenter = () => {
      updateCloseTooltip(index, close);
    };
    close.onmouseleave = () => {
      close.title = "Close tab";
    };
    close.onclick = (e) => {
      e.stopPropagation();
      closeTab(index);
    };

    tab.appendChild(title);
    tab.appendChild(status);
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
  discarded: false,
  isLoading: false
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

function refreshPage() {
  const activeTab = tabs[activeTabIndex];
  if (!activeTab) return;

  // New Tab is rendered as a local iframe.
  if (activeTab.url === NEW_TAB) {
    const refreshTabIndex = activeTabIndex;
    const iframe = document.querySelector("#content iframe");
    if (iframe && iframe.contentWindow) {
      setTabLoading(refreshTabIndex, true);
      iframe.contentWindow.location.reload();
      setTimeout(() => setTabLoading(refreshTabIndex, false), 150);
    } else {
      loadNewTab();
    }
    return;
  }

  const webview = document.getElementById("view");
  if (webview) {
    setTabLoading(activeTabIndex, true);
    webview.reload();
    return;
  }

  loadActiveTab();
}

/* ---------- PDF ---------- */
function openPDF() {
  ipcRenderer.send("open-pdf");
}

ipcRenderer.on("load-pdf", (_, pdfPath) => {
  tabs[activeTabIndex].url = `file://${pdfPath}`;
  tabs[activeTabIndex].title = "PDF: " + pdfPath.split("\\").pop();
  setTabLoading(activeTabIndex, true);
  loadActiveTab();
});

/* ---------- MODES ---------- */
function toggleStudyMode() {
  const topBar = document.getElementById("top-bar");
  const tabsBar = document.getElementById("tabs-bar");
  const restoreBar = document.getElementById("restore-bar");
  const studyIndicator = document.getElementById("study-indicator");

  if (!topBar || !tabsBar) return;

  if (!studyMode) {
    topBarDisplayBeforeStudy = getComputedStyle(topBar).display;
    tabsBarDisplayBeforeStudy = getComputedStyle(tabsBar).display;
    if (restoreBar) {
      restoreBarDisplayBeforeStudy = getComputedStyle(restoreBar).display;
      restoreBar.style.display = "none";
    }
    if (studyIndicator) {
      studyIndicator.style.display = "flex";
      studyIndicator.classList.remove("glow");
      void studyIndicator.offsetWidth;
      studyIndicator.classList.add("glow");
    }

    topBar.style.display = "none";
    tabsBar.style.display = "none";
    studyMode = true;
    return;
  }

  topBar.style.display = topBarDisplayBeforeStudy || "flex";
  tabsBar.style.display = tabsBarDisplayBeforeStudy || "flex";
  if (restoreBar) {
    restoreBar.style.display = restoreBarDisplayBeforeStudy || "none";
  }
  if (studyIndicator) {
    studyIndicator.style.display = "none";
    studyIndicator.classList.remove("glow");
  }
  studyMode = false;
}

function toggleReaderMode() {
  const webview = document.getElementById("view");
  if (!webview) return;

  readerMode = !readerMode;

  if (readerMode) {
    // ENABLE reader mode
    webview.executeJavaScript(`
      (function () {
        document.body.setAttribute("data-reader-mode", "true");

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
    // DISABLE reader mode → reload page cleanly
    webview.reload();
  }
}

function openSSHInfo() {
  alert(
    "SSH is an advanced experimental feature.\n" +
    "It is disabled by default to preserve low memory usage.\n\n" +
    "You can enable it in future versions."
  );
}

function loadSSHFeaturesEnabled() {
  const raw = localStorage.getItem(SSH_FEATURES_ENABLED_KEY);
  if (!raw) return false;
  try {
    return JSON.parse(raw) === true;
  } catch {
    return false;
  }
}

function saveSSHFeaturesEnabled() {
  localStorage.setItem(
    SSH_FEATURES_ENABLED_KEY,
    JSON.stringify(sshFeaturesEnabled)
  );
}

function applySSHFeatureState() {
  const sshProfilesItem = document.getElementById("menu-ssh-profiles");
  const sshTerminalItem = document.getElementById("menu-ssh-terminal");

  if (sshProfilesItem) {
    sshProfilesItem.classList.toggle("disabled", !sshFeaturesEnabled);
    sshProfilesItem.setAttribute("aria-disabled", String(!sshFeaturesEnabled));
  }

  if (sshTerminalItem) {
    sshTerminalItem.classList.toggle("disabled", !sshFeaturesEnabled);
    sshTerminalItem.setAttribute("aria-disabled", String(!sshFeaturesEnabled));
  }
}

function openSettings() {
  const modal = document.getElementById("settings-modal");
  if (!modal) return;

  const menu = document.getElementById("menu");
  if (menu) {
    menu.classList.add("hidden");
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeSettings() {
  const modal = document.getElementById("settings-modal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function loadSSHProfiles() {
  const raw = localStorage.getItem(SSH_PROFILES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSSHProfiles() {
  localStorage.setItem(SSH_PROFILES_KEY, JSON.stringify(sshProfiles));
}

function openSSHProfiles() {
  if (!sshFeaturesEnabled) {
    alert("SSH features are disabled. Turn them on in Settings to use SSH Profiles.");
    return;
  }

  const modal = document.getElementById("ssh-profiles-modal");
  if (!modal) return;

  sshProfiles = loadSSHProfiles();
  showSSHProfilesListView();

  const menu = document.getElementById("menu");
  if (menu) {
    menu.classList.add("hidden");
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeSSHProfiles() {
  const modal = document.getElementById("ssh-profiles-modal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  editingProfileId = null;
}

function showSSHProfilesListView() {
  const listView = document.getElementById("ssh-profiles-list-view");
  const formView = document.getElementById("ssh-profiles-form-view");
  const title = document.getElementById("ssh-profiles-title");
  if (listView) listView.classList.remove("hidden");
  if (formView) formView.classList.add("hidden");
  if (title) title.textContent = "SSH Profiles";
  editingProfileId = null;
  renderSSHProfilesList();
}

function showSSHProfileForm(profile = null) {
  const listView = document.getElementById("ssh-profiles-list-view");
  const formView = document.getElementById("ssh-profiles-form-view");
  const title = document.getElementById("ssh-profiles-title");
  if (listView) listView.classList.add("hidden");
  if (formView) formView.classList.remove("hidden");
  if (title) title.textContent = profile ? "Edit SSH Profile" : "Add SSH Profile";

  const nameInput = document.getElementById("ssh-profile-name");
  const hostInput = document.getElementById("ssh-profile-host");
  const portInput = document.getElementById("ssh-profile-port");
  const userInput = document.getElementById("ssh-profile-username");
  const keyPathInput = document.getElementById("ssh-profile-keypath");
  const authKey = document.getElementById("ssh-auth-key");

  if (profile) {
    if (nameInput) nameInput.value = profile.name || "";
    if (hostInput) hostInput.value = profile.host || "";
    if (portInput) portInput.value = profile.port || 22;
    if (userInput) userInput.value = profile.username || "";
    if (keyPathInput) keyPathInput.value = profile.keyPath || "";
    if (authKey) authKey.checked = true;
    editingProfileId = profile.id;
  } else {
    if (nameInput) nameInput.value = "";
    if (hostInput) hostInput.value = "";
    if (portInput) portInput.value = 22;
    if (userInput) userInput.value = "";
    if (keyPathInput) keyPathInput.value = "";
    if (authKey) authKey.checked = true;
    editingProfileId = null;
  }
}

function renderSSHProfilesList() {
  const emptyState = document.getElementById("ssh-profiles-empty");
  const list = document.getElementById("ssh-profiles-list");
  const addBottom = document.getElementById("ssh-add-profile-bottom");
  if (!list || !emptyState) return;

  list.innerHTML = "";

  if (sshProfiles.length === 0) {
    emptyState.classList.remove("hidden");
    list.classList.add("hidden");
    if (addBottom) addBottom.classList.add("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  list.classList.remove("hidden");
  if (addBottom) addBottom.classList.remove("hidden");

  sshProfiles.forEach((profile) => {
    const card = document.createElement("div");
    card.className = "profile-card";

    const title = document.createElement("div");
    title.className = "profile-title";
    title.textContent = profile.name || "Untitled Profile";

    const meta = document.createElement("div");
    meta.className = "profile-meta";
    const port = profile.port || 22;
    meta.textContent = `${profile.username}@${profile.host}:${port}`;

    const auth = document.createElement("div");
    auth.className = "profile-meta";
    auth.textContent = "Auth: SSH Key";

    const actions = document.createElement("div");
    actions.className = "profile-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn";
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      showSSHProfileForm(profile);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      const ok = confirm(`Delete profile "${profile.name}"?`);
      if (!ok) return;
      sshProfiles = sshProfiles.filter((p) => p.id !== profile.id);
      saveSSHProfiles();
      renderSSHProfilesList();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(auth);
    card.appendChild(actions);
    list.appendChild(card);
  });
}

function saveSSHProfileFromForm() {
  const nameInput = document.getElementById("ssh-profile-name");
  const hostInput = document.getElementById("ssh-profile-host");
  const portInput = document.getElementById("ssh-profile-port");
  const userInput = document.getElementById("ssh-profile-username");
  const keyPathInput = document.getElementById("ssh-profile-keypath");

  const name = nameInput ? nameInput.value.trim() : "";
  const host = hostInput ? hostInput.value.trim() : "";
  const username = userInput ? userInput.value.trim() : "";
  const keyPath = keyPathInput ? keyPathInput.value.trim() : "";

  const portRaw = portInput ? portInput.value.trim() : "";
  const port = portRaw ? Number(portRaw) : 22;

  if (!name || !host || !username) {
    alert("Profile Name, Host, and Username are required.");
    return;
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    alert("Port must be a number between 1 and 65535.");
    return;
  }

  if (editingProfileId) {
    const index = sshProfiles.findIndex((p) => p.id === editingProfileId);
    if (index !== -1) {
      sshProfiles[index] = {
        ...sshProfiles[index],
        name,
        host,
        port,
        username,
        auth: "ssh-key",
        keyPath
      };
    }
  } else {
    sshProfiles.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      host,
      port,
      username,
      auth: "ssh-key",
      keyPath
    });
  }

  saveSSHProfiles();
  showSSHProfilesListView();
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



/* ---------- KEYBOARD SHORTCUTS ---------- */
document.addEventListener("keydown", (e) => {

  const sshModal = document.getElementById("ssh-profiles-modal");
  if (e.key === "Escape" && sshModal && !sshModal.classList.contains("hidden")) {
    e.preventDefault();
    closeSSHProfiles();
    return;
  }

  const settingsModal = document.getElementById("settings-modal");
  if (e.key === "Escape" && settingsModal && !settingsModal.classList.contains("hidden")) {
    e.preventDefault();
    closeSettings();
    return;
  }


  // New Tab
  if (e.ctrlKey && e.key === "t") {
    e.preventDefault();
    newTab();
  }

  // Close Tab
  if (e.ctrlKey && e.key === "w") {
    e.preventDefault();
    closeTab(activeTabIndex);
  }

  // Focus URL bar
  if (e.ctrlKey && e.key === "l") {
    e.preventDefault();
    document.getElementById("url").focus();
  }

  // Back
  if (e.altKey && e.key === "ArrowLeft") {
    e.preventDefault();
    goBack();
  }

  // Forward
  if (e.altKey && e.key === "ArrowRight") {
    e.preventDefault();
    goForward();
  }

  // Refresh
  if (((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "r") || e.key === "F5") {
    e.preventDefault();
    refreshPage();
  }

  // Study Mode
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    toggleStudyMode();
  }

  // Reader Mode
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "r") {
    e.preventDefault();
    toggleReaderMode();
  }

  // Open PDF
  if (e.ctrlKey && e.key.toLowerCase() === "o") {
    e.preventDefault();
    openPDF();
  }
});


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
      discarded: false,
      isLoading: false
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
    discarded: index !== activeIndex,  // Only discard non-active tabs
    isLoading: false
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
window.refreshPage = refreshPage;
window.openPDF = openPDF;
window.toggleStudyMode = toggleStudyMode;
window.toggleReaderMode = toggleReaderMode;
window.restorePreviousSession = restorePreviousSession;
window.startFresh = startFresh;
window.dismissRestoreBar = dismissRestoreBar;
window.openSSHInfo = openSSHInfo;
window.openSSHProfiles = openSSHProfiles;
window.openSettings = openSettings;
