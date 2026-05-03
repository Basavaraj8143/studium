# 📖 Studium

> A lightweight desktop browser built for PDF-heavy study sessions.  
> Predictable memory usage · Minimal UI · Intentional constraints.

![Platform](https://img.shields.io/badge/platform-Windows-blue)
![Built With](https://img.shields.io/badge/built%20with-Electron-47848F?logo=electron)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

---

## About

Studium is a lightweight desktop browser designed specifically for academic workflows. Built with Electron, it provides predictable memory usage and intentional browsing controls that help students maintain focus during PDF-heavy study sessions.

### Key Benefits
- **~2× lower RAM usage** compared to mainstream browsers for PDF workflows
- **5-tab hard limit** prevents memory overload and enforces focused browsing
- **Built-in PDF viewer** with optimized memory management
- **Study mode** removes distractions for concentrated reading
- **Reader mode** cleans up articles by removing ads and sidebars

---

## Features

| Feature | Description |
|---|---|
| 📄 Local PDF Viewer | Open and render PDFs natively with reduced memory overhead |
| 🧘 Study Mode | Toggle distraction-free layout for focused sessions |
| 📑 Reader Mode | Strip ads and sidebars from articles and documentation |
| 🔒 Tab Limiter | Hard cap of 5 tabs prevents RAM overload |
| 🗂️ New Tab Page | Custom local new tab with search and quick links |
| ⚡ Performance | Optimized for low memory usage and fast PDF rendering |

---

## Download

**Latest Release:** [Studium v1.0.0](https://github.com/Basavaraj8143/studium/releases/download/studium-v1.0/Studium.Setup.1.0.0.exe)

- **File:** `Studium.Setup.1.0.0.exe` (104MB)
- **Platform:** Windows 10/11
- **Requirements:** No special requirements

### Installation
1. Download the installer from the link above
2. Run the `.exe` file
3. Follow the installation wizard
4. Launch Studium from your desktop or start menu

---

## Tech Stack

- **Framework:** Electron
- **Runtime:** Node.js
- **Frontend:** HTML5, CSS3, JavaScript
- **Rendering:** Chromium webview
- **Packaging:** Electron Builder

---

## Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/Basavaraj8143/studium.git
cd studium

# Install dependencies
npm install

# Start development
npm start

# Build for production
npm run build
```

### Project Structure
```
studium/
├── app.html          # Main application UI
├── main.js           # Electron main process
├── renderer.js       # Renderer process logic
├── preload.js        # Preload script
├── styles.css        # Application styles
├── showcase.html     # Marketing page (GitHub Pages)
├── showcase.css      # Marketing page styles
├── showcase.js       # Marketing page scripts
└── downloads/        # Build artifacts
```

---

## Performance Benchmarks

| Scenario | Studium | Edge | Chrome |
|---|---|---|---|
| Idle memory | ~210–230 MB | ~380–400 MB | ~450–500 MB |
| PDF + mixed tabs | ~300–320 MB | ~800+ MB | ~900+ MB |
| Startup time | ~2–3 seconds | ~3–5 seconds | ~4–6 seconds |

*Benchmarks measured on Windows 11 with identical PDF and web content.*

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure performance optimizations maintain memory efficiency

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built as a Final Year Project
- Inspired by the need for focused, low-overhead academic browsing
- Special thanks to the Electron community for the framework

---

**Made with ❤️ for students who need to focus**
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
