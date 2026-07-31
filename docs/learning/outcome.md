# 📘 Studium v1 — Engineering Notes & Interview Guide

**Project:** Studium v1 – Lightweight Study Browser
**Version:** 1.0
**Stack:** Electron · HTML · CSS · Vanilla JavaScript · Electron WebView API · Electron IPC · electron-builder

---

## 1. Project Overview

### What is Studium?

Studium is a lightweight desktop browser designed specifically for students who spend long hours reading PDFs, documentation, blogs, and study material.

Instead of trying to replace Chrome or Edge, Studium focuses on reducing distractions and providing a study-oriented browsing experience.

**Core philosophy:**

> "A browser optimized for learning rather than general web browsing."

---

## 2. Problem Statement

Traditional browsers provide numerous features intended for general users:

- Unlimited tabs
- Extensions
- Background processes
- Notifications
- Heavy memory usage
- Multiple background renderers

Students studying from PDFs generally need only a small subset of these features.

Studium attempts to solve this problem by providing:

- Intentional tab limitation
- Reader Mode
- Study Mode
- Lightweight interface
- Session restoration
- PDF-first workflow

---

## 3. Why Electron?

This question is almost guaranteed in interviews.

**Cross-Platform**
Electron applications run on Windows, Linux, and macOS using a single codebase.

**Familiar Technologies**
I already knew HTML, CSS, and JavaScript, so I could focus on product design instead of learning an entirely new GUI framework.

**Chromium Rendering Engine**
Electron ships with Chromium internally, giving:
- Modern HTML/CSS support
- Fast rendering
- PDF rendering
- A stable JavaScript engine

**Node.js Integration**
Electron allows desktop features like file system access, native dialogs, IPC communication, and process management — all required for opening PDFs, saving sessions, and packaging the app.

**Ecosystem**
Electron has mature libraries for packaging, auto-updates, menus, shortcuts, and IPC.

---

## 4. Electron Architecture

Electron consists of two major processes.

### Main Process
Responsibilities:
- Creates the application window
- Opens native dialogs
- Handles IPC
- Packaging
- OS integration

`main.js` contains the `BrowserWindow`, IPC handlers, the PDF dialog, and application lifecycle logic.

### Renderer Process
Responsibilities:
- Browser UI
- Tabs
- Navigation
- Reader Mode
- Study Mode
- Session handling

`renderer.js` contains most of the browser logic.

### IPC

The renderer cannot directly access everything, so communication happens via IPC:

```
Renderer:      "Open PDF" button clicked
      ↓
Main Process:  Native file picker opens
      ↓
Renderer:      Loads the selected PDF
```

---

## 5. Project Architecture

```
Studium

main.js
│
├── BrowserWindow
├── IPC
└── App lifecycle
      ↓
renderer.js
├── Tabs
├── Navigation
├── Reader Mode
├── Study Mode
├── Session Restore
└── Keyboard Shortcuts
      ↓
webview
Loads:
  • Websites
  • PDFs
  • New Tab Page
```

---

## 6. Major Features

**Custom Browser Shell**
Instead of using Chrome directly, I built the URL bar, navigation buttons, tabs, and WebView from scratch.

**New Tab Page**
A custom new tab page with a search box, quick links, and a lightweight UI.

**PDF Support**
Uses Electron's native dialogs:

```
Open PDF → Native dialog → Selected file → Loaded inside WebView
```

**Study Mode**
Reduces distractions by hiding the toolbar and unnecessary UI.

**Reader Mode**
Uses JavaScript injection to remove ads and sidebars, enlarge fonts, and improve spacing.

**Session Restore**
Stores URLs and tab order and restores them after restart. Unlike Chrome, the user is asked before restoring.

**Keyboard Shortcuts**
Implemented shortcuts for New Tab, Close Tab, Reader Mode, and Study Mode.

---

## 7. Problems I Faced

| # | Problem | Root Cause | Solution |
|---|---------|-------------|----------|
| 1 | New tab page wasn't loading | `webview` wasn't ready before calling `loadURL()` | Waited for `dom-ready` and delayed loading |
| 2 | File path issues on Windows | Paths with spaces broke `file://` URLs | Used `path.resolve()` and `encodeURI()` |
| 3 | PDF cleanup | Switching tabs after PDFs caused issues | Built dedicated cleanup logic |
| 4 | Reader Mode toggle | Initially only enabled, never disabled | Implemented proper toggle state |
| 5 | Session Restore UX | Always restoring the single default new tab was annoying | Restore prompt only appears when the previous session has meaningful tabs |
| 6 | Tab titles | Showed generic "Tab 1", "Tab 2" | Changed to real webpage titles |
| 7 | Navigation buttons | Back/Forward broke after switching tabs | Fixed by maintaining correct active webview state |

---

## 8. Performance Optimizations

- Limited tabs
- UI simplification
- Lightweight new tab page
- No extensions
- Reader Mode cleanup

Measured RAM usage against Edge as a benchmark.

---

## 9. What I Learned

- Electron architecture (main/renderer separation)
- IPC communication
- WebViews
- Session persistence
- Packaging and production builds
- Desktop application lifecycle
- Browser rendering fundamentals
- State management
- Keyboard shortcut handling
- Debugging Electron apps

---

## 10. What I Would Improve

- SSH Terminal
- SSH Profiles
- SFTP Browser
- Cloud Study Brain
- Memory monitor
- Better reader extraction
- Bookmark manager
- Downloads manager

---

## 11. Interview Questions

**Why Electron?**
See Section 3.

**Why WebView instead of BrowserWindow?**
Because I wanted a single desktop window capable of hosting multiple tabs.

**Why IPC?**
The renderer cannot access native OS features directly — IPC enables secure communication between processes.

**Why Reader Mode?**
To improve readability by removing distractions.

**Biggest challenge?**
Managing the Electron lifecycle and WebView initialization.

**What would you redesign?**
Separate tab management into independent modules, move browser state into dedicated classes, and reduce renderer complexity.

---

## 12. Biggest Engineering Lessons

1. Don't optimize before measuring.
2. UI problems are usually state-management problems.
3. Separate renderer and main responsibilities.
4. Always build incrementally.
5. Package early.
6. Git branches are cheaper than rewrites.
7. Architecture matters more than features.

---

## 13. Final Reflection

Studium started as an experiment to understand Electron and desktop application development. During development, it evolved into a complete lightweight browser with custom tab management, PDF support, study-oriented features, session restoration, and a production-ready Windows installer.

The project taught me not only Electron APIs but also software architecture, debugging strategies, state management, release engineering, and disciplined feature development. More importantly, it reinforced the value of building a stable foundation before adding advanced capabilities.

---

## Appendix: Technologies Used

- Electron
- Chromium
- Node.js
- HTML
- CSS
- JavaScript
- Electron IPC
- electron-builder
- Git
- GitHub
