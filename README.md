📘 Studium — Lightweight Study Browser

## Overview

**Studium** is a **desktop-first, lightweight study browser** designed to reduce RAM usage during long, PDF-heavy study sessions and to preserve learning context with intentional constraints.

Unlike general-purpose browsers, Studium focuses on **predictable memory behavior**, **minimal UI**, and **study-oriented workflows**.

---

## Development Approach

Studium is built using a **day-by-day engineering plan**.  
Each day represents a verifiable milestone and serves as evidence of systematic development.

This document acts as:
- A project roadmap
- A development log
- Supporting documentation for final-year evaluation

---

## 🗓️ Phase 1 — Foundation & Baseline (Days 1–3)

### ✅ Day 1 — Electron Browser Shell

**Goal:** Create a working desktop browser shell.

**Completed Tasks:**
- Setup Electron project
- Implement main process (`main.js`)
- Implement renderer UI (`index.html`, `renderer.js`)
- Add URL bar and navigation controls
- Load external websites using Chromium

**Outcome:**
- Studium successfully opens and renders websites
- Stable base architecture established

---

### ✅ Day 2 — Local PDF Opening & Baseline Measurement

**Goal:** Open local PDF files and compare RAM usage.

**Completed Tasks:**
- Add “Open PDF” button
- Use native file picker
- Load PDFs inside Electron
- Compare memory usage with Edge/Chrome

**Observed Result:**
- Studium uses approximately **2× less RAM** than Edge for the same PDF

**Outcome:**
- Core problem validated with real measurements
- Screenshots captured for documentation

---

### 🔜 Day 3 — PDF Memory Cleanup & Resource Control

**Goal:** Ensure memory is released after closing PDFs.

**Planned Tasks:**
- Detect PDF navigation/close
- Prevent background PDF rendering
- Observe memory behavior after close

**Status:** Planned (partially explored later during stability testing)

---

## 🗓️ Phase 2 — Lightweight Study Features (Days 4–7)

### ✅ Day 4 — Study Mode (Minimal UI)

**Goal:** Reduce distraction during study sessions.

**Completed Tasks:**
- Add Study Mode toggle
- Hide non-essential UI elements
- Enable distraction-free layout

---

### ✅ Day 5 — Tab Limiting (Intentional Constraint)

**Goal:** Prevent memory overload from excessive tabs.

**Completed Tasks:**
- Implement hard tab limit (5 tabs)
- Display warning when limit is reached
- Enforce intentional browsing behavior

---

### ✅ Day 6 — Reader Mode for Articles

**Goal:** Improve readability of articles and documentation.

**Completed Tasks:**
- Strip ads and sidebars
- Display clean text-focused layout
- Improve readability for study content

---

### ✅ Day 7 — Stability Testing & Debugging

**Goal:** Ensure system reliability.

**Completed Tasks:**
- Long session testing
- Multiple PDF open/close cycles
- Debug Electron lifecycle issues
- Fix tab switching, crashes, and memory inconsistencies

**Outcome:**
- Stable base browser achieved
- Architecture issues identified and resolved

---

## 🗓️ Phase 3 — Context & Navigation Architecture (Day 8)

### ✅ Day 8 — New Tab Architecture & Wiring

**Goal:** Implement a proper New Tab experience and stabilize navigation.

**Completed Tasks:**
- Design custom New Tab page (`newtab.html`)
- Render New Tab as local UI using iframe
- Load external websites exclusively inside `<webview>`
- Wire search box and quick links via message passing
- Fix Back/Forward navigation behavior
- Finalize correct Electron architecture separation

**Key Learning:**
- Local UI pages must be rendered in the renderer
- External websites must be isolated inside webviews
- Mixing both causes instability in Electron

**Outcome:**
- Reliable New Tab experience
- Predictable navigation behavior
- No white screens or ERR_ABORTED issues

---

## 🗓️ Phase 4 — Performance Proof & Optimization (Planned)

### 🔜 Day 9–11 — Performance Benchmarking
- Measure RAM usage vs Chrome/Edge
- Startup time comparison
- PDF open/close behavior analysis

### 🔜 Day 12 — Lightweight Ad / Tracker Blocking (Optional)
- Request-level blocking (no extensions)
- Maintain low memory footprint

### 🔜 Day 13 — Results Documentation
- Tables and graphs
- Screenshots
- Performance analysis

### 🔜 Day 14 — Code Cleanup & Freeze (v1)
- Refactor code
- Remove experimental logic
- Freeze feature set

---

## 🗓️ Phase 5 — Final Year Project Submission (Planned)

**Deliverables:**
- Final project report
- Architecture diagrams
- Performance results
- Demo video
- GitHub repository
- Windows release build

---

## 🎯 Project Philosophy

- Not a Chrome replacement
- Not a search engine
- Focused on **low-RAM study workflows**
- Intentional feature limitations
- Evidence-based improvements

---

## 📌 Key Claim (Evidence-Based)

> Studium reduces memory usage during PDF-based study sessions by controlling rendering, background processes, and tab lifecycle.

---

## 🚀 Future Enhancements (Optional)

- Smart tab freezing
- Study session (context) saving
- AI-assisted summaries (on-demand)
- Android version (WebView-based)

---

## ✅ Current Status

- Day 1: Completed
- Day 2: Completed
- Day 3: Planned
- Day 4: Completed
- Day 5: Completed
- Day 6: Completed
- Day 7: Completed
- Day 8: Completed

---

## 🔒 Final Note

This project is deliberately **realistic and constrained**.  
Every feature is derived from real student problems and validated through experimentation.

Stability and clarity are prioritized over feature count.
