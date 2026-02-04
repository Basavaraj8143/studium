# Day 11 — Performance Benchmarking & Evidence Collection

## Objective
Quantitatively compare **Studium** with mainstream browsers (Chrome / Edge) to validate the core claim:
> Studium uses less RAM for study-centric workflows, especially PDF-heavy sessions.

This day focuses on **measurement, not new features**.

---

## Test Environment

- **Device**: Windows Laptop (8 GB RAM)
- **OS**: Windows 11
- **Browsers Compared**:
  - Studium (Electron-based, v1 frozen)
  - Microsoft Edge (Chromium)
- **Measurement Tool**: Windows Task Manager
- **Network**: Normal Wi-Fi (no throttling)

---

## Benchmark Scenarios

### Scenario 1 — Idle Browser (Home / New Tab)

**Steps**
1. Launch browser
2. Do not open any website
3. Observe memory usage after stabilization

| Browser | Memory Usage |
|------|-------------|
| Edge | ~380–400 MB |
| Studium | ~210–230 MB |

**Observation**
Studium consumes significantly less memory at idle because:
- No background services
- No extensions
- Lightweight local home page (`newtab.html`)

---

### Scenario 2 — Multiple Tabs (5 Tabs)

**Steps**
1. Open 5 tabs
2. Load common sites (Google, GitHub, Gmail, etc.)
3. Wait 1–2 minutes for stabilization

| Browser | Memory Usage |
|------|-------------|
| Edge | ~790 MB |
| Studium | ~300 MB |

**Observation**
- Edge spawns multiple renderer and utility processes
- Studium enforces a hard tab limit and avoids speculative loading

---

### Scenario 3 — PDF Viewing (Study Use Case)

**Steps**
1. Open a medium-sized academic PDF
2. Scroll through multiple pages
3. Observe RAM usage

| Browser | Memory Usage |
|------|-------------|
| Edge | ~350–400 MB |
| Studium | ~210–220 MB |

**Observation**
Studium handles PDFs with fewer background processes and no extension overhead.

---

### Scenario 4 — Mixed Workflow (Tabs + PDF)

**Steps**
1. Keep 3–4 tabs open
2. Open a PDF
3. Switch between tabs and PDF

| Browser | Memory Usage |
|------|-------------|
| Edge | ~800+ MB |
| Studium | ~300–320 MB |

**Observation**
Studium maintains predictable memory usage due to:
- Controlled tab lifecycle
- No background pre-rendering
- Manual user-driven loading

---

## Key Findings

- Studium consistently uses **30–60% less RAM** than Edge in study-focused workflows
- Memory usage remains **predictable and stable**
- No memory leakage observed during repeated PDF open/close cycles

---

## Evidence Collected

- Task Manager screenshots (attached in repository)
- Side-by-side comparisons under identical conditions
- Real-device testing (not simulated)

---

## Engineering Insight

Studium’s lower memory usage is not due to “optimization tricks” but due to:
- Intentional feature limitation
- Reduced background activity
- Clear separation between:
  - Home UI (static HTML)
  - Web content (on-demand webview)

---

## Outcome

✔ Core project claim validated with data  
✔ Screenshots available as proof  
✔ Ready for inclusion in final report and viva  

Day 11 marks the transition from **building** to **proving**.

---

## Next Step (Day 12)

Optional lightweight optimizations:
- Smart tab discard (suspend inactive tabs)
- Memory-aware UX improvements
