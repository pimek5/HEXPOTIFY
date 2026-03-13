# HEXpotify

Spicetify profile pack for a DynamicGlow-based setup.

## What It Adds

`extensions/hexpotify.js` adds 3 runtime features:

- `Lyrics++`: karaoke-style lyric glow and auto-scroll behavior.
- `Visualizer 2.0`: bottom bar visualizer with live analyzer + fallback modes and DynamicGlow color sync.
- `Session Stats Live`: small on-screen HUD with current-session listening stats.

`extensions/dynamic-glow-config.js` provides UI controls for DynamicGlow and HEXpotify visualizer parameters (including opacity, saturation, contrast, brightness, bloom boost, source lock, reconnect timing).

`extensions/hexpotify-profile-bootstrap.js` applies predefined `localStorage` settings once, so defaults match this pack.

## Included In This Repository

- `extensions/`:
	- `hexpotify.js`
	- `dynamic-glow-config.js`
	- `hexpotify-profile-bootstrap.js`
	- additional supporting extensions used by this profile pack
- `custom_apps/`:
	- `Lyrixed`
	- `spicetify-history`
	- `marketplace`
	- `genius-annotations`
	- `history-in-sidebar`
	- `Enhancify`
- `themes/DynamicGlow`
- `spicetify_profile/` snapshot used by the full-profile installer
- `scripts/install.ps1`
- `scripts/install-full-profile.ps1`
- `scripts/uninstall.ps1`
- `INSTALL-HEXpotify.cmd`

## Installation (Windows)

### Standard Install

```powershell
.\scripts\install.ps1
spicetify apply
```

What this script does:

- Copies bundled extensions to `%APPDATA%\spicetify\Extensions`.
- Copies bundled custom apps and themes.
- Enforces key `config-xpui.ini` values:
	- `current_theme = DynamicGlow`
	- `color_scheme = Dark-Base`
	- required extension list
	- required custom apps list
	- theme/js/css related flags

### Full Profile Install

```powershell
.\scripts\install-full-profile.ps1
```

What this script does:

- Copies the bundled `spicetify_profile/` snapshot into `%APPDATA%\spicetify`.
- Ensures HEXpotify extension entries exist in config.
- Runs `spicetify apply` automatically.

### One-Click Install

Double-click `INSTALL-HEXpotify.cmd`.

## Uninstall

```powershell
.\scripts\uninstall.ps1
spicetify apply
```

This removes `hexpotify.js` and `hexpotify-profile-bootstrap.js` from `%APPDATA%\spicetify\Extensions` and from the configured extension list.

## Notes

- This pack configures a reproducible profile preset, but account-bound Spotify data (history, recommendations, library state) is not part of the package.
- If you update files in this repo, run install again and apply:

```powershell
.\scripts\install.ps1
spicetify apply
```
