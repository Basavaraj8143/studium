# Day 9 — Smart Tab Discarding & Page Titles

## Objective
Reduce RAM usage during multi-tab study sessions while improving tab usability.

Day 9 focused on **application-level memory optimization** and **UX clarity**, without modifying Chromium internals.

---

## Features Implemented

### 1. Page Titles on Tabs
Tabs now display the actual page title instead of generic labels.

**Examples:**
- Google
- GitHub
- Gmail
- PDF: Operating_Systems_Notes.pdf
- New Tab

This makes it easier to identify both active and discarded tabs.

**Technical Approach:**
- Listen to `page-title-updated` events from the webview
- Store the title in tab state
- Re-render tab UI on updates

---

### 2. Automatic Tab Discarding (Inactivity-Based)
Inactive tabs are automatically discarded after a configurable timeout (5 minutes).

**Behavior:**
- Active tab is never discarded
- Inactive tabs are marked as discarded
- Discarded tabs release memory
- Tabs reload only when selected

**Purpose:**
- Prevent background memory usage
- Maintain predictable RAM consumption

---

### 3. Manual Tab Discarding
Users can manually discard tabs using a dedicated control.

**Behavior:**
- Immediate memory release
- Visual feedback (dimmed tab)
- Active tab cannot be discarded

This provides explicit user control over memory usage.

---

## Visual Indicators
- Discarded tabs appear dimmed
- Discarded tabs include a pause icon (⏸)
- All tabs maintain equal width with ellipsis for long titles

---

## Engineering Constraints
- No Chromium engine modification
- No renderer process manipulation
- No true tab freezing
- Memory is reclaimed by discarding and restoring tabs

This aligns with Electron’s architectural boundaries.

---

## Results
- Reduced RAM usage during long sessions
- Improved usability for multi-tab workflows
- Stable behavior under tab limits

---

## Summary
Day 9 successfully introduced **smart tab lifecycle management**, balancing performance and usability.  
These optimizations operate entirely at the application level, making them safe, measurable, and maintainable.

---

## Status
✔ Completed  
✔ Stable  
✔ Ready for benchmarking



![before](../evidence/notfrezed.png)
![after](../evidence/whenfrezed.png)