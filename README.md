<div align="center">

# Studium

### Lightweight Desktop Browser for Students

*Not a Chrome replacement. A focused tool for PDF-heavy study sessions.*

![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11-blue)
![Built With](https://img.shields.io/badge/built%20with-Electron-47848F?logo=electron)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)
![Type](https://img.shields.io/badge/type-Final%20Year%20Project-blueviolet)
![Progress](https://img.shields.io/badge/progress-14%20%2F%2014%20days-brightgreen)

</div>

---

## Why Studium?

Mainstream browsers are built for everything. Studium is built for one thing — **studying**.

When you open a PDF in Chrome or Edge, you're loading a full browser engine with extensions, background tabs, and sync processes competing for RAM. Studium strips all of that away. The result is a browser that uses ~2× less memory on the same PDF, starts faster, and keeps you focused with intentional constraints like a hard 5-tab limit.

Every feature in Studium exists because a real student problem demanded it.

---

## Benchmarks

| Scenario | Studium | Edge | Chrome |
|---|---|---|---|
| Idle memory | ~210–230 MB | ~380–400 MB | ~450–500 MB |
| PDF + mixed tabs | ~300–320 MB | ~800+ MB | ~900+ MB |
| Startup time | ~2–3 sec | ~3–5 sec | ~4–6 sec |

*Measured on Windows 11 with identical PDF and web content.*

---

## Features

| Feature | Description |
|---|---|
| 📄 Local PDF viewer | Open and render PDFs natively inside Electron with optimized memory management |
| 🧘 Study mode | Toggle distraction-free layout — hides all non-essential UI elements |
| 📑 Reader mode | Strips ads and sidebars from articles and documentation pages |
| 🔒 Tab limiter | Hard cap of 5 tabs prevents RAM overload and enforces intentional browsing |
| 🗂️ New tab page | Custom local new tab with search and quick links, isolated from webview |
| ⚡ Memory cleanup | Releases memory after PDF close — no background rendering leaks |

---

## Download

<div align="center">

### [⬇️ Download Studium v1.0.0 for Windows](https://github.com/Basavaraj8143/studium/releases/download/studium-v1.0/Studium.Setup.1.0.0.exe)

`Studium.Setup.1.0.0.exe` · 104 MB · Windows 10 / 11 · No special requirements

</div>

**Installation:**
1. Download the `.exe` installer above
2. Run and follow the installation wizard
3. Launch Studium from your desktop or Start menu

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Electron |
| Runtime | Node.js 16+ |
| Frontend | HTML5, CSS3, JavaScript |
| Rendering | Chromium webview |
| Packaging | Electron Builder |

---

## Project Structure

```
studium/
├── main.js           # Electron main process
├── renderer.js       # Renderer process logic
├── preload.js        # Preload script
├── app.html          # Main application UI
├── styles.css        # Application styles
├── showcase.html     # GitHub Pages marketing page
├── showcase.css
├── showcase.js
└── downloads/        # Build artifacts
```

---

## Local Development

### Prerequisites
- Node.js 16+
- npm

```bash
# Clone
git clone https://github.com/Basavaraj8143/studium.git
cd studium

# Install
npm install

# Dev
npm start

# Build
npm run build
```

---

## Development Roadmap

| Phase | Days | Scope | Status |
|---|---|---|---|
| Foundation & Baseline | 1–3 | Electron shell, PDF viewer, RAM measurement | ✅ Done |
| Study Features | 4–7 | Study mode, tab limiter, reader mode, stability | ✅ Done |
| Navigation Architecture | 8 | New tab page, webview isolation, back/forward | ✅ Done |
| Performance Proof | 9–13 | Benchmarking, ad blocking, results documentation | ✅ Done |
| Code Freeze v1 | 14 | Refactor, cleanup, release build | ✅ Done |

```
Day  1  2  3  4  5  6  7  8  9  10  11  12  13  14
     ✅  ✅  ✅  ✅  ✅  ✅  ✅  ✅  ✅  ✅   ✅   ✅   ✅   ✅
```

---

## Future Enhancements

- Smart tab freezing
- Study session saving and context restore
- AI-assisted on-demand summaries
- Android version (WebView-based)

---

## License

MIT License — see [`LICENSE`](LICENSE) for details.

---

<div align="center">

**Made with ❤️ for students who need to focus**

Built as a Final Year Project · [Byte-Harvest Team](https://github.com/Basavaraj8143)

</div>