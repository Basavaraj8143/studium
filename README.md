# Studium — Lightweight Study Browser

## Overview

Studium is a desktop-first, lightweight study browser built to keep RAM use predictable during long, PDF-heavy study sessions. The goal is not to replace Chrome, but to provide a focused, low-distraction environment that preserves learning context.

## Key Goals

- Low and predictable memory use
- Minimal UI for study focus
- Intentional constraints (tab limits, study mode)
- Evidence-based improvements and documentation

## Features

- Electron-based desktop app
- PDF viewing with local file support
- Study mode to reduce UI distractions
- Tab limit to prevent memory overload
- Reader mode for article readability
- Custom new tab page with quick links

## Architecture Notes

- Local UI renders in the renderer (HTML/CSS/JS)
- External sites load inside `webview` to avoid instability
- Navigation and state are controlled from the renderer

## Development Approach

The project follows a day-by-day plan where each day is a verifiable milestone. This README is both a roadmap and a development log for final-year evaluation.

## Progress

- Day 1: Electron shell complete
- Day 2: Local PDF open and baseline memory comparison
- Day 3: PDF cleanup and resource control (planned)
- Day 4: Study mode implemented
- Day 5: Tab limit enforced
- Day 6: Reader mode implemented
- Day 7: Stability testing and fixes
- Day 8: New tab architecture and navigation wiring

## Evidence (Current)

Studium uses about 2x less RAM than Edge for the same PDF on the tested machine. Screenshots and notes are kept in the project evidence folder.

## Scripts

- `npm start` — run the app
- `npm run build` — build Windows installer

## Build Output

The Windows installer is generated under `dist` after a successful build.

## Roadmap (Planned)

- Performance benchmarks vs Chrome and Edge
- Optional request-level ad and tracker blocking
- Results documentation with tables and graphs
- Code cleanup and v1 freeze
- Final report, diagrams, and demo video

## Current Status

Phase 1 and Phase 2 are complete. Phase 3 core wiring is complete. Benchmarking and final deliverables are planned.

## License

See `LICENSES.chromium.html` for third-party notices.
