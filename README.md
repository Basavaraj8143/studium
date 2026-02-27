# Studium Pro - Capability-First Study Browser

## Overview

Studium Pro is a desktop-first, feature-rich study browser branch focused on capability and advanced workflows.
It keeps the focused study model of Studium while relaxing low-RAM constraints for power users.

## Key Goals

- Power-user features with flexible resource limits
- Minimal UI for study focus
- Advanced workflows without aggressive tab discarding
- Evidence-based improvements and documentation

## Features

- Electron-based desktop app
- PDF viewing with local file support
- Study mode to reduce UI distractions
- Higher tab capacity (20 tabs)
- Reader mode for article readability
- Custom new tab page with quick links
- SSH profile management enabled by default in Pro

## Architecture Notes

- Local UI renders in the renderer (HTML/CSS/JS)
- External sites load inside `webview` to avoid instability
- Navigation and state are controlled from the renderer

## Scripts

- `npm start` - run the app
- `npm run build` - build Windows installer

## Build Output

The Windows installer is generated under `dist` after a successful build.

## Branch Positioning

- `main` prioritizes capability, parallel workflows, and advanced features
- `studium-v1` keeps the low ram  Studium identity.

## License

See `LICENSES.chromium.html` for third-party notices.
