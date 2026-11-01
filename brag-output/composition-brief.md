# Hyperframes Composition Brief: Studium

## Objective
Create a short, polished launch-style brag video for Studium — a lightweight desktop browser built for PDF-heavy academic study sessions.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 20 seconds (15-25 second window)

## Source Material
- Project root: `d:\projects\Studium`
- Primary files read: index.html, assets/css/showcase.css, README.md
- Product name: Studium
- Tagline / strongest claim: "A browser for focus, not clutter." / "~2× lower RAM than Edge in same PDF scenario"
- Key UI or visual moment to recreate: The benchmark bar chart (Studium 220 MB vs Edge 390 MB vs Chrome 475 MB) and the product browser frame with traffic-light dots
- Copy that must appear verbatim:
  - "Your browser uses 900 MB to read a PDF." (hook — grounded in Chrome benchmark from comparison table: ~900+ MB for PDF + mixed tabs)
  - "Studium" (product name)
  - "A browser for focus, not clutter." (hero headline)
  - "220 MB" / "390 MB" / "475 MB" (benchmark values from the site)
  - "Idle memory comparison" (benchmark caption)
  - "5-tab hard limit" (from meta-list)
  - "~2–3 sec startup" (from meta-list)
  - "Zero telemetry" (from trust indicators)
  - "Open Source · MIT Licensed · No Telemetry" (trust badges)

## Creative Direction
- Tone preset: polished
- Creative direction: confident indie dev tool launch — no hype, earned claims
- Interpretation: fewer scenes, longer holds. Restraint is the creative choice. The numbers and clean UI speak for themselves. No exclamation marks, no hype language. Confidence through stillness and earned data.
- Angle: Studium solves a real, universal student frustration — browsers eating all your RAM just to read a PDF. The video opens with that frustration, reveals the product, proves it with benchmarks, and closes with quiet confidence.
- Hook: "Your browser uses 900 MB to read a PDF." — giant text on dark background, teal glow
- Outro / punchline: "Studium" logo + "A browser for focus, not clutter." — held in stillness
- Avoid:
  - Generic SaaS language ("streamline your workflow", "boost productivity")
  - Abstract filler visuals
  - Hype or excitement — the polished tone demands restraint

## Visual Identity
- Background: #081018 (deep navy/black from dark theme)
- Text: #e8f4f8 (light cream-white)
- Accent: #00d4c8 (teal/cyan)
- Secondary accent: #10d98a (success green, for Studium benchmark bar)
- Gradient: linear-gradient(180deg, #10d98a, #00d4c8) for Studium's benchmark bar
- Edge blue: #0078d7 → #005a9e
- Chrome blue: #4285f4 → #3367d6
- Display font: Inter (700-800 weight) — loaded from Google Fonts
- Body font: Inter (400-500 weight)
- Visual references from the project:
  - Product frame with red/yellow/green traffic-light dots (lines 506-516 of showcase.css)
  - App screenshot: assets/img/main-app[light].png
  - Benchmark bar chart with gradient bars
  - Teal accent glow (#00d4c8 with blur)

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Hook — 4s — "Your browser uses 900 MB to read a PDF." on dark bg, teal glow
2. Product Reveal — 5s — Studium product frame with real screenshot slides up, "Studium" title
3. Benchmark Proof — 5s — Three bars animate up: Studium 220 MB (teal) vs Edge 390 MB (blue) vs Chrome 475 MB (blue)
4. Key Stats + Trust — 3s — "5-tab hard limit" · "~2–3 sec startup" · "Zero telemetry" + trust badges
5. Logo / Outro — 3s — "Studium" in teal gradient + "A browser for focus, not clutter."

## Audio
- Audio role: steady clean professional bed
- Audio arc: soft entry → slight lift at product reveal → confident presence at benchmark → fade-out under logo
- Music: happy-beats-business-moves-vol-12-by-ende-dot-app.mp3
- Music treatment: start at 0s, volume 0.28; maintain through scenes 2-4; gentle fade from ~17s to silence by 20s
- Music cue guidance: bundled preset at skill-dir `assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json` — tempo ~110 BPM. Target strong cues: 8.74s for benchmark reveal, 13.11s for stat pills, 17.47s for logo landing. Beat grid at ~0.55s intervals for sequential bar/stat entries.
- Audio-reactive treatment: subtle; use music RMS/bass to make the background teal glow breathe gently and product card depth respond slightly. No waveform/equalizer visuals.
- Audio-coupled moments:
  - Scene 2 product frame landing — soft impact
  - Scene 3 benchmark bars locking in — soft thud per bar, beat-grid aligned
  - Scene 5 logo slam — one soft bell/impact, beat-locked to ~17.47s
- SFX selection guidance: polished tone — 2-3 sparse, restrained cues. Use `impactSoft_medium` for reveals, `impactBell_heavy_000` for logo. Nothing aggressive. Match motion, not attention.
- SFX analysis guidance: see `<skill-dir>/assets/sfx/sfx-analysis.md` — prefer low HF risk for polished moments.
- Exact SFX choice: Hyperframes should choose filenames, timestamps, density, and volume based on the implemented animation.
- Audio files: copy the chosen music and any Hyperframes-selected SFX into `brag-output/composition/assets/`

## Hyperframes Instructions
Load the composition-building Hyperframes skills — `hyperframes` (composition contract + `data-*` timing, `references/format.md`; motion, eases and seek-safe keyframes in `references/motion.md`; look in `references/look.md`), `hyperframes-registry` (ready-made effects, transitions, titles), `media-use` (music, SFX, audio-reactive data), and `hyperframes-cli` (lint/check/render). /brag is its own workflow: skip the `hyperframes` storyline step: don't read `references/types/*` or `references/story.md`, don't propose storylines, and don't write a `SPEC.md`. The brag plan and composition brief replace them, including the LOOK line `references/look.md` asks for. Also skip its `usage`, `history`, `feedback` and REVIEW.md steps; `check` is brag's gate. Do not route into its generic launch-video workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI, copy, or visual element from the source project.
- Keep all text readable in the final render.
- Keep the video within 15-25 seconds.
- Include the planned music/SFX layer unless audio was explicitly disabled or documented as intentionally silent.
- Treat `/brag` audio notes as guidance, not a fixed cue sheet. Choose SFX after the visual animation exists.
- Treat music cue metadata as optional timing hints. Hyperframes decides exact animation timing and should ignore cues that hurt readability, scene pacing, or the product story.
- Major reveals may move toward nearby strong cues within about 0.15s. Smaller entrances may align to nearby beat points within about 0.10s. Use only 1-3 strong cue locks in a 15-25s video unless the edit clearly benefits from more.
- Use SFX to support motion and interaction: short announcement cues for major payoffs, restraint when the edit is already busy.
- Honor planned music treatment such as fade-outs, ducking, beat-aligned reveals, or letting a final SFX ring over the music, using the best Hyperframes-supported implementation.
- When music is present and the treatment is not `none`, consider Hyperframes audio-reactive workflow: extract audio data and use RMS/frequency bands for subtle, brand-specific motion. Good targets are glow, depth, background warmth, card presence, title emphasis, or other existing visual elements. Avoid waveform/equalizer visuals, musical-note graphics, generic particle systems, strobing, or heavy pulsing.
- Use local assets for audio and any required runtime/media dependencies when possible.
- Run `hyperframes check` before render — it is brag's single gate.
- Keep creation and rendering local. Remote or publishing workflows require a separate explicit user request.

## LOOK
Dark, deep navy background (#081018). Teal cyan accent (#00d4c8) with subtle glow. Clean Inter typography. Gradient benchmark bars. Minimal chrome, maximum confidence. The visual language of a developer tool that takes itself seriously.

