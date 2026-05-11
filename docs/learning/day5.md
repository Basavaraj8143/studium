# 🟢 Day 5 — Tab Limiting & Memory Discipline

## Objective
Introduce **intentional tab limiting** to prevent uncontrolled memory growth and improve focus during study sessions.

---

## What Was Implemented

- Added a **Tabs Bar** with a clear indicator: `Tabs: current / max`
- Implemented a **hard tab limit** (5 tabs)
- Prevented opening new tabs once the limit is reached
- Integrated tab logic with existing **PDF handling and cleanup**
- Ensured navigation and PDF cleanup work correctly per active tab

---

## Design Decisions

- **Hard Limit by Design:**  
  Instead of allowing unlimited tabs and managing memory later, Studium enforces limits upfront to protect system resources.

- **Single Webview, Multiple Tabs (Logical):**  
  Tabs are managed logically (URL state per tab) while a single webview is reused, avoiding multiple renderer processes.

- **No Background Tabs:**  
  Inactive tabs do not keep renderers alive, preventing hidden memory usage.

---

## Technical Summary

- Tabs are stored as a simple array of URLs
- Active tab index determines the loaded content
- New tabs are blocked once the maximum count is reached
- PDF cleanup logic is preserved when switching URLs or tabs
- UI updates reflect tab count accurately

---

## Observations

- RAM usage remains **stable and predictable**
- No gradual memory increase while opening/closing tabs
- Alert-based feedback clearly communicates tab limits to the user
- Study sessions feel more focused due to enforced constraints

---

## Key Takeaway

> Preventing resource overload by design is more effective than reacting to it later.

Tab limiting is not a restriction—it is an **intentional system policy** aligned with Studium’s lightweight philosophy.

---

## Status

- ✅ Tab limit enforced
- ✅ RAM stable during tab usage
- ✅ Integrated with PDF lifecycle
- ✅ UI reflects state correctly

---

## Next Step

**Day 6 — Reader Mode**  
Clean article view for distraction-free reading (no ads, no clutter).
