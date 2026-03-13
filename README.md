# HEXpotify

Spicetify profile pack for a DynamicGlow-based setup.

## What It Adds

`extensions/hexpotify.js` adds 3 runtime features:

- `Lyrics++`: karaoke-style lyric glow and auto-scroll behavior.
- `Visualizer 2.0`: bottom bar visualizer with live analyzer + fallback modes and DynamicGlow color sync.
- `Session Stats Live`: small on-screen HUD with current-session listening stats.

`extensions/dynamic-glow-config.js` provides UI controls for DynamicGlow and HEXpotify visualizer parameters (including opacity, saturation, contrast, brightness, bloom boost, source lock, reconnect timing).

`extensions/hexpotify-profile-bootstrap.js` applies predefined `localStorage` settings once, so defaults match this pack.

## Extensions Included (What They Actually Do)

- `extensions/hexpotify.js`: Lyrics++, Visualizer 2.0, Session Stats Live.
- `extensions/dynamic-glow-config.js`: in-app settings modal for DynamicGlow effects and HEXpotify visualizer parameters.
- `extensions/hexpotify-profile-bootstrap.js`: one-time bootstrap of `localStorage` defaults for this profile.
- `extensions/default-dynamic.js`: dynamic metadata/background behavior with API throttling and caching guards.
- `extensions/dynamicglow-features.js`: extra UI features (including hiding selected default library entries and dynamic lyrics background styling).
- `extensions/enhanced-effects.js`: animated glow, pulse, transition, and glassmorphism effect layer.
- `extensions/force-bloom.js`: persistent bloom enforcement for now-playing/sidebar cards.
- `extensions/innovative-effects.js`: additional visual layers (ripple, cover-art bloom, directional glow effects).
- `extensions/progress-bar-glow.js`: glow styling for progress and volume bars.
- `extensions/live-wrapped.js`: "Live Wrapped" / "Match Your Taste" views and focus/cover display modes.
- `extensions/listPlaylistsWithSong.js`: context-menu action to find playlists in your library containing a selected track.
- `extensions/dom-inspector.js`: debug helper that logs now-playing/right-sidebar DOM structure to console.
- `extensions/Vibrant.min.js`: color extraction utility used by visual effects/extensions.

## Included In This Repository

- `extensions/`:
	- all files listed in "Extensions Included"
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
