📘 Studium — Lightweight Study Browser

Day-by-Day Development Plan

Studium is a desktop-first, lightweight study browser designed to reduce RAM usage during long PDF-based study sessions and preserve learning context.

This document outlines the daily development plan, used both as a project roadmap and as evidence of systematic engineering work.

🗓️ Phase 1 — Foundation & Baseline (Days 1–3)
✅ Day 1 — Electron Browser Shell

Goal: Create a working desktop browser shell.

Completed Tasks:

Setup Electron project

Create main process (main.js)

Create renderer UI (index.html, renderer.js)

Implement URL bar and website loading

Verify Chromium rendering works

Outcome:

Studium opens websites successfully

Stable base for future features

✅ Day 2 — Local PDF Opening & Baseline Measurement

Goal: Open local PDF files and compare RAM usage.

Completed Tasks:

Add “Open PDF” button

Use native file picker

Load PDFs directly inside Electron

Compare RAM usage with Edge/Chrome

Observed Result:

Studium uses ~2× less RAM than Edge for the same PDF

Outcome:

Core problem validated with real data

Screenshots captured for documentation

🔜 Day 3 — PDF Memory Cleanup & Resource Control

Goal: Ensure memory is released after closing PDFs.

Planned Tasks:

Detect PDF close/navigation

Destroy PDF webContents properly

Prevent background PDF processes

Re-measure RAM after close

Outcome Expected:

No memory leakage

Predictable RAM behavior

🗓️ Phase 2 — Lightweight Study Features (Days 4–7)
Day 4 — Study Mode (Minimal UI)

Goal: Reduce distraction during study sessions.

Tasks:

Add Study Mode toggle

Hide non-essential UI

Enforce single-window focus

Day 5 — Tab Limiting (Intentional Constraint)

Goal: Prevent memory overload from excessive tabs.

Tasks:

Implement hard tab limit (5–7 tabs)

Show warning when limit reached

Auto-destroy inactive tabs

Day 6 — Reader Mode for Articles

Goal: Improve readability of documentation/blogs.

Tasks:

Strip ads and sidebars

Display clean text layout

Adjustable font size and spacing

Day 7 — Stability Testing

Goal: Ensure system reliability.

Tasks:

Long study session testing (1–2 hours)

Multiple PDF open/close cycles

Monitor RAM and CPU usage

🗓️ Phase 3 — Context Preservation (Days 8–10)
Day 8 — Study Brain (Session Saving)

Goal: Preserve study context across sessions.

Tasks:

Save group of tabs as a “Study Brain”

Store URLs and order locally

Add optional session note

Day 9 — Restore Study Brain

Goal: Reopen exact study context.

Tasks:

Reload saved tabs on demand

Ensure no background loading

Verify RAM stays low

Day 10 — Study Brain Validation

Goal: Validate usefulness and performance.

Tasks:

Test multiple saved sessions

Confirm no memory persistence

Finalize feature behavior

🗓️ Phase 4 — Performance Proof & Optimization (Days 11–14)
Day 11 — Performance Benchmarking

Tasks:

Compare Studium vs Chrome/Edge

Measure:

RAM usage

Startup time

PDF open/close behavior

Day 12 — Lightweight Ad & Tracker Blocking (Optional)

Tasks:

Block common ad/tracker domains

No extensions

Request-level blocking only

Day 13 — Results Documentation

Tasks:

Create tables and graphs

Add screenshots

Write performance analysis

Day 14 — Code Cleanup & 🥶 

Tasks:

Refactor code

Remove unused logic

Freeze feature set (v1)

🗓️ Phase 5 — Final Year Project Submission (Days 15–20)
Deliverables:

Final project report

Architecture diagrams

Performance results

Demo video

GitHub repository

Release build (Windows)

🎯 Project Philosophy

Not a Chrome replacement

Not a search engine

Focused on low-RAM study workflows

Intentional limitations

Measurable improvements

📌 Key Claim (Backed by Evidence)

Studium reduces memory usage during PDF-based study sessions by controlling rendering, background processes, and tab lifecycle.

🚀 Future Enhancements

Android version (WebView)

AI-assisted Study Brain summaries (on-demand)

Cross-platform build

✅ Current Status

Day 1: Completed

Day 2: Completed

Day 3: Ready to start

🔒 Final Note

This plan is deliberately realistic.
Every feature is derived from real student problems and is measurabl
