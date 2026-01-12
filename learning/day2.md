🟢 Day 2 — PDF Handling & Memory Observation

## What I Accomplished

- Implemented functionality to open local PDF files within the application
- Integrated Electron's native file dialog for PDF selection
- Enabled direct PDF rendering inside the browser window
- Conducted memory usage comparisons between Studium and major browsers (Edge/Chrome) when loading identical PDFs

## Key Concepts Learned

Traditional browsers like Edge and Chrome have high memory consumption due to:
- Loading and running browser extensions
- Maintaining background tabs and processes
- Utilizing JavaScript-based PDF rendering engines

An optimized Electron environment can:
- Render PDFs with reduced system overhead
- Eliminate unnecessary background processes and extensions
- Performance optimizations require empirical measurement rather than assumptions

## Memory Usage Observation

When loading the same PDF file, Studium used approximately 50% less RAM compared to Microsoft Edge on the same system.

## Main Takeaway

Memory efficiency can be achieved by minimizing features and background activity, rather than fundamentally changing the underlying rendering technology.