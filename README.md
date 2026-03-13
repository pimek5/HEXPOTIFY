# HEXpotify (Spicetify)

HEXpotify adds:
- Lyrics++
- Visualizer 2.0 (reactive + DynamicGlow color sync)
- Session Stats Live

This package is ready for GitHub and local import.

## 1:1 Profile Mode

This package now installs an **exact profile preset**:
- forces theme and key Spicetify config entries
- installs all bundled extensions used by your profile
- installs bundled `CustomApps` used by your profile
- installs bundled `Themes` used by your profile
- installs bundled `spicetify_profile` snapshot (near-full folder clone)
- applies matching localStorage config via `hexpotify-profile-bootstrap.js`

This is the closest possible setup to a 1:1 environment.

## Files

- `extensions/hexpotify.js`
- `extensions/dynamic-glow-config.js`
- `extensions/hexpotify-profile-bootstrap.js`
- `custom_apps/*` (profile apps)
- `themes/DynamicGlow`
- `spicetify_profile/*` (near-full profile snapshot)
- `scripts/install.ps1`
- `scripts/install-full-profile.ps1`
- `INSTALL-HEXpotify.cmd` (one-click installer)
- `scripts/build-installer-exe.ps1` (optional EXE builder)
- `scripts/uninstall.ps1`

## Local Install (Windows)

1. Open PowerShell in this folder.
2. Run:

```powershell
.\scripts\install.ps1
spicetify apply
```

3. Restart Spotify.

## One-Click Install (Recommended)

Double-click:

`INSTALL-HEXpotify.cmd`

This installs the full profile snapshot and runs `spicetify apply` automatically.

## Optional: Build EXE Installer

```powershell
.\scripts\build-installer-exe.ps1
```

This creates `INSTALL-HEXpotify.exe` (uses PS2EXE module).

## Local Uninstall (Windows)

```powershell
.\scripts\uninstall.ps1
spicetify apply
```

## GitHub Tutorial

### 1. Create repository

1. Go to GitHub and create a new repository, for example `hexpotify`.
2. Clone it locally:

```powershell
git clone https://github.com/<YOUR_USER>/hexpotify.git
cd hexpotify
```

### 2. Copy package files

Copy everything from `Export/HEXpotify` into your repo root.

### 3. Commit and push

```powershell
git add .
git commit -m "Initial release: HEXpotify"
git push origin main
```

### 4. Install from GitHub on any machine

```powershell
git clone https://github.com/<YOUR_USER>/hexpotify.git
cd hexpotify
.\scripts\install.ps1
spicetify apply
```

## Notes

- Visualizer settings are exposed in DynamicGlow config menu under `HEXpotify Visualizer 2.0`.
- Installer intentionally overwrites key config values to keep profile consistent 1:1.
- `Backup/`, `Extracted/`, and `Export/` are intentionally excluded from the profile snapshot.
- If you update files later, re-run:

```powershell
.\scripts\install.ps1
spicetify apply
```
