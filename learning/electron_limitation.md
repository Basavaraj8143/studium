# Electron Limitations & Constraints

## Overview

Electron is built on Chromium, which means it inherits both strengths and limitations. This document outlines what **cannot** be done in Electron and justifies Studium's architectural choices.

Good question. This is a very smart move — examiners do ask this.

I’ve read Electron docs + real-world constraints enough to give you an honest, no-bullshit list of things that are not possible, restricted, or impractical in Electron, especially for a browser-like app such as Studium.

I’ll group this clearly so you can use it directly in viva / report.

❌ Things Electron DOES NOT ALLOW (or strongly restricts)
1️⃣ True Low-Level Browser Engine Control ❌

Electron uses Chromium as-is.

You cannot:

Modify Chromium’s rendering engine

Change how PDFs are rasterized internally

Control GPU memory allocation at engine level

Tune JS engine (V8) garbage collection behavior

👉 You can use Chromium, not control it.

Viva line:

“Electron applications cannot modify Chromium’s internal rendering or memory management.”

2️⃣ Per-Tab True Process Suspension ❌

Chrome freezes tabs using internal Chromium scheduler + OS hooks.

Electron:

❌ Cannot fully suspend a tab’s JS execution

❌ Cannot pause V8 VM of a single tab

❌ Cannot freeze a tab without unloading it

What you can do:

Destroy the webview

Reload later (fake freezing)

This is why Smart Tab Freezing is non-trivial in Electron.

3️⃣ System-Wide Ad / Tracker Blocking ❌

Electron cannot:

Act like a system proxy

Intercept traffic outside the app

Block trackers at OS/network level

What you can do:

Request-level blocking inside the app only

Use webRequest API (limited)

No uBlock-level blocking without extensions.

4️⃣ Browser Extensions (Chrome Extensions) ❌

Electron does NOT support:

Installing Chrome extensions

Using .crx files

Extension APIs (chrome.*)

This is a hard limitation.

Viva line:

“Electron does not support Chrome extensions due to security and architectural constraints.”

5️⃣ Full Browser Profile Sync ❌

Electron cannot natively:

Sync history across devices

Sync tabs like Chrome

Sync sessions via Google account

You’d need:

Your own backend

Auth system

Sync protocol

Which is out of scope for a student project.

6️⃣ Real Incognito / Sandboxed OS Mode ❌

Electron:

Can clear data

Can use separate sessions

But ❌ cannot guarantee:

OS-level privacy

DNS-level isolation

Hardware fingerprint blocking

So true incognito like Tor Browser is impossible.

7️⃣ Native PDF Engine Customization ❌

Electron PDFs are rendered by Chromium’s PDF viewer.

You cannot:

Replace the PDF engine

Modify how pages are decoded

Control PDF memory mapping

You can only:

Load PDFs

Destroy/reload viewers

This is why you focused on RAM observation, not engine tuning.

8️⃣ True Multi-Profile Browser Support ❌

Electron:

Has session partitions

But no full browser-profile abstraction

Meaning:

Profiles are heavy

Switching is clunky

Memory cost is high

Chrome’s profile system is not exposed.

9️⃣ Deep OS Power Management ❌

Electron cannot:

Control CPU governor

Control OS scheduler

Force low-power rendering

Control laptop power states

You are limited to app-level optimizations only.

🔟 Zero-RAM Background Tabs ❌

Electron tabs (webviews):

Always consume some memory

Cannot be reduced to 0 RAM unless destroyed

So:

“Unlimited tabs with zero memory usage”
is physically impossible in Electron.

⚠️ Things Electron ALLOWS — BUT BAD IDEA

These are technically possible but should NOT be done:

Loading local file:// UI inside webview (you experienced this)

Disabling webSecurity in production

Using nodeIntegration in public builds

Using eval for UI logic

Good that you stopped early.

✅ What Electron IS GOOD FOR (your justification)

Electron is excellent for:

Custom browser UI

Controlled browsing environments

Study-focused workflows

RAM-aware constraints

Desktop academic projects

Which is exactly what Studium is.

📌 Section you can add to your report (copy-paste)

Limitations of Electron
Electron applications are constrained by Chromium’s internal architecture. Low-level control over rendering, memory management, tab suspension, and browser extensions is not exposed. As a result, certain advanced browser behaviors (such as true tab freezing or engine-level PDF optimization) are not feasible. Studium addresses this by focusing on application-level constraints and intentional design decisions rather than engine modification.

### One-Liner (Memorize)

> "Electron provides browser capabilities but not browser engine control; therefore, Studium focuses on workflow-level optimization rather than low-level engine modification."