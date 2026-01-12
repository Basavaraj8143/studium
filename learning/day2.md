🟢 Day 2 — PDF Handling & Memory Observation
What I did

Added a feature to open local PDF files

Used Electron’s native file picker

Loaded PDFs directly inside the browser window

Compared RAM usage between Studium and Edge/Chrome for the same PDF

What I learned

Browsers like Edge/Chrome consume high RAM because they:

Load extensions

Keep background tabs alive

Use JS-based PDF renderers

A controlled Electron environment can:

Load PDFs with less overhead

Avoid unnecessary background processes

Real performance claims must be measured, not assumed

Observation

When opening the same PDF file, Studium consumed approximately 2× less RAM than Microsoft Edge on the same system.

Key takeaway

Reducing memory usage is possible by reducing features and background activity, not by changing the rendering engine.