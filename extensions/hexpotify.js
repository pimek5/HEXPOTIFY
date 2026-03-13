// HEXpotify (8/9/10)
// 8: Lyrics++ (karaoke glow + auto-scroll)
// 9: Visualizer 2.0 (dynamic accent, mirrored bars)
// 10: Session Stats Live (today metrics HUD)

(async function superSpotify8910() {
    const DISPLAY_NAME = "HEXpotify";
    const EXT_ID = "super-spotify-8910";
    const SETTINGS_KEY = `${EXT_ID}:settings:v1`;
    const STATS_KEY = `${EXT_ID}:stats:v1`;

    while (!window.Spicetify?.Player || !window.Spicetify?.showNotification || !window.Spicetify?.CosmosAsync) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const defaultSettings = {
        lyricsPlusEnabled: true,
        visualizerEnabled: true,
        sessionHudEnabled: true,
        autoScrollLyrics: true,
    };

    function loadJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            return { ...fallback, ...JSON.parse(raw) };
        } catch (_) {
            return fallback;
        }
    }

    function saveJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (_) {
            // ignore storage failures
        }
    }

    let settings = loadJSON(SETTINGS_KEY, defaultSettings);

    function dateKey() {
        return new Date().toISOString().slice(0, 10);
    }

    function defaultStats() {
        return {
            day: dateKey(),
            listeningMs: 0,
            skips: 0,
            completions: 0,
            artistCounts: {},
        };
    }

    let stats = loadJSON(STATS_KEY, defaultStats());
    if (stats.day !== dateKey()) {
        stats = defaultStats();
        saveJSON(STATS_KEY, stats);
    }

    let _cachedAccentRgb = "255, 255, 255";
    let _accentCacheAt = 0;
    let _progressLastRaw = 0;
    let _progressLastAt = 0;
    let _analyserGiveUp = false;
    let _analyserConnectFails = 0;
    let _fallbackTempoBpm = 122;
    let _fallbackTempoEnergy = 0.7;
    let _vizSourceMode = "tempo";
    let _vizSourceLockedUntil = 0;
    let _analyserLowEnergySince = 0;
    const vizRuntimeConfig = {
        opacity: 0.94,
        saturation: 1.55,
        contrast: 1.12,
        brightness: 1.08,
        bloomBoost: 1.0,
        sourceLockMs: 1200,
        lowEnergyReconnectMs: 2500,
    };

    function clampNum(v, min, max, fallback) {
        const n = Number(v);
        if (!Number.isFinite(n)) return fallback;
        return Math.min(max, Math.max(min, n));
    }

    function loadVisualizerConfig() {
        try {
            const cfg = JSON.parse(localStorage.getItem("dynamicglow-config") || "{}");
            vizRuntimeConfig.opacity = clampNum(cfg.superVizOpacity, 0.4, 1, 0.94);
            vizRuntimeConfig.saturation = clampNum(cfg.superVizSaturation, 0.8, 2.4, 1.55);
            vizRuntimeConfig.contrast = clampNum(cfg.superVizContrast, 0.8, 1.8, 1.12);
            vizRuntimeConfig.brightness = clampNum(cfg.superVizBrightness, 0.7, 1.5, 1.08);
            vizRuntimeConfig.bloomBoost = clampNum(cfg.superVizBloomBoost, 0.5, 2.5, 1.0);
            vizRuntimeConfig.sourceLockMs = clampNum(cfg.superVizSourceLockMs, 300, 3000, 1200);
            vizRuntimeConfig.lowEnergyReconnectMs = clampNum(cfg.superVizLowEnergyReconnectMs, 800, 5000, 2500);
        } catch (_) {
            // Keep defaults on malformed config.
        }
    }

    function invalidateAccentCache() {
        _accentCacheAt = 0;
    }

    function parseRgbTriplet(raw) {
        if (!raw) return null;
        const m = raw.match(/(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
        if (!m) return null;
        const r = Math.max(0, Math.min(255, Number(m[1])));
        const g = Math.max(0, Math.min(255, Number(m[2])));
        const b = Math.max(0, Math.min(255, Number(m[3])));
        return `${r}, ${g}, ${b}`;
    }

    function parseCssColorToRgb(raw) {
        if (!raw) return null;
        const value = String(raw).trim();
        if (!value || value.includes("var(")) return null;

        const list = parseRgbTriplet(value);
        if (list) return list;

        const rgb = value.match(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i);
        if (rgb) {
            return `${Math.min(255, Number(rgb[1]))}, ${Math.min(255, Number(rgb[2]))}, ${Math.min(255, Number(rgb[3]))}`;
        }

        const hex = value.replace(/^#/, "");
        if (hex.length === 3 || hex.length === 6) {
            const h = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
            if (/^[0-9a-fA-F]{6}$/.test(h)) {
                const n = parseInt(h, 16);
                return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
            }
        }

        return null;
    }

    function getAccentRgb() {
        const now = Date.now();
        if (now - _accentCacheAt < 250) return _cachedAccentRgb;
        _accentCacheAt = now;

        const root = getComputedStyle(document.documentElement);
        // NOTE: CSS custom properties can contain unresolved var(...). Parse only valid numeric/hex colors.
        const candidates = [
            root.getPropertyValue("--extracted-color-rgb"),
            root.getPropertyValue("--glowify-glow-accent"),
            root.getPropertyValue("--extracted-color"),
            root.getPropertyValue("--spice-rgb-text"),
            root.getPropertyValue("--spice-text"),
        ];
        for (const candidate of candidates) {
            const parsed = parseCssColorToRgb(candidate);
            if (parsed) {
                _cachedAccentRgb = parsed;
                return _cachedAccentRgb;
            }
        }

        return _cachedAccentRgb;
    }

    function getAccentColor() {
        return `rgb(${getAccentRgb()})`;
    }

    function colorWithAlpha(_, alpha) {
        // Always use the cached accent RGB for consistency.
        return `rgba(${getAccentRgb()}, ${alpha})`;
    }

    function inferTempoFromAnalysis(data) {
        const beats = data?.beats;
        if (!beats?.length) return null;
        // Use local window average to avoid outliers from intro/outro sections.
        const sample = beats.slice(0, Math.min(64, beats.length));
        const avgDur = sample.reduce((acc, b) => acc + Math.max(0.01, b.duration || 0), 0) / sample.length;
        const bpm = 60 / Math.max(0.01, avgDur);
        if (!Number.isFinite(bpm)) return null;
        return Math.max(60, Math.min(220, bpm));
    }

    function getTempoFallbackWave(progressMs, barCount) {
        const t = Math.max(0, progressMs / 1000);
        const beatDur = 60 / Math.max(60, Math.min(220, _fallbackTempoBpm || 122));
        const beatProg = (t % beatDur) / beatDur;

        // Fast attack + smooth decay, driven by inferred tempo.
        const beatEnv = beatProg < 0.1
            ? 0.12 + 0.88 * (beatProg / 0.1)
            : Math.max(0.12, 1 - (beatProg - 0.1) / 0.9 * 0.88);

        const baseEnergy = Math.max(0.35, Math.min(1, _fallbackTempoEnergy || 0.7));
        const wave = new Array(barCount);
        for (let i = 0; i < barCount; i++) {
            const lane = i / (barCount - 1);
            const laneBoost = Math.max(0.35, 1 - Math.abs(lane - 0.5) * 1.2);
            const harmonic = 0.78 + 0.22 * Math.sin((t * 2.2) + i * 0.29);
            wave[i] = Math.max(0.05, beatEnv * baseEnergy * laneBoost * harmonic);
        }
        return wave;
    }

    function pickVizSource({ hasLiveEnergy, hasAnalysis }) {
        const now = performance.now();
        const next = hasLiveEnergy ? "live" : (hasAnalysis ? "analysis" : "tempo");

        // Debounce source switching to avoid frame-by-frame flapping.
        if (now < _vizSourceLockedUntil) return _vizSourceMode;
        if (next !== _vizSourceMode) {
            _vizSourceMode = next;
            _vizSourceLockedUntil = now + vizRuntimeConfig.sourceLockMs;
        }
        return _vizSourceMode;
    }

    function getInterpolatedProgressMs() {
        const raw = Number(Spicetify.Player?.getProgress?.() ?? Spicetify.Player?.data?.progress ?? 0);
        if (Math.abs(raw - _progressLastRaw) > 20) {
            _progressLastRaw = raw;
            _progressLastAt = performance.now();
        }
        if (Spicetify.Player?.data?.isPaused) return raw;
        return Math.max(0, raw + (performance.now() - _progressLastAt));
    }

    function getTrackState() {
        const item = Spicetify.Player?.data?.item;
        if (!item) return null;

        const title = item?.metadata?.title || item?.name || "Unknown";
        const artist =
            item?.metadata?.artist_name ||
            (Array.isArray(item?.artists) ? item.artists.map((a) => a.name).join(", ") : "Unknown Artist");

        const durationFromMeta = Number(item?.metadata?.duration || 0);
        const durationMs = Number(item?.duration?.milliseconds || durationFromMeta || 0);
        const uri = item?.uri || "";
        const trackId = uri.startsWith("spotify:track:") ? uri.split(":")[2] : "";

        return {
            id: uri || `${title}-${artist}`,
            trackId,
            title,
            artist,
            durationMs,
        };
    }

    function msToClock(ms) {
        const total = Math.floor(ms / 1000);
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    }

    function getTopArtist() {
        const pairs = Object.entries(stats.artistCounts || {});
        if (!pairs.length) return "-";
        pairs.sort((a, b) => b[1] - a[1]);
        return `${pairs[0][0]} (${pairs[0][1]})`;
    }

    // ----- Session Stats Live -----
    const hud = document.createElement("div");
    hud.id = `${EXT_ID}-hud`;
    hud.style.cssText = [
        "position: fixed",
        "right: 14px",
        "bottom: 110px",
        "z-index: 1000000",
        "padding: 10px 12px",
        "border-radius: 14px",
        "font-size: 12px",
        "line-height: 1.35",
        "color: var(--spice-text)",
        "background: rgba(var(--spice-rgb-main, 18,18,18), 0.72)",
        "border: 1px solid rgba(var(--spice-rgb-text,255,255,255), 0.15)",
        "backdrop-filter: blur(12px) saturate(1.2)",
        "box-shadow: 0 8px 28px rgba(0,0,0,0.35)",
        "min-width: 220px",
        "user-select: none",
    ].join(";");

    const hudToggleBtn = document.createElement("button");
    hudToggleBtn.id = `${EXT_ID}-hud-toggle`;
    hudToggleBtn.type = "button";
    hudToggleBtn.style.cssText = [
        "position: fixed",
        "right: 14px",
        "bottom: 82px",
        "z-index: 1000001",
        "height: 26px",
        "padding: 0 10px",
        "border-radius: 999px",
        "border: 1px solid rgba(var(--spice-rgb-text,255,255,255),0.20)",
        "color: var(--spice-text)",
        "background: rgba(var(--spice-rgb-main, 18,18,18), 0.80)",
        "backdrop-filter: blur(10px) saturate(1.2)",
        "font-size: 11px",
        "font-weight: 700",
        "letter-spacing: .25px",
        "cursor: pointer",
        "box-shadow: 0 6px 16px rgba(0,0,0,0.28)",
    ].join(";");

    function renderHud() {
        if (!settings.sessionHudEnabled) {
            hud.style.display = "none";
            hudToggleBtn.textContent = "Show Stats";
            return;
        }

        hud.style.display = "block";
        hudToggleBtn.textContent = "Hide Stats";
        hud.innerHTML = [
            `<div style="font-weight:700; margin-bottom:6px; opacity:.95;">${DISPLAY_NAME} Stats Live</div>`,
            `<div>Time today: <b>${msToClock(stats.listeningMs)}</b></div>`,
            `<div>Completions: <b>${stats.completions}</b></div>`,
            `<div>Skips: <b>${stats.skips}</b></div>`,
            `<div style="margin-top:4px; opacity:.9;">Top artist: <b>${getTopArtist()}</b></div>`,
            '<div style="margin-top:6px; opacity:.65; font-size:11px;">Ctrl+Shift+8 lyrics | Ctrl+Shift+9 viz | Ctrl+Shift+0 stats</div>',
        ].join("");
    }

    if (!document.getElementById(hud.id)) {
        document.body.appendChild(hud);
    }

    if (!document.getElementById(hudToggleBtn.id)) {
        document.body.appendChild(hudToggleBtn);
    }

    hudToggleBtn.addEventListener("click", () => {
        settings.sessionHudEnabled = !settings.sessionHudEnabled;
        saveJSON(SETTINGS_KEY, settings);
        renderHud();
        Spicetify.showNotification(`${DISPLAY_NAME} Stats Live: ${settings.sessionHudEnabled ? "ON" : "OFF"}`);
    });

    let lastTrack = null;
    let playedMsOnTrack = 0;
    const trackAnalysisCache = new Map();
    let activeTrackAnalysis = null;
    let activeTrackAnalysisTrackId = "";
    let activeSegmentIndex = 0;
    let activeBeatIndex = 0;
    let activeTatumIndex = 0;

    function _resetAnalysisState() {
        activeTrackAnalysis = null;
        activeTrackAnalysisTrackId = "";
        activeSegmentIndex = 0;
        activeBeatIndex = 0;
        activeTatumIndex = 0;
    }

    function _applyAnalysisData(trackId, data) {
        trackAnalysisCache.set(trackId, data);
        activeTrackAnalysis = data;
        activeTrackAnalysisTrackId = trackId;
        activeSegmentIndex = 0;
        activeBeatIndex = 0;
        activeTatumIndex = 0;

        const inferred = inferTempoFromAnalysis(data);
        if (inferred) _fallbackTempoBpm = inferred;

        const seg = data?.segments?.[0];
        if (seg) {
            const loudnessNorm = Math.max(0.35, Math.min(1, (Number(seg.loudness_max ?? -15) + 60) / 60));
            _fallbackTempoEnergy = loudnessNorm;
        }
    }

    function _synthesizeBeatsFromBpm(bpm, energy, trackDurationSec) {
        const beatDuration = 60 / bpm;
        const tatumDuration = beatDuration / 2;
        const beats = [], tatums = [];
        for (let t = 0; t < trackDurationSec; t += beatDuration) {
            beats.push({ start: t, duration: beatDuration, confidence: 0.8 });
        }
        for (let t = 0; t < trackDurationSec; t += tatumDuration) {
            tatums.push({ start: t, duration: tatumDuration, confidence: 0.7 });
        }
        // Flat pitch profile scaled by energy
        const pitches = new Array(12).fill(0.45 + energy * 0.35);
        const loudnessMax = -30 + energy * 28;
        return {
            beats,
            tatums,
            segments: [{ start: 0, duration: trackDurationSec, pitches, loudness_max: loudnessMax }],
            _synthesized: true,
        };
    }

    async function ensureTrackAnalysis(trackId) {
        if (!trackId) { _resetAnalysisState(); return; }

        if (trackAnalysisCache.has(trackId)) {
            const cached = trackAnalysisCache.get(trackId);
            activeTrackAnalysis = cached;
            activeTrackAnalysisTrackId = trackId;
            activeSegmentIndex = activeBeatIndex = activeTatumIndex = 0;
            return;
        }

        // 1. Try Spicetify's built-in getAudioData — uses sp:// internal protocol,
        //    does NOT count against the REST API rate limit.
        if (typeof Spicetify.getAudioData === "function") {
            try {
                const data = await Spicetify.getAudioData(`spotify:track:${trackId}`);
                if (data?.beats?.length) {
                    _applyAnalysisData(trackId, data);
                    console.log(`[${DISPLAY_NAME}] Audio analysis loaded via getAudioData — beats: ${data.beats.length}, tatums: ${data.tatums?.length ?? 0}`);
                    return;
                }
            } catch (e) {
                console.warn(`[${DISPLAY_NAME}] getAudioData failed:`, e?.message ?? e);
            }
        }

        // 2. Fallback: /v1/audio-features gives only BPM + energy (one tiny call, low rate-limit cost).
        //    We synthesize a regular beat grid from tempo so the visualizer still pulses at the right BPM.
        //    NOTE: We intentionally do NOT call /v1/audio-analysis directly — it is already 429-ing
        //    due to several other marketplace extensions all hitting that endpoint simultaneously.
        try {
            const features = await Spicetify.CosmosAsync.get(
                `https://api.spotify.com/v1/audio-features/${trackId}`
            );
            if (features?.tempo) {
                const bpm = features.tempo;
                const energy = Math.max(0.1, features.energy ?? 0.7);
                const trackDurationSec =
                    Number(Spicetify.Player?.data?.item?.duration?.milliseconds || 0) / 1000 || 300;
                const synth = _synthesizeBeatsFromBpm(bpm, energy, trackDurationSec);
                _applyAnalysisData(trackId, synth);
                _fallbackTempoBpm = Math.max(60, Math.min(220, bpm));
                _fallbackTempoEnergy = Math.max(0.35, Math.min(1, energy));
                console.log(`[${DISPLAY_NAME}] Synthesized beat grid — BPM: ${bpm.toFixed(1)}, energy: ${energy.toFixed(2)}`);
                return;
            }
        } catch (err) {
            const status = err?.status ?? err?.message ?? err;
            console.warn(`[${DISPLAY_NAME}] audio-features failed:`, status);
        }

        _resetAnalysisState();
        console.warn(`[${DISPLAY_NAME}] No beat data available for`, trackId);
    }

    function advanceIndex(arr, idx, t) {
        if (!arr?.length) return 0;
        idx = Math.max(0, Math.min(arr.length - 1, idx));
        while (idx < arr.length - 1 && arr[idx].start + arr[idx].duration < t) idx++;
        while (idx > 0 && arr[idx].start > t) idx--;
        return idx;
    }

    function getAnalysisWave(progressMs, barCount) {
        const analysis = activeTrackAnalysis;
        if (!analysis?.beats?.length) return null;

        const t = Math.max(0, progressMs / 1000);

        const segments = analysis.segments || [];
        if (segments.length) activeSegmentIndex = advanceIndex(segments, activeSegmentIndex, t);

        // Beat envelope — PRIMARY amplitude driver (range 0.12 → 1.0).
        let beatEnv = 0.12;
        activeBeatIndex = advanceIndex(analysis.beats, activeBeatIndex, t);
        const beat = analysis.beats[activeBeatIndex];
        if (beat) {
            const prog = Math.max(0, Math.min(1, (t - beat.start) / Math.max(0.01, beat.duration)));
            if (prog < 0.08) {
                beatEnv = 0.12 + 0.88 * (prog / 0.08);          // fast attack
            } else {
                beatEnv = Math.max(0.12, 1.0 - (prog - 0.08) / 0.92 * 0.88); // slow decay
            }
        }

        // Tatum sub-beat for high-frequency shimmer on upper bars.
        let tatumEnv = 0.12;
        const tatums = analysis.tatums;
        if (tatums?.length) {
            activeTatumIndex = advanceIndex(tatums, activeTatumIndex, t);
            const tat = tatums[activeTatumIndex];
            if (tat) {
                const prog = Math.max(0, Math.min(1, (t - tat.start) / Math.max(0.005, tat.duration)));
                if (prog < 0.10) {
                    tatumEnv = 0.12 + 0.88 * (prog / 0.10);
                } else {
                    tatumEnv = Math.max(0.12, 1.0 - (prog - 0.10) / 0.90 * 0.88);
                }
            }
        }

        const seg = segments.length ? (segments[activeSegmentIndex] || segments[0]) : null;
        const pitches = Array.isArray(seg?.pitches) && seg.pitches.length ? seg.pitches : new Array(12).fill(0.5);
        const loudnessNorm = Math.max(0.4, Math.min(1, (Number(seg?.loudness_max ?? -15) + 60) / 60));

        const wave = new Array(barCount);
        for (let i = 0; i < barCount; i++) {
            const lane = i / (barCount - 1);
            const laneBoost = Math.max(0.28, 1 - Math.abs(lane - 0.5) * 1.4);
            const p = 0.4 + (pitches[i % pitches.length] || 0) * 0.6;
            // Low bars (0–50%) pulse with beat, upper bars shimmer with tatum.
            const ratio = i / barCount;
            const env = ratio < 0.5 ? beatEnv : (ratio < 0.72 ? beatEnv * 0.55 + tatumEnv * 0.45 : tatumEnv);
            wave[i] = Math.max(0.05, env * loudnessNorm * laneBoost * p);
        }

        return wave;
    }

    function finalizeTrack() {
        if (!lastTrack || !lastTrack.durationMs) return;
        const ratio = playedMsOnTrack / Math.max(lastTrack.durationMs, 1);
        if (playedMsOnTrack > 7000) {
            if (ratio >= 0.85) stats.completions += 1;
            else stats.skips += 1;
        }
        saveJSON(STATS_KEY, stats);
    }

    function onSongChange() {
        // Force immediate color refresh so DynamicGlow's new album color is picked up right away.
        invalidateAccentCache();
        // Reset source state and allow analyser retry on every track.
        _vizSourceMode = "tempo";
        _vizSourceLockedUntil = 0;
        _analyserGiveUp = false;
        _analyserConnectFails = 0;
        _analyserLowEnergySince = 0;
        analyserReady = false;
        analyserSource = null;
        analyserMode = "none";
        lastAnalyserTryAt = 0;
        finalizeTrack();
        const nowTrack = getTrackState();
        lastTrack = nowTrack;
        playedMsOnTrack = 0;
        if (nowTrack?.artist) {
            stats.artistCounts[nowTrack.artist] = (stats.artistCounts[nowTrack.artist] || 0) + 1;
            saveJSON(STATS_KEY, stats);
        }

        if (nowTrack?.trackId && nowTrack.trackId !== activeTrackAnalysisTrackId) {
            ensureTrackAnalysis(nowTrack.trackId);
        }

        renderHud();
    }

    const statsTick = setInterval(() => {
        if (stats.day !== dateKey()) {
            stats = defaultStats();
        }

        if (!Spicetify.Player?.data?.isPaused) {
            stats.listeningMs += 1000;
            playedMsOnTrack += 1000;
            if ((stats.listeningMs / 1000) % 10 === 0) {
                saveJSON(STATS_KEY, stats);
            }
            renderHud();
        }
    }, 1000);

    Spicetify.Player.addEventListener("songchange", onSongChange);

    // ----- Lyrics++ -----
    const lyricsStyleId = `${EXT_ID}-lyrics-style`;
    function ensureLyricsStyle() {
        let style = document.getElementById(lyricsStyleId);
        if (!style) {
            style = document.createElement("style");
            style.id = lyricsStyleId;
            document.head.appendChild(style);
        }

        style.textContent = settings.lyricsPlusEnabled
            ? `
            .lyrics-lyricsContent-lyric,
            .lyric {
                transition: transform .2s ease, text-shadow .2s ease, opacity .2s ease;
            }

            .lyrics-lyricsContent-lyric[data-active="true"],
            .lyrics-lyricsContent-active,
            .lyric.active {
                color: var(--extracted-color, var(--glowify-glow-accent, var(--spice-text))) !important;
                text-shadow:
                    0 0 14px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), .9),
                    0 0 32px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), .55),
                    0 0 60px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), .3) !important;
                transform: scale(1.03);
                opacity: 1 !important;
                font-weight: 700 !important;
            }

            .lyrics-lyricsContent-lyric:not([data-active="true"]) {
                opacity: .72;
            }
        `
            : "";
    }

    let lastActiveLyric = null;
    const lyricsTick = setInterval(() => {
        if (!settings.lyricsPlusEnabled || !settings.autoScrollLyrics) return;
        const active = document.querySelector(
            '.lyrics-lyricsContent-lyric[data-active="true"], .lyrics-lyricsContent-active, .lyric.active'
        );
        if (!active || active === lastActiveLyric) return;
        lastActiveLyric = active;
        try {
            active.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        } catch (_) {
            // ignore
        }
    }, 700);

    // ----- Visualizer 2.0 -----
    const vizCanvas = document.createElement("canvas");
    vizCanvas.id = `${EXT_ID}-visualizer`;
    function applyVisualizerCanvasStyle() {
        vizCanvas.style.cssText = [
            "position: fixed",
            "left: 50%",
            "bottom: 98px",
            "transform: translateX(-50%)",
            "width: min(48vw, 620px)",
            "height: 90px",
            "pointer-events: none",
            "z-index: 999999",
            `opacity: ${vizRuntimeConfig.opacity.toFixed(2)}`,
            `filter: saturate(${vizRuntimeConfig.saturation.toFixed(2)}) contrast(${vizRuntimeConfig.contrast.toFixed(2)}) brightness(${vizRuntimeConfig.brightness.toFixed(2)}) drop-shadow(0 0 ${Math.round(28 * vizRuntimeConfig.bloomBoost)}px rgba(255,255,255,.36))`,
        ].join(";");
    }
    loadVisualizerConfig();
    applyVisualizerCanvasStyle();
    document.body.appendChild(vizCanvas);

    const vctx = vizCanvas.getContext("2d");
    const BAR_COUNT = 84;
    const barData = new Array(BAR_COUNT).fill(0);
    let audioCtx = null;
    let analyser = null;
    let analyserData = null;
    let analyserSource = null;
    let analyserReady = false;
    let analyserMode = "none";
    let lastAnalyserTryAt = 0;
    let zeroEnergyFrames = 0;

    function tryInitAudioAnalyser() {
        const now = Date.now();
        if (analyserReady) return true;
        if (_analyserGiveUp) return false;
        if (now - lastAnalyserTryAt < 1500) return false;
        lastAnalyserTryAt = now;

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return false;

            if (!audioCtx) {
                audioCtx = new AudioCtx();
            }

            if (audioCtx.state === "suspended") {
                audioCtx.resume().catch(() => {});
            }

            const mediaEls = Array.from(document.querySelectorAll("audio, video"));
            const mediaEl =
                mediaEls.find((el) => (el?.currentSrc || el?.src) && !el.paused) ||
                mediaEls.find((el) => el?.currentSrc || el?.src) ||
                mediaEls[0];
            if (!mediaEl) return false;

            if (!analyser) {
                analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.72;
                analyserData = new Uint8Array(analyser.frequencyBinCount);
            }

            if (!analyserSource) {
                try {
                    const stream =
                        (typeof mediaEl.captureStream === "function" && mediaEl.captureStream()) ||
                        (typeof mediaEl.mozCaptureStream === "function" && mediaEl.mozCaptureStream()) ||
                        null;

                    if (stream) {
                        analyserSource = audioCtx.createMediaStreamSource(stream);
                        analyserSource.connect(analyser);
                        analyserMode = "capture-stream";
                    } else {
                        // Fallback if captureStream is unavailable.
                        analyserSource = audioCtx.createMediaElementSource(mediaEl);
                        analyserSource.connect(analyser);
                        analyser.connect(audioCtx.destination);
                        analyserMode = "media-element";
                    }
                } catch (_) {
                    _analyserConnectFails++;
                    if (_analyserConnectFails >= 4) {
                        _analyserGiveUp = true;
                        console.log(`[${DISPLAY_NAME}] Visualizer live analyser disabled (not available in this context)`);
                    }
                    return false;
                }
            }

            analyserReady = true;
            console.log(`[${DISPLAY_NAME}] Visualizer analyser connected (${analyserMode})`);
            return true;
        } catch (e) {
            return false;
        }
    }

    function resizeViz() {
        const width = Math.min(window.innerWidth * 0.48, 620);
        vizCanvas.width = Math.max(300, Math.floor(width));
        vizCanvas.height = 90;
    }

    function getNowPlayingBarRect() {
        const selector = [
            ".Root__now-playing-bar",
            ".main-nowPlayingBar-nowPlayingBar",
            ".main-nowPlayingBar-container",
            "[data-testid='now-playing-bar']",
        ].join(",");

        const bar = document.querySelector(selector);
        return bar?.getBoundingClientRect() || null;
    }

    function positionVisualizer() {
        const rect = getNowPlayingBarRect();
        if (!rect) {
            vizCanvas.style.left = "50%";
            vizCanvas.style.bottom = "98px";
            return;
        }

        const centerX = rect.left + rect.width / 2;
        const bottomOffset = Math.max(84, Math.round(window.innerHeight - rect.top + 6));
        vizCanvas.style.left = `${Math.round(centerX)}px`;
        vizCanvas.style.bottom = `${bottomOffset}px`;
    }

    resizeViz();
    window.addEventListener("resize", resizeViz);

    function drawVisualizer() {
        if (!settings.visualizerEnabled) {
            vizCanvas.style.display = "none";
            requestAnimationFrame(drawVisualizer);
            return;
        }

        vizCanvas.style.display = "block";
        const accent = getAccentColor();
        const isPlaying = !Spicetify.Player?.data?.isPaused;
        const progressMs = getInterpolatedProgressMs();
        const hasAudioAnalyser = tryInitAudioAnalyser();

        if (hasAudioAnalyser && analyser && analyserData) {
            if (audioCtx?.state === "suspended" && !Spicetify.Player?.data?.isPaused) {
                audioCtx.resume().catch(() => {});
            }
            analyser.getByteFrequencyData(analyserData);
        }

        let useLiveAnalyser = false;
        if (hasAudioAnalyser && analyserData && !Spicetify.Player?.data?.isPaused) {
            let totalEnergy = 0;
            for (let i = 0; i < analyserData.length; i++) totalEnergy += analyserData[i] || 0;
            if (totalEnergy < analyserData.length * 0.9) {
                zeroEnergyFrames += 1;
                if (!_analyserLowEnergySince) _analyserLowEnergySince = performance.now();
            } else {
                zeroEnergyFrames = 0;
                _analyserLowEnergySince = 0;
                useLiveAnalyser = true;
            }

            // If analyser stays near-zero for ~2.5s while playing, force reconnect.
            if (_analyserLowEnergySince && performance.now() - _analyserLowEnergySince > vizRuntimeConfig.lowEnergyReconnectMs) {
                analyserReady = false;
                analyserSource = null;
                analyserMode = "none";
                lastAnalyserTryAt = 0;
                zeroEnergyFrames = 0;
                _analyserLowEnergySince = 0;
                console.log(`[${DISPLAY_NAME}] Visualizer analyser reconnect requested`);
            }
        } else {
            zeroEnergyFrames = 0;
            _analyserLowEnergySince = 0;
        }

        const analysisWave = !useLiveAnalyser ? getAnalysisWave(progressMs, BAR_COUNT) : null;
        const sourceMode = pickVizSource({ hasLiveEnergy: useLiveAnalyser, hasAnalysis: !!analysisWave });
        const tempoWave = sourceMode === "tempo" ? getTempoFallbackWave(progressMs, BAR_COUNT) : null;

        vctx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
        vctx.fillStyle = "rgba(0,0,0,0)";
        vctx.fillRect(0, 0, vizCanvas.width, vizCanvas.height);

        const centerY = vizCanvas.height / 2;
        const gap = 1.8;
        const barW = vizCanvas.width / BAR_COUNT - gap;
        const topPoints = [];
        const bottomPoints = [];

        for (let i = 0; i < BAR_COUNT; i++) {
            const lane = i / BAR_COUNT;
            const laneBoost = 1 - Math.abs(lane - 0.5) * 0.75;

            let wave = 0;
            if (sourceMode === "live" && hasAudioAnalyser && analyserData) {
                const freqIndex = Math.floor((i / BAR_COUNT) * analyserData.length);
                const energy = (analyserData[freqIndex] || 0) / 255;
                wave = 0.03 + energy * (0.92 + laneBoost * 0.06);
            } else if (sourceMode === "analysis" && analysisWave) {
                wave = analysisWave[i] || 0;
            } else if (tempoWave) {
                wave = tempoWave[i] || 0;
            } else {
                // No fake animation: only audio-driven modes are allowed.
                wave = 0;
            }

            const target = Math.max(0.03, wave);
            barData[i] += (target - barData[i]) * (isPlaying ? 0.33 : 0.10);

            const amp = barData[i] * vizCanvas.height * 0.38;
            const x = i * (barW + gap);

            topPoints.push({ x: x + barW / 2, y: centerY - amp });
            bottomPoints.push({ x: x + barW / 2, y: centerY + amp });

            // Capsule bars (new style): slimmer, rounded, neon core.
            const capsuleH = Math.max(4, amp * 1.72);
            const capsuleY = centerY - capsuleH / 2;
            const radius = Math.max(2, Math.min(barW / 2, capsuleH / 2));

            const capGrad = vctx.createLinearGradient(x, capsuleY, x, capsuleY + capsuleH);
            capGrad.addColorStop(0, colorWithAlpha(accent, 0.16));
            capGrad.addColorStop(0.25, colorWithAlpha(accent, 1));
            capGrad.addColorStop(0.75, colorWithAlpha(accent, 1));
            capGrad.addColorStop(1, colorWithAlpha(accent, 0.16));

            vctx.fillStyle = capGrad;
            vctx.shadowBlur = 30 * vizRuntimeConfig.bloomBoost;
            vctx.shadowColor = accent;
            vctx.beginPath();
            vctx.moveTo(x + radius, capsuleY);
            vctx.lineTo(x + barW - radius, capsuleY);
            vctx.quadraticCurveTo(x + barW, capsuleY, x + barW, capsuleY + radius);
            vctx.lineTo(x + barW, capsuleY + capsuleH - radius);
            vctx.quadraticCurveTo(x + barW, capsuleY + capsuleH, x + barW - radius, capsuleY + capsuleH);
            vctx.lineTo(x + radius, capsuleY + capsuleH);
            vctx.quadraticCurveTo(x, capsuleY + capsuleH, x, capsuleY + capsuleH - radius);
            vctx.lineTo(x, capsuleY + radius);
            vctx.quadraticCurveTo(x, capsuleY, x + radius, capsuleY);
            vctx.closePath();
            vctx.fill();

            // Soft halo to make glow richer.
            vctx.fillStyle = colorWithAlpha(accent, 0.30);
            vctx.shadowBlur = 48 * vizRuntimeConfig.bloomBoost;
            vctx.fillRect(x, capsuleY, barW, capsuleH);
        }

        // Central baseline glow.
        vctx.strokeStyle = colorWithAlpha(accent, 0.44);
        vctx.lineWidth = 1.5;
        vctx.shadowBlur = 24 * vizRuntimeConfig.bloomBoost;
        vctx.shadowColor = accent;
        vctx.beginPath();
        vctx.moveTo(0, centerY);
        vctx.lineTo(vizCanvas.width, centerY);
        vctx.stroke();

        // Neon ribbon (top and bottom curves) for new style identity.
        function drawRibbon(points, alpha, width) {
            if (!points.length) return;
            vctx.beginPath();
            vctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2;
                const yc = (points[i].y + points[i + 1].y) / 2;
                vctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            const last = points[points.length - 1];
            vctx.lineTo(last.x, last.y);
            vctx.strokeStyle = colorWithAlpha(accent, alpha);
            vctx.lineWidth = width;
            vctx.shadowBlur = 34 * vizRuntimeConfig.bloomBoost;
            vctx.shadowColor = accent;
            vctx.stroke();
        }

        drawRibbon(topPoints, 0.82, 2.2);
        drawRibbon(bottomPoints, 0.76, 2.0);

        vctx.shadowBlur = 0;
        positionVisualizer();
        requestAnimationFrame(drawVisualizer);
    }

    // ----- Hotkeys -----
    function toggleSetting(key, label) {
        settings[key] = !settings[key];
        saveJSON(SETTINGS_KEY, settings);
        if (key === "lyricsPlusEnabled") ensureLyricsStyle();
        renderHud();
        Spicetify.showNotification(`${label}: ${settings[key] ? "ON" : "OFF"}`);
    }

    document.addEventListener("keydown", (e) => {
        if (!e.ctrlKey || !e.shiftKey) return;
        if (e.code === "Digit8") toggleSetting("lyricsPlusEnabled", "Lyrics++");
        if (e.code === "Digit9") toggleSetting("visualizerEnabled", "Visualizer 2.0");
        if (e.code === "Digit0") toggleSetting("sessionHudEnabled", "Session Stats Live");
    });

    ensureLyricsStyle();
    renderHud();
    onSongChange();
    const accentObserver = new MutationObserver(() => invalidateAccentCache());
    accentObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    if (document.body) {
        accentObserver.observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });
    }
    const vizConfigTick = setInterval(() => {
        loadVisualizerConfig();
        applyVisualizerCanvasStyle();
    }, 1500);
    drawVisualizer();

    // Cleanup on hard reload of extension context
    window.addEventListener("beforeunload", () => {
        clearInterval(statsTick);
        clearInterval(lyricsTick);
        clearInterval(vizConfigTick);
        accentObserver.disconnect();
    });

    console.log(`[${DISPLAY_NAME}] loaded`);
})();
