// DynamicGlow - Additional Features: Hide Playlists, Lyrics Glow, Liked Counter

(async function() {
    // Wait for Spicetify
    while (!Spicetify?.showNotification) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    Spicetify.showNotification("✨ DynamicGlow Features Active!");
    
    // ===== 15. HIDE DEFAULT PLAYLISTS =====
    const hideStyle = document.createElement('style');
    hideStyle.textContent = `
        /* Hide Liked Songs */
        a[href="/collection/tracks"],
        a[aria-label*="Polubione" i],
        a[aria-label*="Liked Songs" i] {
            display: none !important;
        }
        
        /* Hide Episodes/Podcasts */
        a[href*="/collection/episodes"],
        a[aria-label*="Odcinki" i],
        a[aria-label*="Episodes" i],
        a[aria-label*="Twoje odcinki" i],
        a[aria-label*="Your Episodes" i] {
            display: none !important;
        }
        
        /* Hide default created folders */
        [data-testid="rootlist-item"]:has(a[href="/collection/tracks"]),
        [data-testid="rootlist-item"]:has(a[href*="collection/episodes"]) {
            display: none !important;
        }
    `;
    document.head.appendChild(hideStyle);

    // Extra runtime filter for library items by text
    const namesToHide = [
        "Polubione utwory",
        "Polubione Utwory",
        "Liked Songs",
        "Twoje Odcinki",
        "Twoje odcinki",
        "Your Episodes"
    ];

    function hideLibraryEntries() {
        const items = document.querySelectorAll('[data-testid="rootlist-item"], li[role="row"]');
        items.forEach(item => {
            const text = item.textContent?.trim().toLowerCase();
            const ariaLabelled = item.getAttribute('aria-labelledby') || '';
            const hasLikedImg = item.querySelector('img[src*="liked-songs"]');

            const matchText = text && namesToHide.some(name => text.includes(name.toLowerCase()));
            const matchAria =
                ariaLabelled.includes('collection:tracks') ||
                ariaLabelled.toLowerCase().includes('liked') ||
                ariaLabelled.toLowerCase().includes('collection:your-episodes') ||
                ariaLabelled.toLowerCase().includes('your episodes');

            const ariaDesc = item.getAttribute('aria-describedby') || '';
            const matchDesc = ariaDesc.toLowerCase().includes('your-episodes');

            if (matchText || matchAria || matchDesc || hasLikedImg) {
                item.style.display = 'none';
            }
        });
    }
    hideLibraryEntries();
    setInterval(hideLibraryEntries, 2000);
    
    // ===== 18. LYRICS SYNC GLOW WITH DYNAMIC COLORS =====
    const lyricsStyle = document.createElement('style');
    lyricsStyle.textContent = `
        /* LYRICS MINIPLAYER / FULLSCREEN DYNAMIC COLOR BACKGROUNDS */
        /* Apply dynamic color to all lyrics containers */
        .lyrics-lyrics-container,
        .main-lyricsCinema-container,
        .main-lyrics-root,
        [data-testid="fullscreen-lyric"],
        .Root__lyrics-cinema,
        .lyrics-cinema-innerContainer,
        body.lyrics-fullscreen-lyrics {
            background: linear-gradient(180deg, 
                var(--dynamic-bg-primary, rgba(var(--spice-rgb-shadow), 0.15)),
                var(--dynamic-bg-secondary, rgba(var(--spice-rgb-selected-row), 0.1)),
                var(--dynamic-bg-tertiary, rgba(var(--spice-rgb-shadow), 0.05))
            ) !important;
            background-color: var(--dynamic-bg-base, transparent) !important;
            backdrop-filter: blur(40px) saturate(1.8) !important;
            border: 1px solid rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.15) !important;
            border-radius: 12px !important;
            box-shadow: 
                0 0 80px 20px var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))),
                inset 0 0 40px 10px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.1),
                0 8px 32px rgba(0, 0, 0, 0.4) !important;
        }
        
        /* Lyrics Miniplayer/PiP popup dynamic background */
        .pip-mini-player-lyrics,
        [data-testid="pip-lyrics"],
        [data-testid*="pip" i][data-testid*="lyric" i],
        [data-testid*="mini-player" i][data-testid*="lyric" i],
        [class*="pip-mini-player" i],
        [class*="pip"][class*="lyric" i],
        [class*="mini-player"][class*="lyric" i],
        [class*="PiPMiniPlayer" i],
        .documentPictureInPicture .lyrics-container {
            background: radial-gradient(
                ellipse at center,
                var(--dynamic-bg-primary, rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.2)),
                var(--dynamic-bg-base, rgba(var(--spice-rgb-shadow), 0.05))
            ) !important;
            backdrop-filter: blur(60px) saturate(2) !important;
            border: 1px solid rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.28) !important;
            box-shadow: 
                0 0 60px 15px var(--extracted-color, var(--glowify-glow-accent)),
                inset 0 0 30px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.15) !important;
        }

        .pip-mini-player-lyrics p,
        [data-testid*="pip" i][data-testid*="lyric" i] p,
        [data-testid*="mini-player" i][data-testid*="lyric" i] p,
        [class*="pip"][class*="lyric" i] p,
        [class*="mini-player"][class*="lyric" i] p {
            color: var(--spice-text) !important;
            text-shadow:
                0 0 15px var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))),
                0 0 30px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.35) !important;
        }
        
        /* Lyrixed Custom App - Lyrics Miniplayer with Dynamic Colors */
        [class*="lyrics_container"][class*="_lyrixed"] {
            background: radial-gradient(
                ellipse at top center,
                rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.25) 0%,
                rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.15) 30%,
                rgba(var(--spice-rgb-shadow), 0.9) 70%,
                rgba(var(--spice-rgb-shadow), 0.95) 100%
            ) !important;
            backdrop-filter: blur(50px) saturate(1.6) !important;
            border: 2px solid rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.3) !important;
            box-shadow: 
                0 0 80px 20px var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))),
                inset 0 0 60px 15px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.15),
                0 12px 48px rgba(0, 0, 0, 0.5) !important;
        }
        
        [class*="lyrics___"][class*="_lyrixed"] {
            text-shadow: 
                0 0 15px var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))),
                0 0 30px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.4),
                2px 2px 4px rgba(0, 0, 0, 0.5) !important;
            color: var(--spice-text) !important;
        }
        
        [class*="container"][class*="_lyrixed"] {
            background: linear-gradient(
                135deg,
                rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.15) 0%,
                rgba(var(--spice-rgb-shadow), 0.8) 100%
            ) !important;
        }

        /* Active lyrics line with dynamic color glow */
        .lyrics-lyricsContent-lyric[data-active="true"],
        .lyrics-lyricsContent-lyric.lyrics-lyricsContent-active {
            color: var(--spice-text) !important;
            text-shadow: 
                0 0 20px var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))),
                0 0 40px var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))),
                0 0 60px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.5),
                1px 1px 2px rgba(0, 0, 0, 0.3) !important;
            filter: brightness(1.3) drop-shadow(0 0 10px var(--extracted-color, var(--accent-color))) !important;
            transform: scale(1.05) translateX(8px);
            transition: all 0.3s ease !important;
            font-weight: 700 !important;
            background: linear-gradient(90deg, 
                rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.25) 0%, 
                transparent 100%) !important;
            padding-left: 16px !important;
            border-left: 4px solid var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))) !important;
            border-radius: 8px !important;
        }
        
        /* Inactive lyrics with subtle dynamic color */
        .lyrics-lyricsContent-lyric:not([data-active="true"]) {
            color: rgba(var(--spice-rgb-text), 0.6) !important;
            text-shadow: 
                0 0 8px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.3),
                0 0 15px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.2) !important;
            transition: all 0.3s ease !important;
        }
        
        /* Lyrics container ambient glow */
        .lyrics-lyrics-container,
        .main-lyricsCinema-container {
            text-shadow: 0 0 10px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.3) !important;
        }
        
        /* Past lyrics dim effect */
        .lyrics-lyricsContent-lyric[data-active="false"] {
            opacity: 0.5 !important;
            text-shadow: 0 0 5px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.2) !important;
        }
        
        /* Lyrics hover effect with dynamic color */
        .lyrics-lyricsContent-lyric:hover {
            color: var(--spice-text) !important;
            text-shadow: 
                0 0 15px var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))),
                0 0 30px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.4) !important;
            transform: translateX(4px);
            cursor: pointer;
            background: linear-gradient(90deg,
                rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.15) 0%,
                transparent 100%) !important;
            border-radius: 6px !important;
        }
        
        /* Cinema mode lyrics with intense dynamic color glow */
        .main-lyricsCinema-lyricsActive,
        .lyrics-cinema-lyricsActive {
            text-shadow: 
                0 0 25px var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))),
                0 0 50px var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))),
                0 0 75px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.6) !important;
            filter: brightness(1.4) drop-shadow(0 0 20px var(--extracted-color, var(--accent-color))) !important;
        }
        
        /* Fullscreen lyrics background overlay with dynamic color */
        .lyrics-cinemaMode-container,
        .main-lyricsCinema-root {
            background: radial-gradient(
                circle at center,
                rgba(var(--extracted-color-rgb, var(--spice-rgb-shadow)), 0.3) 0%,
                rgba(var(--spice-rgb-shadow), 0.8) 50%,
                rgba(var(--spice-rgb-shadow), 0.95) 100%
            ) !important;
        }
        
        /* Lyrics scroll indicator with dynamic color */
        .lyrics-lyrics-scrollIndicator,
        .main-lyricsCinema-scrollIndicator {
            background: linear-gradient(
                to bottom,
                transparent,
                rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.3)
            ) !important;
        }
    `;
    document.head.appendChild(lyricsStyle);

    // Sync DynamicGlow colors into Picture-in-Picture lyrics popup document
    function syncLyricsPiPWindow() {
        const pipWindow = window.documentPictureInPicture?.window;
        if (!pipWindow || pipWindow.closed) return;

        const pipDoc = pipWindow.document;
        if (!pipDoc) return;

        const rootStyle = getComputedStyle(document.documentElement);
        const pipRoot = pipDoc.documentElement;
        const cssVars = [
            '--extracted-color',
            '--extracted-color-rgb',
            '--glowify-glow-accent',
            '--accent-color',
            '--spice-main',
            '--spice-rgb-main',
            '--spice-text',
            '--spice-rgb-text',
            '--spice-subtext',
            '--spice-rgb-subtext',
            '--spice-rgb-shadow',
            '--spice-button',
            '--spice-button-active'
        ];

        cssVars.forEach(name => {
            const value = rootStyle.getPropertyValue(name);
            if (value) pipRoot.style.setProperty(name, value.trim());
        });

        const metadata = Spicetify.Player?.data?.item?.metadata;
        let coverUrl = metadata?.image_xlarge_url || metadata?.image_large_url || metadata?.image_url || '';
        if (coverUrl.startsWith('spotify:image:')) {
            coverUrl = coverUrl.replace('spotify:image:', 'https://i.scdn.co/image/');
        }
        if (!coverUrl) {
            const albumArtElement = pipDoc.getElementById('albumArt');
            const albumArtSrc = albumArtElement?.getAttribute('src') || '';
            if (albumArtSrc.startsWith('spotify:image:')) {
                coverUrl = albumArtSrc.replace('spotify:image:', 'https://i.scdn.co/image/');
            } else {
                coverUrl = albumArtSrc;
            }
        }
        if (coverUrl) {
            pipRoot.style.setProperty('--dynamic-cover-url', `url("${coverUrl}")`);
        }

        const pipStyleId = 'dynamicglow-lyrics-pip-style';
        let pipStyle = pipDoc.getElementById(pipStyleId);
        if (!pipStyle) {
            pipStyle = pipDoc.createElement('style');
            pipStyle.id = pipStyleId;
            pipDoc.head?.appendChild(pipStyle);
        }

        pipStyle.textContent = `
                html, body {
                    min-height: 100%;
                    position: relative;
                    isolation: isolate;
                    background: radial-gradient(
                        ellipse at top,
                        rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.30) 0%,
                        rgba(var(--spice-rgb-main, var(--spice-rgb-shadow)), 0.92) 58%,
                        rgba(var(--spice-rgb-shadow), 0.98) 100%
                    ) !important;
                    color: var(--spice-text) !important;
                    transition: background 0.45s ease, color 0.25s ease !important;
                }

                body::before,
                body::after {
                    content: "";
                    position: fixed;
                    inset: -14%;
                    pointer-events: none;
                    z-index: -2;
                    background-image: var(--dynamic-cover-url, none);
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    transition: background-image 0.45s ease;
                }

                body::before {
                    filter: blur(20px) saturate(1.22) contrast(1.04) brightness(0.72);
                    opacity: 0.76;
                    animation: dynamicCoverFloat 22s ease-in-out infinite alternate;
                }

                body::after {
                    z-index: -1;
                    filter: blur(44px) saturate(1.28) contrast(1.06) brightness(0.56);
                    opacity: 0.62;
                    transform: scale(1.08);
                    animation: dynamicCoverSpin 38s linear infinite;
                }

                @keyframes dynamicCoverFloat {
                    0% { transform: scale(1.06) translate3d(-2%, -1%, 0); }
                    50% { transform: scale(1.12) translate3d(2%, 1.4%, 0); }
                    100% { transform: scale(1.08) translate3d(0.8%, -1.5%, 0); }
                }

                @keyframes dynamicCoverSpin {
                    0% { transform: rotate(0deg) scale(1.08); }
                    100% { transform: rotate(360deg) scale(1.12); }
                }

                :root {
                    --accent: var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))) !important;
                    --accent-hover: rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.92) !important;
                    --text-glow: rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.78) !important;
                    --dynamic-bloom: rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.20) !important;
                }

                body {
                    box-shadow:
                        inset 0 0 180px rgba(var(--spice-rgb-shadow), 0.42) !important;
                }

                /* Custom lyrics miniplayer full dynamic recolor */
                body,
                .header,
                .controls,
                .footer,
                .lyrics-wrap,
                .settings-panel,
                .theme-picker {
                    color: var(--spice-text) !important;
                    background-color: rgba(var(--spice-rgb-main, var(--spice-rgb-shadow)), 0.72) !important;
                }

                .header,
                .controls,
                .footer,
                .settings-panel,
                .theme-picker {
                    backdrop-filter: blur(24px) saturate(2.35) !important;
                    border-color: rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.20) !important;
                    box-shadow:
                        0 0 46px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.46),
                        inset 0 0 30px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.18) !important;
                }

                .header,
                .footer,
                .lyrics-wrap {
                    background: linear-gradient(
                        145deg,
                        rgba(var(--spice-rgb-main, var(--spice-rgb-shadow)), 0.46) 0%,
                        rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.18) 100%
                    ) !important;
                    border: 1px solid rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.28) !important;
                    backdrop-filter: blur(16px) saturate(2.2) !important;
                    box-shadow:
                        0 0 26px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.42),
                        inset 0 0 18px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.20) !important;
                }

                .track-title,
                .settings-title,
                .theme-picker-title,
                .theme-btn-name,
                .menu-item-label,
                .theme-name,
                .value-display,
                .control-label {
                    color: var(--spice-text) !important;
                    text-shadow:
                        0 0 22px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.82),
                        0 0 42px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.50),
                        0 0 68px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.30) !important;
                }

                .track-artist,
                .theme-btn-label,
                .menu-section-title,
                .subtext {
                    color: rgba(var(--spice-rgb-subtext, var(--spice-rgb-text)), 0.78) !important;
                    text-shadow:
                        0 0 14px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.42),
                        0 0 28px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.24) !important;
                }

                .ctrl-btn,
                .menu-btn,
                .settings-close,
                .theme-picker-back,
                .close-btn,
                .theme-btn,
                .menu-item,
                .theme-item {
                    color: var(--spice-text) !important;
                    background: rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.12) !important;
                    border: 1px solid rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.22) !important;
                }

                .ctrl-btn.play-btn,
                .menu-toggle.on,
                .theme-item.active {
                    background: var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))) !important;
                    color: rgba(var(--spice-rgb-main, var(--spice-rgb-shadow)), 1) !important;
                    border-color: rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.72) !important;
                    box-shadow:
                        0 0 24px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.72),
                        0 0 52px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.34) !important;
                }

                .ctrl-btn:hover,
                .menu-btn:hover,
                .theme-btn:hover,
                .menu-item:hover,
                .theme-item:hover,
                .settings-close:hover,
                .theme-picker-back:hover,
                .close-btn:hover {
                    background: rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.22) !important;
                    box-shadow:
                        0 0 18px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.42),
                        inset 0 0 10px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.20) !important;
                }

                .slider,
                input[type="range"] {
                    background: rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.22) !important;
                    accent-color: var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))) !important;
                }

                .slider::-webkit-slider-thumb,
                input[type="range"]::-webkit-slider-thumb {
                    background: var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))) !important;
                    box-shadow: 0 0 10px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.65) !important;
                }

                .lyric.active {
                    color: var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))) !important;
                    text-shadow:
                        0 0 40px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 1),
                        0 0 78px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.68),
                        0 0 112px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.44) !important;
                }

                .lyric {
                    text-shadow:
                        0 0 12px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.26),
                        0 0 24px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.16) !important;
                }

                #document-pip-main-container,
                [data-testid*="pip-mini-player" i],
                [data-testid*="mini-player" i],
                [class*="pip" i][class*="player" i],
                [class*="mini" i][class*="player" i],
                [class*="MiniPlayer" i],
                .encore-base-set,
                .encore-dark-theme {
                    background:
                        linear-gradient(145deg,
                            rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.14) 0%,
                            rgba(var(--spice-rgb-shadow), 0.38) 100%
                        ) !important;
                    border: 1px solid rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.22) !important;
                    box-shadow:
                        0 0 44px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.33),
                        inset 0 0 28px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.09) !important;
                    backdrop-filter: blur(28px) saturate(1.45) !important;
                    border-radius: 14px !important;
                    color: var(--spice-text) !important;
                }

                button,
                [role="button"] {
                    color: var(--spice-text) !important;
                    transition: box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease !important;
                }

                button:hover,
                [role="button"]:hover {
                    background: rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.16) !important;
                    box-shadow:
                        0 0 18px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.44),
                        inset 0 0 12px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.18) !important;
                    transform: translateY(-1px);
                }

                [data-testid*="progress" i],
                [class*="progress" i],
                [class*="slider" i] {
                    accent-color: var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))) !important;
                }

                [class*="lyric" i],
                [data-testid*="lyric" i],
                p {
                    color: var(--spice-text) !important;
                    text-shadow:
                        0 0 24px var(--extracted-color, var(--glowify-glow-accent, var(--accent-color))),
                        0 0 48px rgba(var(--extracted-color-rgb, var(--spice-rgb-text)), 0.60) !important;
                }
            `;
    }

    syncLyricsPiPWindow();
    setInterval(syncLyricsPiPWindow, 1200);
    console.log("[DynamicGlow] Lyrics miniplayer dynamic colors applied");
    
    // ===== 3. LIKED SONGS COUNTER =====
    setTimeout(() => {
        let likedCount = 0;
        
        const counter = document.createElement('div');
        counter.style.cssText = `
            position: fixed;
            top: 16px;
            right: 250px;
            background: rgba(var(--spice-rgb-text), 0.15);
            backdrop-filter: blur(30px) saturate(1.5);
            padding: 10px 22px;
            border-radius: 28px;
            color: var(--spice-text);
            font-weight: bold;
            font-size: 16px;
            box-shadow: 
                0 0 25px 5px var(--glowify-glow-accent, var(--accent-color)),
                0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            border: 2px solid rgba(var(--spice-rgb-text), 0.3);
            user-select: none;
        `;
        counter.innerHTML = '❤️ <span style="margin-left: 6px;">...</span>';
        counter.title = 'Liczba polubionych utworów';
        document.body.appendChild(counter);
        
        // Hover effect
        counter.addEventListener('mouseenter', () => {
            counter.style.transform = 'scale(1.08) translateY(-2px)';
            counter.style.boxShadow = `
                0 0 35px 8px var(--glowify-glow-accent, var(--accent-color)),
                0 6px 20px rgba(0, 0, 0, 0.4)
            `;
        });
        
        counter.addEventListener('mouseleave', () => {
            counter.style.transform = 'scale(1) translateY(0)';
            counter.style.boxShadow = `
                0 0 25px 5px var(--glowify-glow-accent, var(--accent-color)),
                0 4px 15px rgba(0, 0, 0, 0.3)
            `;
        });
        
        // Click to refresh
        counter.addEventListener('click', () => {
            counter.style.transform = 'scale(0.95)';
            setTimeout(() => {
                counter.style.transform = 'scale(1.08)';
                updateCount();
            }, 100);
        });
        
        // Fetch liked count
        async function updateCount() {
            try {
                const response = await Spicetify.CosmosAsync.get('sp://core-playlist/v1/rootlist');
                const liked = response.items?.find(item => item.type === 'collection');
                if (liked?.totalLength !== undefined) {
                    likedCount = liked.totalLength;
                    counter.innerHTML = `❤️ <span style="margin-left: 6px;">${likedCount}</span>`;
                    
                    // Pulse animation on update
                    counter.style.animation = 'none';
                    setTimeout(() => {
                        counter.style.animation = 'pulse-update 0.5s ease';
                    }, 10);
                }
            } catch(e) {
                counter.innerHTML = '❤️ <span style="margin-left: 6px;">---</span>';
            }
        }
        
        // Add pulse animation
        const pulseStyle = document.createElement('style');
        pulseStyle.textContent = `
            @keyframes pulse-update {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.15); }
            }
        `;
        document.head.appendChild(pulseStyle);
        
        // Initial fetch and periodic updates
        updateCount();
        setInterval(updateCount, 10000); // Update every 10 seconds
        
        // Update on song change (might have liked/unliked)
        Spicetify.Player.addEventListener("songchange", () => {
            setTimeout(updateCount, 500);
        });
        
    }, 2000);
    
})();
