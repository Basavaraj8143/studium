# Day 14 - Advanced UI + SSH Profiles (UI Only)

## Objective
Finalize Studium v1 by:
- Adding a clear Advanced entry point
- Keeping SSH features opt-in and off by default
- Preserving the low-RAM philosophy
- Laying safe groundwork for future v2 work

---

## Work Done Today

1. Advanced Menu Entry (UI Only)
- Added the three-dot menu in the top-right toolbar
- Advanced submenu now contains:
  - SSH Profiles (disabled until enabled in Settings)
  - SSH Terminal (disabled until enabled in Settings)
- Settings and About remain separate from Advanced
- Removed the old "Enable SSH (Experimental)" menu item

Menu structure:
```
⋮
├── Advanced ▸
│   ├── SSH Profiles (disabled until enabled)
│   └── SSH Terminal (disabled until enabled)
├──────────────
├── Settings
└── About Studium
```

2. Settings Toggle for SSH Features
- Added a Settings modal with a "Turn on SSH features (Experimental)" toggle
- Default is OFF
- Stored in localStorage to keep the choice persistent
- No SSH processes or connections are started unless the user enables it

3. SSH Profiles Modal (UI + Data Model)
- Built a modal (not a tab) for SSH Profiles
- Empty state with clear safety messaging
- Add/Edit form with validation
- Authentication is SSH key only; password auth is disabled
- Profiles are saved as metadata only

Sample profile shape:
```
{
  "name": "College Server",
  "host": "10.10.1.23",
  "port": 22,
  "username": "student",
  "auth": "ssh-key",
  "keyPath": "C:/Users/.../id_rsa"
}
```

Storage:
```
localStorage.setItem("ssh_profiles", JSON.stringify(profiles));
```

4. UI Bug Fixes
- Fixed submenu opening off-screen by opening to the left
- Fixed modal visibility so it does not open on app launch

---

## What Was Intentionally NOT Implemented
- No SSH connections
- No terminal session
- No background SSH services
- No password storage
- No networking of any kind

---

## Outcome
- Advanced features are isolated and opt-in
- SSH is off by default and does not consume resources until enabled
- UI feels professional and safe for review
- v1 remains stable and focused

---

## v1 Status
Feature freeze achieved for core browser features:
- Tab limit
- Study mode
- Reader mode
- PDF handling
- Session stability

---

## v2 Preview (Future Only)
- SSH Terminal (opt-in)
- SFTP file browsing
- SSH key manager
- Optional cloud sync
