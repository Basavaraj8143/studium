# 📖 Studium

> A lightweight desktop browser built for PDF-heavy study sessions.  
> Predictable memory usage · Minimal UI · Intentional constraints.

![Platform](https://img.shields.io/badge/platform-Windows-blue)
![Built With](https://img.shields.io/badge/built%20with-Electron-47848F?logo=electron)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Progress](https://img.shields.io/badge/progress-Day%2014%20%2F%2014-brightgreen)
![Type](https://img.shields.io/badge/type-Final%20Year%20Project-blueviolet)

---

## Core Claim

> Studium reduces memory usage during PDF-based study sessions by controlling rendering, background processes, and tab lifecycle — validated with real measurements against Chrome and Edge.

---

## Measured Results

| Metric | Value |
|---|---|
| RAM vs Edge (same PDF) | ~2× less |
| Tab hard limit | 5 tabs |
| Days completed | 14 / 14 |

---

## Features

| Feature | Description |
|---|---|
| 📄 Local PDF viewer | Open and render PDFs natively inside Electron with reduced memory overhead |
| 🧘 Study mode | Toggle distraction-free layout — hides non-essential UI for focused sessions |
| 📑 Reader mode | Strips ads and sidebars from articles and documentation pages |
| 🔒 Tab limiter | Hard cap of 5 tabs prevents RAM overload and enforces intentional browsing |
| 🗂️ New tab page | Custom local new tab with search and quick links, isolated from webview |

---

## Tech Stack

`Electron` · `Node.js` · `HTML / CSS / JS` · `Chromium webview`

---

## Development Roadmap

### ✅ Phase 1 — Foundation & Baseline (Days 1–3)

| Day | Goal | Status |
|---|---|---|
| Day 1 | Electron browser shell — `main.js`, `renderer.js`, URL bar, navigation | ✅ Done |
| Day 2 | Local PDF opening + baseline RAM measurement vs Edge/Chrome | ✅ Done |
| Day 3 | PDF memory cleanup — release memory after close, prevent background rendering | ⏳ Partial |

**Key result:** Studium uses ~2× less RAM than Edge for the same PDF.

---

### ✅ Phase 2 — Lightweight Study Features (Days 4–7)

| Day | Goal | Status |
|---|---|---|
| Day 4 | Study mode — hide non-essential UI, distraction-free layout | ✅ Done |
| Day 5 | Tab limiter — hard 5-tab cap with warning on overflow | ✅ Done |
| Day 6 | Reader mode — strip ads/sidebars, clean text layout | ✅ Done |
| Day 7 | Stability testing — long sessions, PDF cycles, crash fixes | ✅ Done |

---

### ✅ Phase 3 — Context & Navigation Architecture (Day 8)

| Day | Goal | Status |
|---|---|---|
| Day 8 | New tab architecture — `newtab.html`, iframe isolation, webview wiring, back/forward fix | ✅ Done |

**Key learning:** Local UI pages must render in the renderer; external sites must be isolated inside `<webview>`. Mixing both causes instability.

---

### ✅ Phase 4 — Performance Proof & Optimization (Days 9–14)

| Day | Goal | Status |
|---|---|---|
| Day 9–11 | RAM benchmarking vs Chrome/Edge, startup time, PDF lifecycle analysis | ✅ Done |
| Day 12 | Lightweight request-level ad/tracker blocking (no extensions) | ✅ Done |
| Day 13 | Results documentation — tables, graphs, screenshots | ✅ Done |
| Day 14 | Code cleanup, refactor, feature freeze — v1 | ✅ Done |

---

### ✅ Phase 5 — Final Year Project Submission

**Deliverables:**
- Final project report
- Architecture diagrams
- Performance benchmarks
- Demo video
- GitHub repository
- Windows `.exe` release build

---

## Day-by-Day Progress

```
Day  1  2  3  4  5  6  7  8  9  10  11  12  13  14
     ✅  ✅  ✅  ✅  ✅  ✅  ✅  ✅  ✅  ✅   ✅   ✅   ✅   ✅
```

---

## Project Philosophy

This project is intentionally constrained.

- **Not** a Chrome replacement
- **Not** a search engine
- Focused on **low-RAM study workflows** for students
- Every feature is derived from a real problem
- Every claim is backed by measured evidence

---

## Future Enhancements (Optional)

- Smart tab freezing
- Study session saving / context restore
- AI-assisted on-demand summaries
- Android version (WebView-based)

---

*Built as a Final Year Project — Byte-Harvest team.*
