(async function () {
    const EXT_NAME = "Live Wrapped";
    
    // Wait for React
    while (!Spicetify?.React || !Spicetify?.ReactDOM || !Spicetify?.Platform || !Spicetify?.CosmosAsync) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const { React, ReactDOM } = Spicetify;
    const { useState, useEffect, useMemo } = React;

    // API Settings
    let isEnabled = true;
    
    function loadSettings() {
        try {
            const config = JSON.parse(localStorage.getItem('dynamicglow:config') || '{}');
            isEnabled = config.enableMatchYourTaste !== false;
            console.log('[Live Wrapped] Feature', isEnabled ? 'enabled' : 'disabled');
        } catch (err) {
            console.log('[Live Wrapped] Using default settings');
        }
    }
    
    window.MatchYourTasteAPI = {
        setEnabled: (enabled) => {
            isEnabled = enabled;
            console.log('[Live Wrapped]', enabled ? 'Enabled' : 'Disabled');
        },
    };
    
    loadSettings();

    // Cache for API data - LONG cache to avoid 429 errors
    const wrappedCache = new Map();
    const CACHE_TTL_MS = 1800000; // 30 min cache (Spotify rate limits are strict)
    const COOLDOWN_AFTER_429_MS = 180000; // 3 min cooldown after 429
    let radarCooldownUntil = 0;

    // Focus/Cover mode cycling
    const MODE_STORAGE_KEY = 'dynamicglow:focusCoverMode';
    const MODES = ['off', 'focus', 'cover'];
    let currentModeIndex = 0;
    let coverListenerBound = false;
    let focusListenerBound = false;
    let focusUpdateTimer = null;
    let coverUpdateTimer = null;
    let coverIdleTimer = null;
    let focusIdleTimer = null;
    let focusNextText = '';
    let lastQueueFetch = 0;

    function getCurrentTrackInfo() {
        const item = Spicetify.Player?.data?.item;
        if (!item) return null;

        return {
            title: item?.metadata?.title || item?.name || 'Unknown Track',
            artist: item?.metadata?.artist_name || item?.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
            image: item?.metadata?.image_url || item?.album?.images?.[0]?.url || ''
        };
    }

    function ensureModeStyles() {
        if (document.getElementById('dg-focus-cover-styles')) return;
        const style = document.createElement('style');
        style.id = 'dg-focus-cover-styles';
        style.textContent = `
            .dg-focus-mode .Root__nav-bar,
            .dg-focus-mode .main-navBar-navBar,
            .dg-focus-mode .main-topBar-container,
            .dg-focus-mode .Root__right-sidebar,
            .dg-focus-mode .main-rightSidebar-container,
            .dg-focus-mode .Root__now-playing-bar,
            .dg-focus-mode .main-nowPlayingBar-container {
                display: none !important;
            }

            .dg-focus-mode .Root__main-view {
                margin-left: 0 !important;
                background: radial-gradient(circle at 20% 10%, rgba(130,140,255,0.08), transparent 45%),
                            radial-gradient(circle at 80% 80%, rgba(255,120,120,0.06), transparent 50%),
                            linear-gradient(180deg, rgba(10,10,14,0.5), rgba(10,10,12,0.9));
            }

            .dg-focus-mode .main-view-container__scroll-node-child,
            .dg-focus-mode .main-view-container__scroll-node {
                position: relative;
            }

            .dg-focus-mode .main-view-container__scroll-node-child::before,
            .dg-focus-mode .main-view-container__scroll-node::before {
                content: "";
                position: absolute;
                inset: 0;
                pointer-events: none;
                background: radial-gradient(circle at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.45) 100%);
                opacity: 0.9;
            }

            .dg-focus-mode .Root__top-container::after {
                content: "";
                position: absolute;
                inset: 0;
                pointer-events: none;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.08'/></svg>");
                mix-blend-mode: soft-light;
                opacity: 0.5;
            }

            .dg-mode-floating {
                position: fixed !important;
                top: 12px;
                right: 16px;
                z-index: 999999;
                background: rgba(20,20,28,0.8) !important;
                border: 1px solid rgba(255,255,255,0.2) !important;
                border-radius: 999px !important;
                padding: 8px 10px !important;
                backdrop-filter: blur(12px);
            }

            .dg-focus-overlay {
                position: fixed;
                inset: 0;
                z-index: 999998;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
                isolation: isolate;
            }

            .dg-focus-overlay::before {
                content: "";
                position: absolute;
                inset: 0;
                background: radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.9) 100%);
                opacity: 1;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                pointer-events: none;
                z-index: 1;
            }

            .dg-focus-overlay .dg-focus-panel {
                pointer-events: auto;
                width: min(85vw, 820px);
                background: rgba(12,12,18,0.7);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 28px;
                padding: 28px 32px;
                box-shadow: 0 40px 120px rgba(0,0,0,0.55);
                backdrop-filter: blur(20px);
                display: grid;
                gap: 20px;
                position: relative;
                z-index: 2;
            }

            .dg-focus-overlay .dg-focus-header {
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 20px;
                align-items: center;
            }

            .dg-focus-overlay .dg-focus-cover {
                width: 120px;
                height: 120px;
                border-radius: 18px;
                object-fit: cover;
                box-shadow: 0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08);
            }

            .dg-focus-overlay .dg-focus-title {
                font-size: 34px;
                font-weight: 900;
                line-height: 1.1;
                text-shadow: 0 20px 40px rgba(0,0,0,0.6);
            }

            .dg-focus-overlay .dg-focus-artist {
                font-size: 16px;
                text-transform: uppercase;
                letter-spacing: 1.2px;
                color: rgba(255,255,255,0.65);
                margin-top: 6px;
            }

            .dg-focus-overlay .dg-focus-progress {
                height: 10px;
                background: rgba(255,255,255,0.12);
                border-radius: 999px;
                overflow: hidden;
                box-shadow: inset 0 0 8px rgba(0,0,0,0.5);
            }

            .dg-focus-overlay .dg-focus-progress-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, var(--glowify-glow-accent, var(--spice-text)), rgba(255,255,255,0.85));
                box-shadow: 0 0 18px rgba(255,255,255,0.35);
                border-radius: 999px;
            }

            .dg-focus-overlay .dg-focus-meta {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: rgba(255,255,255,0.6);
            }

            .dg-focus-overlay .dg-focus-next {
                font-size: 13px;
                color: rgba(255,255,255,0.75);
                padding: 10px 12px;
                border-radius: 14px;
                border: 1px solid rgba(255,255,255,0.1);
                background: rgba(255,255,255,0.04);
            }

            .dg-focus-overlay .dg-focus-volume {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .dg-focus-overlay .dg-focus-volume input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                width: 180px;
                height: 6px;
                background: rgba(255,255,255,0.2);
                border-radius: 999px;
                outline: none;
            }

            .dg-focus-overlay .dg-focus-volume input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: var(--glowify-glow-accent, var(--spice-text));
                box-shadow: 0 0 10px rgba(255,255,255,0.4);
                cursor: pointer;
            }

            .dg-focus-overlay.dg-focus-idle .dg-focus-panel {
                opacity: 0.65;
                transform: scale(0.985);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            .dg-focus-overlay .dg-focus-next {
                font-size: 13px;
                color: rgba(255,255,255,0.75);
                padding: 10px 12px;
                border-radius: 14px;
                border: 1px solid rgba(255,255,255,0.1);
                background: rgba(255,255,255,0.04);
            }

            .dg-focus-overlay .dg-focus-actions {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }

            .dg-focus-overlay .dg-focus-actions button {
                background: rgba(255,255,255,0.12);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                padding: 10px 16px;
                border-radius: 18px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 700;
                transition: transform 0.2s ease, background 0.2s ease;
            }

            .dg-focus-overlay .dg-focus-actions button:hover {
                transform: translateY(-2px);
                background: rgba(255,255,255,0.2);
            }

            .dg-focus-orb {
                position: absolute;
                width: 220px;
                height: 220px;
                border-radius: 50%;
                filter: blur(0px);
                opacity: 0.35;
                animation: dgFloat 10s ease-in-out infinite;
                background: radial-gradient(circle, rgba(255,255,255,0.35), transparent 65%);
                pointer-events: none;
                z-index: 1;
            }

            .dg-focus-orb.orb-a {
                top: 10%;
                left: 8%;
                animation-delay: 0s;
            }

            .dg-focus-orb.orb-b {
                bottom: 12%;
                right: 10%;
                animation-delay: 2s;
            }

            .dg-focus-orb.orb-c {
                top: 55%;
                left: 50%;
                width: 160px;
                height: 160px;
                animation-delay: 4s;
            }

            #dg-cover-zoom {
                position: fixed;
                inset: 0;
                z-index: 999999;
                background: radial-gradient(circle at top, rgba(50,50,70,0.9), rgba(8,8,12,0.98));
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 24px;
                color: white;
                animation: dgZoomIn 0.35s ease-out;
                cursor: none;
            }

            #dg-cover-zoom.dg-cursor-active {
                cursor: auto;
            }

            #dg-cover-zoom .dg-cover-bg {
                position: absolute;
                inset: 0;
                background-size: cover;
                background-position: center;
                filter: blur(50px) brightness(0.6) saturate(1.2);
                opacity: 0.65;
                transform: scale(1.05);
            }

            #dg-cover-zoom .dg-cover-grain {
                position: absolute;
                inset: 0;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.08'/></svg>");
                mix-blend-mode: soft-light;
                opacity: 0.55;
                pointer-events: none;
            }

            #dg-cover-zoom .dg-cover-content {
                position: relative;
                z-index: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16px;
                text-align: center;
                padding: 28px 32px;
                background: rgba(10,10,14,0.55);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 24px;
                backdrop-filter: blur(18px);
                box-shadow: 0 30px 80px rgba(0,0,0,0.45);
                transform: translateZ(0);
            }

            #dg-cover-zoom .dg-cover-art {
                width: min(60vw, 420px);
                height: min(60vw, 420px);
                border-radius: 20px;
                box-shadow: 0 30px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1);
                object-fit: cover;
                transform: translateY(-4px);
                animation: dgFloat 6s ease-in-out infinite;
            }

            #dg-cover-zoom .dg-cover-art:hover {
                transform: translateY(-10px) scale(1.01);
            }

            #dg-cover-zoom .dg-cover-title {
                font-size: 30px;
                font-weight: 900;
                letter-spacing: 0.3px;
                text-shadow: 0 10px 30px rgba(0,0,0,0.55);
            }

            #dg-cover-zoom .dg-cover-artist {
                font-size: 15px;
                text-transform: uppercase;
                letter-spacing: 1.4px;
                color: rgba(255,255,255,0.65);
            }

            #dg-cover-zoom .dg-cover-progress {
                width: min(60vw, 360px);
                height: 8px;
                background: rgba(255,255,255,0.12);
                border-radius: 999px;
                overflow: hidden;
                margin-top: 8px;
            }

            #dg-cover-zoom .dg-cover-progress-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, var(--glowify-glow-accent, var(--spice-text)), rgba(255,255,255,0.85));
                border-radius: 999px;
            }

            #dg-cover-zoom .dg-cover-controls {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }

            #dg-cover-zoom .dg-cover-wave {
                width: min(60vw, 360px);
                height: 26px;
                margin-top: 8px;
                background: repeating-linear-gradient(
                    90deg,
                    rgba(255,255,255,0.7) 0,
                    rgba(255,255,255,0.7) 2px,
                    transparent 2px,
                    transparent 6px
                );
                opacity: 0.5;
                mask: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
                animation: dgWaveMove 2.8s linear infinite;
            }

            #dg-cover-zoom .dg-cover-volume {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 6px;
            }

            #dg-cover-zoom .dg-cover-volume input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                width: 200px;
                height: 6px;
                background: rgba(255,255,255,0.2);
                border-radius: 999px;
                outline: none;
            }

            #dg-cover-zoom .dg-cover-volume input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: var(--glowify-glow-accent, var(--spice-text));
                box-shadow: 0 0 10px rgba(255,255,255,0.4);
                cursor: pointer;
            }

            #dg-cover-zoom .dg-cover-controls button {
                background: rgba(255,255,255,0.12);
                border: 1px solid rgba(255,255,255,0.25);
                color: white;
                padding: 8px 14px;
                border-radius: 18px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 700;
            }

            #dg-cover-zoom.dg-cover-idle .dg-cover-content {
                opacity: 0.65;
                transform: scale(0.985);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            #dg-cover-zoom .dg-cover-exit {
                margin-top: 12px;
                background: rgba(255,255,255,0.15);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 700;
                transition: transform 0.2s ease, background 0.2s ease;
            }

            #dg-cover-zoom .dg-cover-exit:hover {
                background: rgba(255,255,255,0.25);
                transform: translateY(-2px);
            }

            @keyframes dgZoomIn {
                from {
                    opacity: 0;
                    transform: scale(0.98);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes dgFloat {
                0%, 100% { transform: translateY(-4px); }
                50% { transform: translateY(6px); }
            }

            @keyframes dgWaveMove {
                0% { background-position: 0 0; }
                100% { background-position: 120px 0; }
            }
        `;
        document.head.appendChild(style);
    }

    function updateCoverOverlay() {
        const overlay = document.getElementById('dg-cover-zoom');
        if (!overlay) return;

        const info = getCurrentTrackInfo();
        const bg = overlay.querySelector('.dg-cover-bg');
        const img = overlay.querySelector('.dg-cover-art');
        const title = overlay.querySelector('.dg-cover-title');
        const artist = overlay.querySelector('.dg-cover-artist');
        const progressFill = overlay.querySelector('.dg-cover-progress-fill');
        const volumeInput = overlay.querySelector('.dg-cover-volume input[type="range"]');

        if (!info) return;

        if (bg && info.image) bg.style.backgroundImage = `url('${info.image}')`;
        if (img && info.image) img.src = info.image;
        if (title) title.textContent = info.title;
        if (artist) artist.textContent = info.artist;
        if (progressFill) {
            const duration = Number.isFinite(Spicetify.Player?.data?.item?.duration) ? Spicetify.Player.data.item.duration : 0;
            const progressValue = Spicetify.Player?.getProgress?.() ?? Spicetify.Player?.data?.progress ?? 0;
            const progress = Number.isFinite(progressValue) ? progressValue : 0;
            const percent = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;
            progressFill.style.width = `${percent}%`;
        }
        if (volumeInput) {
            const volume = Spicetify.Player?.getVolume?.() ?? 0.5;
            volumeInput.value = Math.round(volume * 100);
        }
    }

    function updateCoverCursorState(overlay) {
        if (!overlay) return;
        overlay.classList.add('dg-cursor-active');
        overlay.classList.remove('dg-cover-idle');
        if (coverIdleTimer) clearTimeout(coverIdleTimer);
        coverIdleTimer = setTimeout(() => {
            overlay.classList.remove('dg-cursor-active');
            overlay.classList.add('dg-cover-idle');
        }, 1500);
    }

    function updateFocusIdleState() {
        const overlay = document.getElementById('dg-focus-overlay');
        if (!overlay) return;
        overlay.classList.remove('dg-focus-idle');
        if (focusIdleTimer) clearTimeout(focusIdleTimer);
        focusIdleTimer = setTimeout(() => {
            overlay.classList.add('dg-focus-idle');
        }, 2000);
    }

    async function fetchNextInQueue() {
        const now = Date.now();
        if (now - lastQueueFetch < 15000) return;
        lastQueueFetch = now;

        try {
            if (Spicetify.Platform?.PlayerAPI?.getQueue) {
                const queue = await Spicetify.Platform.PlayerAPI.getQueue();
                const next = queue?.next?.[0] || queue?.nextTracks?.[0] || null;
                if (next?.name) {
                    const artists = next.artists?.map(a => a.name).join(', ') || '';
                    focusNextText = artists ? `Next up: ${next.name} - ${artists}` : `Next up: ${next.name}`;
                    return;
                }
            }

            const fallback = Spicetify.Player?.data?.nextTracks?.[0];
            if (fallback?.name) {
                const artists = fallback.artists?.map(a => a.name).join(', ') || '';
                focusNextText = artists ? `Next up: ${fallback.name} - ${artists}` : `Next up: ${fallback.name}`;
                return;
            }
        } catch (err) {
            console.log('[Live Wrapped] Queue fetch failed');
        }

        focusNextText = '';
    }

    function getNextFromPlayerData() {
        const next = Spicetify.Player?.data?.nextTracks?.[0];
        if (next?.name) {
            const artists = next.artists?.map(a => a.name).join(', ') || '';
            return artists ? `Next up: ${next.name} - ${artists}` : `Next up: ${next.name}`;
        }
        return '';
    }

    function showFocusOverlay() {
        ensureModeStyles();
        let overlay = document.getElementById('dg-focus-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'dg-focus-overlay';
            overlay.className = 'dg-focus-overlay';
            overlay.innerHTML = `
                <div class="dg-focus-orb orb-a"></div>
                <div class="dg-focus-orb orb-b"></div>
                <div class="dg-focus-orb orb-c"></div>
                <div class="dg-focus-panel">
                    <div class="dg-focus-header">
                        <img class="dg-focus-cover" alt="Cover" />
                        <div>
                            <div class="dg-focus-title"></div>
                            <div class="dg-focus-artist"></div>
                        </div>
                    </div>
                    <div class="dg-focus-progress">
                        <div class="dg-focus-progress-fill"></div>
                    </div>
                    <div class="dg-focus-meta">
                        <div class="dg-focus-time">0:00</div>
                        <div class="dg-focus-duration">0:00</div>
                    </div>
                    <div class="dg-focus-next-text">Next up: --</div>
                    <div class="dg-focus-volume">
                        <span>Volume</span>
                        <input type="range" min="0" max="100" step="1" value="50" />
                    </div>
                    <div class="dg-focus-actions">
                        <button class="dg-focus-prev-btn">Prev</button>
                        <button class="dg-focus-play-btn">Play/Pause</button>
                        <button class="dg-focus-next-btn">Next</button>
                        <button class="dg-focus-exit">Exit Focus</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('.dg-focus-prev-btn')?.addEventListener('click', () => Spicetify.Player.back());
            overlay.querySelector('.dg-focus-next-btn')?.addEventListener('click', () => Spicetify.Player.next());
            overlay.querySelector('.dg-focus-play-btn')?.addEventListener('click', () => Spicetify.Player.togglePlay());
            overlay.querySelector('.dg-focus-exit')?.addEventListener('click', () => setMode('off'));
            overlay.querySelector('.dg-focus-volume input')?.addEventListener('input', (event) => {
                const value = Number(event.target.value) / 100;
                Spicetify.Player?.setVolume?.(value);
                updateFocusIdleState();
            });
            overlay.addEventListener('mousemove', updateFocusIdleState);
            window.addEventListener('keydown', updateFocusIdleState);
        }

        updateFocusOverlay();
        updateFocusIdleState();
        fetchNextInQueue();

        if (!focusListenerBound) {
            focusListenerBound = true;
            Spicetify.Player?.addEventListener('songchange', updateFocusOverlay);
            Spicetify.Player?.addEventListener('onplaypause', updateFocusOverlay);
            Spicetify.Player?.addEventListener('songchange', fetchNextInQueue);
        }

        if (!focusUpdateTimer) {
            focusUpdateTimer = setInterval(updateFocusOverlay, 1000);
        }
    }

    function hideFocusOverlay() {
        const overlay = document.getElementById('dg-focus-overlay');
        if (overlay) overlay.remove();
        if (focusUpdateTimer) {
            clearInterval(focusUpdateTimer);
            focusUpdateTimer = null;
        }
        if (focusIdleTimer) {
            clearTimeout(focusIdleTimer);
            focusIdleTimer = null;
        }
    }

    function formatTime(ms) {
        if (!Number.isFinite(ms)) return '0:00';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateFocusOverlay() {
        const overlay = document.getElementById('dg-focus-overlay');
        if (!overlay) return;

        const info = getCurrentTrackInfo();
        const cover = overlay.querySelector('.dg-focus-cover');
        const title = overlay.querySelector('.dg-focus-title');
        const artist = overlay.querySelector('.dg-focus-artist');
        const progressFill = overlay.querySelector('.dg-focus-progress-fill');
        const timeEl = overlay.querySelector('.dg-focus-time');
        const durationEl = overlay.querySelector('.dg-focus-duration');
        const nextEl = overlay.querySelector('.dg-focus-next-text');
        const volumeInput = overlay.querySelector('.dg-focus-volume input[type="range"]');

        if (cover && info?.image) cover.src = info.image;
        if (title) title.textContent = info?.title || 'No track';
        if (artist) artist.textContent = info?.artist || '';

        const duration = Number.isFinite(Spicetify.Player?.data?.item?.duration) ? Spicetify.Player.data.item.duration : 0;
        const progressValue = Spicetify.Player?.getProgress?.() ?? Spicetify.Player?.data?.progress ?? 0;
        const progress = Number.isFinite(progressValue) ? progressValue : 0;
        const percent = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (timeEl) timeEl.textContent = formatTime(progress);
        if (durationEl) durationEl.textContent = formatTime(duration);
        if (!focusNextText) {
            focusNextText = getNextFromPlayerData();
        }
        if (nextEl) {
            nextEl.textContent = focusNextText;
            nextEl.style.display = focusNextText ? 'block' : 'none';
        }
        if (volumeInput) {
            const volume = Spicetify.Player?.getVolume?.() ?? 0.5;
            volumeInput.value = Math.round(volume * 100);
        }
    }

    function showCoverOverlay() {
        ensureModeStyles();
        let overlay = document.getElementById('dg-cover-zoom');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'dg-cover-zoom';
            overlay.innerHTML = `
                <div class="dg-cover-bg"></div>
                <div class="dg-cover-grain"></div>
                <div class="dg-cover-content">
                    <img class="dg-cover-art" alt="Album cover" />
                    <div class="dg-cover-title"></div>
                    <div class="dg-cover-artist"></div>
                    <div class="dg-cover-progress"><div class="dg-cover-progress-fill"></div></div>
                    <div class="dg-cover-wave"></div>
                    <div class="dg-cover-volume">
                        <span>Volume</span>
                        <input type="range" min="0" max="100" step="1" value="50" />
                    </div>
                    <div class="dg-cover-controls">
                        <button class="dg-cover-prev">Prev</button>
                        <button class="dg-cover-play">Play/Pause</button>
                        <button class="dg-cover-next">Next</button>
                    </div>
                    <button class="dg-cover-exit">Exit</button>
                </div>
            `;
            document.body.appendChild(overlay);

            const exitButton = overlay.querySelector('.dg-cover-exit');
            if (exitButton) {
                exitButton.addEventListener('click', () => setMode('off'));
            }

            overlay.querySelector('.dg-cover-prev')?.addEventListener('click', () => Spicetify.Player.back());
            overlay.querySelector('.dg-cover-next')?.addEventListener('click', () => Spicetify.Player.next());
            overlay.querySelector('.dg-cover-play')?.addEventListener('click', () => Spicetify.Player.togglePlay());
            overlay.querySelector('.dg-cover-volume input')?.addEventListener('input', (event) => {
                const value = Number(event.target.value) / 100;
                Spicetify.Player?.setVolume?.(value);
                updateCoverCursorState(overlay);
            });

            overlay.addEventListener('mousemove', () => updateCoverCursorState(overlay));
        }

        updateCoverOverlay();
        updateCoverCursorState(overlay);

        if (!coverListenerBound) {
            coverListenerBound = true;
            Spicetify.Player?.addEventListener('songchange', updateCoverOverlay);
        }

        if (!coverUpdateTimer) {
            coverUpdateTimer = setInterval(updateCoverOverlay, 1000);
        }
    }

    function hideCoverOverlay() {
        const overlay = document.getElementById('dg-cover-zoom');
        if (overlay) overlay.remove();
        if (coverUpdateTimer) {
            clearInterval(coverUpdateTimer);
            coverUpdateTimer = null;
        }
    }

    function applyMode(mode) {
        ensureModeStyles();
        document.documentElement.classList.remove('dg-focus-mode');
        hideCoverOverlay();
        hideFocusOverlay();

        if (mode === 'focus') {
            document.documentElement.classList.add('dg-focus-mode');
            showFocusOverlay();
        }

        if (mode === 'cover') {
            showCoverOverlay();
        }

        updateButtonLabel(mode);
    }

    function loadMode() {
        const saved = localStorage.getItem(MODE_STORAGE_KEY);
        const savedIndex = MODES.indexOf(saved || 'off');
        currentModeIndex = savedIndex >= 0 ? savedIndex : 0;
        applyMode(MODES[currentModeIndex]);
    }

    function saveMode(mode) {
        localStorage.setItem(MODE_STORAGE_KEY, mode);
    }

    function setMode(mode) {
        const index = MODES.indexOf(mode);
        currentModeIndex = index >= 0 ? index : 0;
        saveMode(MODES[currentModeIndex]);
        applyMode(MODES[currentModeIndex]);
    }

    function cycleMode() {
        currentModeIndex = (currentModeIndex + 1) % MODES.length;
        const mode = MODES[currentModeIndex];
        saveMode(mode);
        applyMode(mode);

        try {
            const label = mode === 'focus' ? 'Focus Mode' : mode === 'cover' ? 'Cover Zoom' : 'Modes Off';
            Spicetify.showNotification(`DynamicGlow: ${label}`, false, 2000);
        } catch (err) {
            console.log('[Live Wrapped] Mode changed:', mode);
        }
    }

    function updateButtonLabel(mode) {
        const button = document.getElementById('match-your-taste-btn');
        if (!button) return;
        const label = mode === 'focus' ? 'Focus Mode' : mode === 'cover' ? 'Cover Zoom' : 'Modes Off';
        button.setAttribute('title', `Mode: ${label} (click to cycle)`);
        button.setAttribute('aria-label', `Mode: ${label}`);
    }

    // Fetch user's top items
    async function fetchTopItems(type, timeRange, limit = 50) {
        const cacheKey = `${type}_${timeRange}`;
        const cached = wrappedCache.get(cacheKey);
        const now = Date.now();
        
        if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
            console.log('[Live Wrapped] ✅ Using cached data for:', cacheKey);
            return cached.data;
        }

        try {
            console.log('[Live Wrapped] 🌐 Fetching:', type, timeRange);
            const data = await Spicetify.CosmosAsync.get(
                `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}`
            );
            
            wrappedCache.set(cacheKey, { data, timestamp: now });
            return data;
        } catch (e) {
            console.error('[Live Wrapped] Error fetching:', type, timeRange, e);
            // Check if it's a 429 error
            if (e?.status === 429 || e?.code === 429) {
                return { items: [], error: '429', message: 'Rate limited - please wait and try again later' };
            }
            return { items: [], error: 'unknown' };
        }
    }

    // Fetch audio features for multiple tracks
    async function fetchAudioFeatures(trackIds) {
        try {
            const ids = trackIds.join(',');
            const data = await Spicetify.CosmosAsync.get(
                `https://api.spotify.com/v1/audio-features?ids=${ids}`
            );
            return data.audio_features || [];
        } catch (e) {
            console.error('[Live Wrapped] Error fetching audio features:', e);
            // Silently fail - audio features are optional
            return [];
        }
    }

    // Calculate personality from audio features
    function calculateListeningPersonality(audioFeatures) {
        if (!audioFeatures.length) return { type: 'Balanced', description: 'A well-rounded listener' };

        const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
        
        const energy = avg(audioFeatures.map(f => f?.energy || 0.5));
        const valence = avg(audioFeatures.map(f => f?.valence || 0.5));
        const danceability = avg(audioFeatures.map(f => f?.danceability || 0.5));
        const acousticness = avg(audioFeatures.map(f => f?.acousticness || 0.5));
        const instrumentalness = avg(audioFeatures.map(f => f?.instrumentalness || 0.5));

        if (energy > 0.7 && valence > 0.6) {
            return { type: 'The Happy Hype', description: 'You love upbeat, energetic music that makes you feel alive', emoji: '🎉' };
        } else if (energy > 0.7 && valence < 0.4) {
            return { type: 'The Intense Headbanger', description: 'High energy meets deep emotions in your playlists', emoji: '🤘' };
        } else if (danceability > 0.7) {
            return { type: 'The Dancer', description: 'Every song is a reason to move your body', emoji: '💃' };
        } else if (acousticness > 0.6) {
            return { type: 'The Acoustic Soul', description: 'You appreciate the raw, unplugged sound', emoji: '🎸' };
        } else if (valence < 0.4 && energy < 0.5) {
            return { type: 'The Melancholic Dreamer', description: 'You find beauty in sad, reflective music', emoji: '🌙' };
        } else if (instrumentalness > 0.5) {
            return { type: 'The Soundtrack Enthusiast', description: 'Words aren\'t always necessary for great music', emoji: '🎼' };
        } else if (valence > 0.6) {
            return { type: 'The Optimist', description: 'You gravitate toward positive, feel-good vibes', emoji: '☀️' };
        } else {
            return { type: 'The Versatile Listener', description: 'Your taste spans across all moods and energies', emoji: '🎵' };
        }
    }

    // Extract genres from artists
    function getTopGenres(artists, limit = 5) {
        const genreCount = {};
        artists.forEach(artist => {
            artist.genres?.forEach(genre => {
                genreCount[genre] = (genreCount[genre] || 0) + 1;
            });
        });
        
        return Object.entries(genreCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([genre, count]) => ({ genre, count }));
    }

    // Wrapped Slide Component
    function WrappedSlide({ children, gradient, slideNumber, totalSlides }) {
        return React.createElement('div', {
            style: {
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '60px 40px',
                position: 'relative',
                animation: 'slideIn 0.6s ease-out',
            }
        },
            children,
            React.createElement('div', {
                style: {
                    position: 'absolute',
                    bottom: '40px',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: '500',
                }
            }, `${slideNumber} / ${totalSlides}`)
        );
    }

    // Intro Slide
    function IntroSlide({ timeRangeName }) {
        return React.createElement(WrappedSlide, { 
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            slideNumber: 1,
            totalSlides: 15
        },
            React.createElement('div', {
                style: {
                    textAlign: 'center',
                    maxWidth: '600px',
                }
            },
                React.createElement('div', {
                    style: {
                        fontSize: '80px',
                        marginBottom: '20px',
                        animation: 'pulse 2s ease-in-out infinite',
                    }
                }, '🎵'),
                React.createElement('h1', {
                    style: {
                        fontSize: '64px',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '16px',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }
                }, 'Your', React.createElement('br'), 'Live Wrapped'),
                React.createElement('p', {
                    style: {
                        fontSize: '24px',
                        color: 'rgba(255,255,255,0.9)',
                        marginTop: '24px',
                        fontWeight: '500',
                    }
                }, timeRangeName),
                React.createElement('p', {
                    style: {
                        fontSize: '16px',
                        color: 'rgba(255,255,255,0.7)',
                        marginTop: '40px',
                    }
                }, 'Tap → or swipe to continue')
            )
        );
    }

    // Artist Slide
    function ArtistSlide({ artist, rank, gradient, slideNumber }) {
        const imageUrl = artist.images?.[0]?.url || '';
        
        return React.createElement(WrappedSlide, { 
            gradient,
            slideNumber,
            totalSlides: 15
        },
            React.createElement('div', {
                style: {
                    textAlign: 'center',
                    maxWidth: '500px',
                }
            },
                React.createElement('div', {
                    style: {
                        fontSize: '20px',
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: '600',
                        marginBottom: '24px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                    }
                }, `Your #${rank} Artist`),
                React.createElement('img', {
                    src: imageUrl,
                    style: {
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        marginBottom: '32px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                        animation: 'fadeIn 0.8s ease-out',
                        objectFit: 'cover',
                    }
                }),
                React.createElement('h2', {
                    style: {
                        fontSize: '48px',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '16px',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }
                }, artist.name),
                React.createElement('p', {
                    style: {
                        fontSize: '18px',
                        color: 'rgba(255,255,255,0.7)',
                        marginTop: '12px',
                    }
                }, artist.genres?.slice(0, 3).join(' • ') || 'Various genres')
            )
        );
    }

    // Top Artist Minutes Slide
    function TopArtistMinutesSlide({ artist, slideNumber }) {
        // Estimate (not real data, just for effect)
        const estimatedMinutes = Math.floor(Math.random() * 2000) + 500;
        const hours = Math.floor(estimatedMinutes / 60);
        const mins = estimatedMinutes % 60;
        
        return React.createElement(WrappedSlide, {
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            slideNumber,
            totalSlides: 15
        },
            React.createElement('div', {
                style: {
                    textAlign: 'center',
                    maxWidth: '600px',
                }
            },
                React.createElement('p', {
                    style: {
                        fontSize: '18px',
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: '24px',
                    }
                }, 'You listened to'),
                React.createElement('h2', {
                    style: {
                        fontSize: '72px',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '16px',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }
                }, artist.name),
                React.createElement('p', {
                    style: {
                        fontSize: '20px',
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: '32px',
                    }
                }, 'for'),
                React.createElement('div', {
                    style: {
                        fontSize: '96px',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '8px',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }
                }, `${hours}h ${mins}m`),
                React.createElement('p', {
                    style: {
                        fontSize: '18px',
                        color: 'rgba(255,255,255,0.7)',
                        marginTop: '32px',
                    }
                }, `That's ${estimatedMinutes.toLocaleString()} minutes total`)
            )
        );
    }

    // Track Slide
    function TrackSlide({ track, rank, gradient, slideNumber }) {
        const imageUrl = track.album?.images?.[0]?.url || '';
        const artists = track.artists?.map(a => a.name).join(', ') || 'Unknown Artist';
        
        return React.createElement(WrappedSlide, {
            gradient,
            slideNumber,
            totalSlides: 15
        },
            React.createElement('div', {
                style: {
                    textAlign: 'center',
                    maxWidth: '500px',
                }
            },
                React.createElement('div', {
                    style: {
                        fontSize: '20px',
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: '600',
                        marginBottom: '24px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                    }
                }, `Your #${rank} Song`),
                React.createElement('img', {
                    src: imageUrl,
                    style: {
                        width: '300px',
                        height: '300px',
                        borderRadius: '12px',
                        marginBottom: '32px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                        animation: 'fadeIn 0.8s ease-out',
                        objectFit: 'cover',
                    }
                }),
                React.createElement('h2', {
                    style: {
                        fontSize: '42px',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '12px',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }
                }, track.name),
                React.createElement('p', {
                    style: {
                        fontSize: '20px',
                        color: 'rgba(255,255,255,0.8)',
                    }
                }, artists)
            )
        );
    }

    // Genres Slide
    function GenresSlide({ genres, slideNumber }) {
        return React.createElement(WrappedSlide, {
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            slideNumber,
            totalSlides: 15
        },
            React.createElement('div', {
                style: {
                    textAlign: 'center',
                    maxWidth: '700px',
                }
            },
                React.createElement('h2', {
                    style: {
                        fontSize: '56px',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '48px',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }
                }, 'Your Top Genres'),
                React.createElement('div', {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        alignItems: 'stretch',
                    }
                }, genres.map((g, i) => 
                    React.createElement('div', {
                        key: g.genre,
                        style: {
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            padding: '24px 32px',
                            borderRadius: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '2px solid rgba(255,255,255,0.2)',
                            animation: `slideInLeft 0.6s ease-out ${i * 0.1}s both`,
                        }
                    },
                        React.createElement('div', {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                            }
                        },
                            React.createElement('div', {
                                style: {
                                    fontSize: '28px',
                                    fontWeight: '900',
                                    color: 'white',
                                    minWidth: '40px',
                                }
                            }, `${i + 1}`),
                            React.createElement('div', {
                                style: {
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: 'white',
                                    textAlign: 'left',
                                    textTransform: 'capitalize',
                                }
                            }, g.genre.replace(/-/g, ' '))
                        )
                    )
                ))
            )
        );
    }

    // Personality Slide
    function PersonalitySlide({ personality, slideNumber }) {
        return React.createElement(WrappedSlide, {
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            slideNumber,
            totalSlides: 15
        },
            React.createElement('div', {
                style: {
                    textAlign: 'center',
                    maxWidth: '600px',
                }
            },
                React.createElement('p', {
                    style: {
                        fontSize: '20px',
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: '24px',
                        fontWeight: '600',
                        letterSpacing: '1px',
                    }
                }, 'Your Listening Personality'),
                React.createElement('div', {
                    style: {
                        fontSize: '120px',
                        marginBottom: '32px',
                        animation: 'bounce 2s ease-in-out infinite',
                    }
                }, personality.emoji),
                React.createElement('h2', {
                    style: {
                        fontSize: '56px',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '24px',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }
                }, personality.type),
                React.createElement('p', {
                    style: {
                        fontSize: '22px',
                        color: 'rgba(255,255,255,0.9)',
                        lineHeight: '1.6',
                        fontWeight: '500',
                    }
                }, personality.description)
            )
        );
    }

    // Summary Slide
    function SummarySlide({ topArtist, topTrack, genres, personality, slideNumber }) {
        return React.createElement(WrappedSlide, {
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            slideNumber,
            totalSlides: 15
        },
            React.createElement('div', {
                style: {
                    textAlign: 'center',
                    maxWidth: '700px',
                }
            },
                React.createElement('h2', {
                    style: {
                        fontSize: '64px',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '48px',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }
                }, 'Your Wrapped'),
                React.createElement('div', {
                    style: {
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        padding: '32px',
                        borderRadius: '20px',
                        border: '2px solid rgba(255,255,255,0.2)',
                        textAlign: 'left',
                    }
                },
                    React.createElement('div', { style: { marginBottom: '24px' }},
                        React.createElement('div', { 
                            style: { 
                                fontSize: '14px', 
                                color: 'rgba(255,255,255,0.7)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                            } 
                        }, 'Top Artist'),
                        React.createElement('div', { 
                            style: { 
                                fontSize: '28px', 
                                fontWeight: '700',
                                color: 'white',
                            } 
                        }, topArtist?.name || 'N/A')
                    ),
                    React.createElement('div', { style: { marginBottom: '24px' }},
                        React.createElement('div', { 
                            style: { 
                                fontSize: '14px', 
                                color: 'rgba(255,255,255,0.7)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                            } 
                        }, 'Top Song'),
                        React.createElement('div', { 
                            style: { 
                                fontSize: '28px', 
                                fontWeight: '700',
                                color: 'white',
                            } 
                        }, topTrack?.name || 'N/A')
                    ),
                    React.createElement('div', { style: { marginBottom: '24px' }},
                        React.createElement('div', { 
                            style: { 
                                fontSize: '14px', 
                                color: 'rgba(255,255,255,0.7)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                            } 
                        }, 'Top Genre'),
                        React.createElement('div', { 
                            style: { 
                                fontSize: '28px', 
                                fontWeight: '700',
                                color: 'white',
                                textTransform: 'capitalize',
                            } 
                        }, genres[0]?.genre.replace(/-/g, ' ') || 'N/A')
                    ),
                    React.createElement('div', {},
                        React.createElement('div', { 
                            style: { 
                                fontSize: '14px', 
                                color: 'rgba(255,255,255,0.7)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                            } 
                        }, 'Personality'),
                        React.createElement('div', { 
                            style: { 
                                fontSize: '28px', 
                                fontWeight: '700',
                                color: 'white',
                            } 
                        }, `${personality.emoji} ${personality.type}`)
                    )
                ),
                React.createElement('p', {
                    style: {
                        fontSize: '18px',
                        color: 'rgba(255,255,255,0.8)',
                        marginTop: '40px',
                        fontWeight: '500',
                    }
                }, 'Thanks for listening! 🎵')
            )
        );
    }

    // Main Focus/Cover Mode Component
    function LiveWrappedPage() {
        const [mode, setModeState] = useState(MODES[currentModeIndex]);

        const goBack = () => {
            Spicetify.Platform.History.push('/');
        };

        const handleCycle = () => {
            cycleMode();
            setModeState(MODES[currentModeIndex]);
        };

        if (!isEnabled) {
            return React.createElement('div', {
                style: {
                    padding: '40px',
                    textAlign: 'center',
                    color: 'white',
                }
            }, 'Focus/Cover modes are disabled. Enable them in settings.');
        }

        const modeLabel = mode === 'focus' ? 'Focus Mode' : mode === 'cover' ? 'Cover Zoom' : 'Off';
        const modeDescription = mode === 'focus'
            ? 'Sidebars and top bar hidden. You see only the main content.'
            : mode === 'cover'
                ? 'Fullscreen album cover with blur and track info.'
                : 'Modes are disabled.';

        return React.createElement('div', {
            style: {
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1b1b24 0%, #111114 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                color: 'white',
            }
        },
            React.createElement('div', {
                style: {
                    textAlign: 'center',
                    maxWidth: '620px',
                }
            },
                React.createElement('div', {
                    style: {
                        fontSize: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        color: 'rgba(255,255,255,0.6)',
                        marginBottom: '12px',
                    }
                }, 'Mode Control'),
                React.createElement('h2', {
                    style: {
                        fontSize: '48px',
                        fontWeight: '900',
                        marginBottom: '16px',
                    }
                }, modeLabel),
                React.createElement('p', {
                    style: {
                        fontSize: '18px',
                        color: 'rgba(255,255,255,0.75)',
                        lineHeight: '1.6',
                        marginBottom: '32px',
                    }
                }, modeDescription),
                React.createElement('div', {
                    style: {
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }
                },
                    React.createElement('button', {
                        onClick: handleCycle,
                        style: {
                            background: 'rgba(255,255,255,0.9)',
                            border: '2px solid rgba(255,255,255,1)',
                            color: '#111114',
                            padding: '12px 32px',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '800',
                        }
                    }, 'Cycle Mode'),
                    React.createElement('button', {
                        onClick: goBack,
                        style: {
                            background: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            padding: '12px 28px',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '700',
                        }
                    }, '← Back')
                )
            )
        );
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        @keyframes bounce {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-20px);
            }
        }
        
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);

    // Register page route
    while (!Spicetify?.Platform?.History) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('[Live Wrapped] Registering route...');
    const route = Spicetify.Platform.History.listen((location) => {
        if (location.pathname === '/match-your-taste') {
            console.log('[Live Wrapped] Route matched, rendering page');
            
            let container = document.querySelector('#match-your-taste-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'match-your-taste-container';
                document.body.appendChild(container);
            }
            
            container.style.display = '';
            ReactDOM.render(React.createElement(LiveWrappedPage), container);
        } else {
            const container = document.querySelector('#match-your-taste-container');
            if (container) {
                container.style.display = 'none';
            }
        }
    });

    // Initial check
    if (window.location.pathname === '/match-your-taste') {
        console.log('[Live Wrapped] Initial render');
        let container = document.querySelector('#match-your-taste-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'match-your-taste-container';
            document.body.appendChild(container);
        }
        ReactDOM.render(React.createElement(LiveWrappedPage), container);
    }

    console.log('[Live Wrapped] Extension loaded successfully!');
    loadMode();

    // Add topbar button
    function applyModeButtonStyle(button, floating) {
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.gap = '6px';
        button.style.padding = '6px 10px';
        button.style.borderRadius = '999px';
        button.style.border = '1px solid rgba(255,255,255,0.25)';
        button.style.background = 'rgba(20,20,28,0.75)';
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.style.fontSize = '12px';
        button.style.fontWeight = '700';
        button.style.zIndex = '999999';
        if (floating) {
            button.classList.add('dg-mode-floating');
        } else {
            button.classList.remove('dg-mode-floating');
            button.style.position = '';
        }
    }

    function findReloadButton() {
        const candidates = Array.from(document.querySelectorAll('button'));
        return candidates.find((btn) => {
            const label = `${btn.getAttribute('aria-label') || ''} ${btn.getAttribute('title') || ''}`.toLowerCase();
            return label.includes('reload') || label.includes('odsw');
        }) || null;
    }

    function insertTopbarButton() {
        const reloadButton = findReloadButton();
        const container = reloadButton?.parentElement || null;

        let button = document.getElementById('match-your-taste-btn');
        if (!button) {
            button = document.createElement('button');
            button.id = 'match-your-taste-btn';
            button.setAttribute('aria-label', 'Focus/Cover Mode');
            button.setAttribute('title', 'Mode: Off (click to cycle)');
            button.innerHTML = `
                <svg role="img" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l2.8 6h6.2l-5 3.6 1.9 6.4-5.9-4-5.9 4 1.9-6.4-5-3.6h6.2L12 2z" fill="currentColor"></path>
                </svg>
            `;
            button.onclick = () => cycleMode();
        }

        if (reloadButton && container && container.contains(reloadButton)) {
            button.style.display = 'inline-flex';
            button.className = reloadButton.className + ' match-your-taste-button';
            applyModeButtonStyle(button, false);
            if (button.parentElement !== container || button.nextElementSibling !== reloadButton) {
                container.insertBefore(button, reloadButton);
            }
            return true;
        }

        // Fallback: keep a floating button when Reload is unavailable
        applyModeButtonStyle(button, true);
        if (!button.parentElement || button.parentElement !== document.body) {
            document.body.appendChild(button);
        }
        return true;
    }

    function addTopbarButton() {
        let tries = 0;
        const maxTries = 20;
        const timer = setInterval(() => {
            tries += 1;
            const inserted = insertTopbarButton();
            if (inserted || tries >= maxTries) clearInterval(timer);
        }, 500);

        const observer = new MutationObserver(() => {
            insertTopbarButton();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Persistent fallback in case UI keeps re-mounting
        setInterval(() => {
            const button = document.getElementById('match-your-taste-btn');
            if (!button || !document.body.contains(button)) {
                insertTopbarButton();
            }
        }, 2000);
    }

    addTopbarButton();

    // Keyboard shortcut: Ctrl+Shift+M to cycle, Esc to turn off
    document.addEventListener('keydown', (event) => {
        const target = event.target;
        const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        if (isTyping) return;

        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyM') {
            event.preventDefault();
            event.stopPropagation();
            cycleMode();
        }
        if (event.key === 'Escape') {
            setMode('off');
        }
    }, true);
})();
