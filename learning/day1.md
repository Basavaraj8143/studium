🟢 Day 1 — Electron Basics & Browser Shell
What I did

Set up an Electron project from scratch

Created the main process (main.js) to open a desktop window

Created the renderer UI (index.html, renderer.js)

Implemented a basic URL bar and website loading

Understood how Chromium is used as a renderer inside Electron

What I learned

Electron applications have two parts:

Main process → controls the window and system-level features

Renderer process → handles UI and web content

A browser does not need its own engine; it can reuse Chromium

<webview> is disabled by default and must be explicitly enabled

A minimal browser shell can be built with very little code

Key takeaway

A browser is mainly about controlling how and when content is loaded, not about building a rendering engine from scratch.