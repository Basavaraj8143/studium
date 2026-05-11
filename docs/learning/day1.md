🟢 Day 1 — Electron Basics & Browser Shell

## What I Accomplished

- Initialized a new Electron project from the ground up
- Developed the main process in `main.js` to manage the desktop window lifecycle
- Built the renderer process with `index.html` and `renderer.js` for the user interface
- Implemented a simple URL input bar and web page loading functionality
- Explored how Electron leverages Chromium as its rendering engine

## Key Concepts Learned

Electron apps consist of two primary processes:

- **Main Process**: Manages application windows, system interactions, and lifecycle events
- **Renderer Process**: Handles web content rendering and user interface interactions

Important insights:
- Modern browsers don't require custom rendering engines; they can utilize existing ones like Chromium
- The `<webview>` tag is disabled by default in Electron for security reasons
- A functional browser shell can be created with minimal code

## Main Takeaway

Building a browser primarily involves managing content loading mechanisms rather than developing a complete rendering engine. Electron provides the foundation to create desktop applications that behave like web browsers with native capabilities.