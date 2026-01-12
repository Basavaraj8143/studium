🟢 Day 3 — Memory Cleanup & Resource Control
What I did

Implemented explicit cleanup when switching away from a PDF

Stopped PDF rendering using webview.stop()

Forced unloading using about:blank

Ensured memory was released after closing PDFs

Fixed navigation abort errors by sequencing cleanup correctly

What I learned

Chromium may keep renderers alive unless explicitly cleaned

Aggressive cleanup is necessary for predictable RAM usage

Navigation abort errors (ERR_ABORTED) are expected during cleanup

Proper sequencing prevents renderer conflicts

Lightweight software requires intentional destruction of resources

Key takeaway

Lightweight behavior is achieved by explicit lifecycle control, not by hoping the system frees memory automatically.