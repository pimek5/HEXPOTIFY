/**
 * DynamicGlow Configuration Menu
 * Interactive UI to customize:
 * - Glow intensity
 * - Pulse effects
 * - Color transitions
 * - Animation speeds
 * Version: 1.0.0
 */

(async function() {
    // Wait for Spicetify
    while (!Spicetify?.React || !Spicetify?.ReactDOM || !Spicetify?.PopupModal) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const { React, ReactDOM } = Spicetify;
    const e = React.createElement;

    // ===== DEFAULT CONFIG =====
    const DEFAULT_CONFIG = {
        pulseEnabled: true,
        pulseIntensity: 0.8,
        pulseSpeed: 2000,
        glowIntensity: 1.0,
        colorTransitionSpeed: 300,
        enableAnimatedGradients: true,
        enablePulseOnHover: true,
        enableGlassmorphism: true,
        glassBlur: 2,
        backgroundBlurPercent: 100,
        mainBackgroundBlurPercent: 100,
        glowifyBackgroundBlurPercent: 100,
        backgroundRotateSeconds: 45,
        accentSaturation: 1.0,
        shadowBlur: 12,
        enableElementGlow: true,
        enableHoverScale: true,
        hoverScaleAmount: 1.03,
        enableSearchBlur: true,
        // API Settings - Live Wrapped uses top artists/tracks endpoints (better rate limits)
        enableAlbumMetadata: true,
        enableEpisodeMetadata: true,
        enableMatchYourTaste: true,  // Enabled - Live Wrapped feature with /me/top/* endpoints
        enableTrackFeatures: true,
        enableSidebarCovers: true,
        enableListPlaylistsWithSong: true,
        // Super Spotify Visualizer 2.0 settings
        superVizOpacity: 0.94,
        superVizSaturation: 1.55,
        superVizContrast: 1.12,
        superVizBrightness: 1.08,
        superVizBloomBoost: 1.0,
        superVizSourceLockMs: 1200,
        superVizLowEnergyReconnectMs: 2500,
    };

    const BACKGROUND_BLUR_BASE_PX = 80;
    const GLOWIFY_BLUR_BASE_PX = 12;

    function normalizeBlurPercent(config, key, fallback) {
        const value = config[key];
        if (typeof value === 'number') {
            return value;
        }

        if (typeof config.backgroundBlurPercent === 'number') {
            return config.backgroundBlurPercent;
        }

        return fallback;
    }

    function applyBackgroundBlur(config) {
        const mainPercent = normalizeBlurPercent(
            config,
            'mainBackgroundBlurPercent',
            DEFAULT_CONFIG.mainBackgroundBlurPercent
        );
        const glowifyPercent = normalizeBlurPercent(
            config,
            'glowifyBackgroundBlurPercent',
            DEFAULT_CONFIG.glowifyBackgroundBlurPercent
        );
        const mainFactor = Math.max(0, mainPercent) / 100;
        const glowifyFactor = Math.max(0, glowifyPercent) / 100;
        const bgBlur = (BACKGROUND_BLUR_BASE_PX * mainFactor).toFixed(1);
        const glowifyBlur = (GLOWIFY_BLUR_BASE_PX * glowifyFactor).toFixed(1);

        document.documentElement.style.setProperty('--dynamicglow-bg-blur', `${bgBlur}px`);
        document.documentElement.style.setProperty('--glowify-bg-blur', `${glowifyBlur}px`);
    }

    function applyRotateSpeed(config) {
        const seconds = typeof config.backgroundRotateSeconds === 'number'
            ? config.backgroundRotateSeconds
            : DEFAULT_CONFIG.backgroundRotateSeconds;
        const safeSeconds = Math.max(5, seconds);
        document.documentElement.style.setProperty('--dynamicglow-rotate-duration', `${safeSeconds}s`);
    }

    function parseColorToRgb(value) {
        if (!value) return null;
        const raw = value.trim().toLowerCase();
        if (raw.startsWith('rgb')) {
            const match = raw.match(/\d+/g);
            return match && match.length >= 3 ? match.slice(0, 3).map(Number) : null;
        }
        if (raw.startsWith('#')) {
            const hex = raw.replace('#', '');
            const normalized = hex.length === 3
                ? hex.split('').map((c) => c + c).join('')
                : hex;
            if (normalized.length !== 6) return null;
            return [
                parseInt(normalized.slice(0, 2), 16),
                parseInt(normalized.slice(2, 4), 16),
                parseInt(normalized.slice(4, 6), 16)
            ];
        }
        return null;
    }

    function syncDynamicConfigColors() {
        const styles = getComputedStyle(document.documentElement);
        const accent = styles.getPropertyValue('--glowify-glow-accent')
            || styles.getPropertyValue('--accent-color');
        if (!accent) return;

        document.documentElement.style.setProperty('--extracted-color', accent.trim());
        const rgb = parseColorToRgb(accent);
        if (rgb) {
            document.documentElement.style.setProperty('--extracted-color-rgb', rgb.join(','));
        }
    }

    // ===== STORAGE UTILITIES =====
    const ConfigStorage = {
        save(config) {
            localStorage.setItem('dynamicglow-config', JSON.stringify(config));
        },
        load() {
            const stored = localStorage.getItem('dynamicglow-config');
            return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
        }
    };

    // ===== CONFIG MENU COMPONENT =====
    function ConfigMenu() {
        const [config, setConfig] = React.useState(ConfigStorage.load());

        const updateConfig = (key, value) => {
            const newConfig = { ...config, [key]: value };
            setConfig(newConfig);
            ConfigStorage.save(newConfig);
            
            // Update enhanced effects if available
            if (window.DynamicGlowEnhanced) {
                window.DynamicGlowEnhanced.updateConfig(newConfig);
            }

            applyBackgroundBlur(newConfig);
            applyRotateSpeed(newConfig);
        };

        const resetToDefaults = () => {
            setConfig(DEFAULT_CONFIG);
            ConfigStorage.save(DEFAULT_CONFIG);
            if (window.DynamicGlowEnhanced) {
                window.DynamicGlowEnhanced.updateConfig(DEFAULT_CONFIG);
            }

            applyBackgroundBlur(DEFAULT_CONFIG);
            applyRotateSpeed(DEFAULT_CONFIG);
        };

        // Add keyframe animation for gradient rotation
        React.useEffect(() => {
            const styleId = 'dynamicglow-config-animation';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    @keyframes dynamicglow-config-gradient-rotate {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `;
                document.head.appendChild(style);
            }
        }, []);

        return e('div', {
            style: {
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(var(--extracted-color-rgb, 30, 215, 96), 0.15) 0%, rgba(0, 0, 0, 0.7) 30%, rgba(var(--extracted-color-rgb, 30, 215, 96), 0.08) 60%, rgba(0, 0, 0, 0.8) 100%)',
                backgroundSize: '200% 200%',
                animation: config.enableAnimatedGradients ? 'dynamicglow-config-gradient-rotate 8s ease infinite' : 'none',
                borderRadius: '12px',
                color: '#fff',
                fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
                maxWidth: '500px',
                backdropFilter: 'blur(40px) saturate(1.5)',
                border: '2px solid rgba(var(--extracted-color-rgb, 30, 215, 96), 0.3)',
                boxShadow: '0 0 60px 10px var(--extracted-color, rgba(30, 215, 96, 0.3)), inset 0 0 40px rgba(var(--extracted-color-rgb, 30, 215, 96), 0.1), 0 8px 32px rgba(0, 0, 0, 0.5)',
            }
        },
            // Title
            e('h2', {
                style: {
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    borderBottom: '2px solid rgba(var(--extracted-color-rgb, 30, 215, 96), 0.4)',
                    paddingBottom: '8px',
                    textShadow: '0 0 20px var(--extracted-color, rgba(30, 215, 96, 0.6)), 0 0 40px var(--extracted-color, rgba(30, 215, 96, 0.3))',
                }
            }, '✨ DynamicGlow Settings'),

            // Toggle: Pulse Effect
            ConfigMenuToggle({
                label: 'Pulse Effects',
                description: 'Animated glow pulses on text elements',
                value: config.pulseEnabled,
                onChange: (val) => updateConfig('pulseEnabled', val),
            }),

            // Slider: Pulse Intensity
            ConfigMenuSlider({
                label: 'Pulse Intensity',
                description: `${Math.round(config.pulseIntensity * 100)}% (default ${Math.round(DEFAULT_CONFIG.pulseIntensity * 100)}%)`,
                min: 0,
                max: 1,
                step: 0.1,
                value: config.pulseIntensity,
                onChange: (val) => updateConfig('pulseIntensity', val),
            }),

            // Slider: Pulse Speed
            ConfigMenuSlider({
                label: 'Pulse Speed',
                description: `${config.pulseSpeed}ms (default ${DEFAULT_CONFIG.pulseSpeed}ms)`,
                min: 500,
                max: 4000,
                step: 100,
                value: config.pulseSpeed,
                onChange: (val) => updateConfig('pulseSpeed', val),
            }),

            // Slider: Glow Intensity
            ConfigMenuSlider({
                label: 'Glow Intensity',
                description: `${Math.round(config.glowIntensity * 100)}% (default ${Math.round(DEFAULT_CONFIG.glowIntensity * 100)}%)`,
                min: 0.3,
                max: 1.5,
                step: 0.1,
                value: config.glowIntensity,
                onChange: (val) => updateConfig('glowIntensity', val),
            }),

            // Slider: Color Transition Speed
            ConfigMenuSlider({
                label: 'Transition Speed',
                description: `${config.colorTransitionSpeed}ms (default ${DEFAULT_CONFIG.colorTransitionSpeed}ms)`,
                min: 100,
                max: 1000,
                step: 50,
                value: config.colorTransitionSpeed,
                onChange: (val) => updateConfig('colorTransitionSpeed', val),
            }),

            // Toggle: Hover Pulses
            ConfigMenuToggle({
                label: 'Hover Pulse Effects',
                description: 'Extra glow on hover interactions',
                value: config.enablePulseOnHover,
                onChange: (val) => updateConfig('enablePulseOnHover', val),
            }),

            // Toggle: Element Glow
            ConfigMenuToggle({
                label: 'Element Glow',
                description: 'Soft glow around interactive elements',
                value: config.enableElementGlow,
                onChange: (val) => updateConfig('enableElementGlow', val),
            }),

            // Slider: Glass Blur Amount
            ConfigMenuSlider({
                label: 'Glass Blur',
                description: `${config.glassBlur}px (default ${DEFAULT_CONFIG.glassBlur}px)`,
                min: 0,
                max: 10,
                step: 0.5,
                value: config.glassBlur,
                onChange: (val) => {
                    updateConfig('glassBlur', val);
                    document.documentElement.style.setProperty('--glass-blur', `${val}px`);
                },
            }),

            ConfigMenuSlider({
                label: 'Background Blur (Main)',
                description: `${Math.round(config.mainBackgroundBlurPercent)}% (default ${Math.round(DEFAULT_CONFIG.mainBackgroundBlurPercent)}%)`,
                min: 0,
                max: 200,
                step: 5,
                value: config.mainBackgroundBlurPercent,
                onChange: (val) => updateConfig('mainBackgroundBlurPercent', val),
            }),

            ConfigMenuSlider({
                label: 'Background Blur (Glowify)',
                description: `${Math.round(config.glowifyBackgroundBlurPercent)}% (default ${Math.round(DEFAULT_CONFIG.glowifyBackgroundBlurPercent)}%)`,
                min: 0,
                max: 200,
                step: 5,
                value: config.glowifyBackgroundBlurPercent,
                onChange: (val) => updateConfig('glowifyBackgroundBlurPercent', val),
            }),

            ConfigMenuSlider({
                label: 'Background Rotate Speed',
                description: `${Math.round(config.backgroundRotateSeconds)}s (default ${Math.round(DEFAULT_CONFIG.backgroundRotateSeconds)}s)`,
                min: 10,
                max: 120,
                step: 5,
                value: config.backgroundRotateSeconds,
                onChange: (val) => updateConfig('backgroundRotateSeconds', val),
            }),

            // Slider: Shadow Blur
            ConfigMenuSlider({
                label: 'Shadow Blur',
                description: `${config.shadowBlur}px (default ${DEFAULT_CONFIG.shadowBlur}px)`,
                min: 2,
                max: 20,
                step: 1,
                value: config.shadowBlur,
                onChange: (val) => updateConfig('shadowBlur', val),
            }),

            // Slider: Accent Saturation
            ConfigMenuSlider({
                label: 'Color Saturation',
                description: `${Math.round(config.accentSaturation * 100)}% (default ${Math.round(DEFAULT_CONFIG.accentSaturation * 100)}%)`,
                min: 0.3,
                max: 1.5,
                step: 0.1,
                value: config.accentSaturation,
                onChange: (val) => updateConfig('accentSaturation', val),
            }),

            // Toggle: Glassmorphism Effects
            ConfigMenuToggle({
                label: 'Glassmorphic UI',
                description: 'Modern glass effects with backdrop blur',
                value: config.enableGlassmorphism,
                onChange: (val) => {
                    updateConfig('enableGlassmorphism', val);
                    // Also toggle in enhanced-effects
                    if (window.DynamicGlowEnhanced) {
                        window.DynamicGlowEnhanced.toggleGlassmorphism(val);
                    }
                },
            }),

            // Toggle: Hover Scale Effects
            ConfigMenuToggle({
                label: 'Hover Scale Effects',
                description: 'Scale up elements on hover',
                value: config.enableHoverScale,
                onChange: (val) => updateConfig('enableHoverScale', val),
            }),

            // Slider: Hover Scale Amount
            config.enableHoverScale && ConfigMenuSlider({
                label: 'Hover Scale Amount',
                description: `${Math.round(config.hoverScaleAmount * 100)}% (default ${Math.round(DEFAULT_CONFIG.hoverScaleAmount * 100)}%)`,
                min: 1.01,
                max: 1.1,
                step: 0.01,
                value: config.hoverScaleAmount,
                onChange: (val) => updateConfig('hoverScaleAmount', val),
            }),

            // Toggle: Search Bar Blur
            ConfigMenuToggle({
                label: 'Search Bar Blur',
                description: 'Apply glass effect to search input',
                value: config.enableSearchBlur,
                onChange: (val) => updateConfig('enableSearchBlur', val),
            }),

            // === API Settings Section ===
            e('h3', {
                style: {
                    margin: '24px 0 12px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderBottom: '2px solid rgba(var(--extracted-color-rgb, 30, 215, 96), 0.4)',
                    paddingBottom: '6px',
                    textShadow: '0 0 15px var(--extracted-color, rgba(30, 215, 96, 0.5))',
                }
            }, '🌐 API Settings'),

            e('div', {
                style: {
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '12px',
                    padding: '8px',
                    background: 'rgba(255, 165, 0, 0.1)',
                    borderLeft: '3px solid rgba(255, 165, 0, 0.5)',
                    borderRadius: '4px',
                }
            }, '⚠️ ALL API features are DISABLED by default to prevent 429 errors. Only enable if needed!'),

            // Toggle: Album Metadata
            ConfigMenuToggle({
                label: 'Album Metadata',
                description: 'Fetch album year and info (may cause 429 errors)',
                value: config.enableAlbumMetadata,
                onChange: (val) => {
                    updateConfig('enableAlbumMetadata', val);
                    // Notify default-dynamic extension
                    if (window.DynamicGlowAPI) {
                        window.DynamicGlowAPI.setAlbumMetadataEnabled(val);
                    }
                },
            }),

            // Toggle: Episode Metadata
            ConfigMenuToggle({
                label: 'Episode Metadata',
                description: 'Fetch podcast episode info (may cause 429 errors)',
                value: config.enableEpisodeMetadata,
                onChange: (val) => {
                    updateConfig('enableEpisodeMetadata', val);
                    // Notify default-dynamic extension
                    if (window.DynamicGlowAPI) {
                        window.DynamicGlowAPI.setEpisodeMetadataEnabled(val);
                    }
                },
            }),

            // Toggle: Focus/Cover Modes
            ConfigMenuToggle({
                label: 'Focus/Cover Modes',
                description: 'Toggle Focus Mode and Cover Zoom via topbar button',
                value: config.enableMatchYourTaste,
                onChange: (val) => {
                    updateConfig('enableMatchYourTaste', val);
                    // Notify match-your-taste extension
                    if (window.MatchYourTasteAPI) {
                        window.MatchYourTasteAPI.setEnabled(val);
                    }
                },
            }),

            // Toggle: Track Audio Features
            ConfigMenuToggle({
                label: 'Track Audio Features',
                description: 'Display energy, danceability, etc. (may cause 429 errors)',
                value: config.enableTrackFeatures,
                onChange: (val) => {
                    updateConfig('enableTrackFeatures', val);
                    if (window.DynamicGlowTrackFeaturesAPI) {
                        window.DynamicGlowTrackFeaturesAPI.setEnabled(val);
                    }
                },
            }),

            // Toggle: Sidebar Cover Images
            ConfigMenuToggle({
                label: 'Sidebar Cover Images',
                description: 'High-res images for sidebar items (may cause 429 errors)',
                value: config.enableSidebarCovers,
                onChange: (val) => {
                    updateConfig('enableSidebarCovers', val);
                    if (window.DynamicGlowSidebarAPI) {
                        window.DynamicGlowSidebarAPI.setEnabled(val);
                    }
                },
            }),

            // Toggle: List Playlists with Song
            ConfigMenuToggle({
                label: 'List Playlists with Song',
                description: 'Find which playlists contain a song (may cause 429 errors)',
                value: config.enableListPlaylistsWithSong,
                onChange: (val) => {
                    updateConfig('enableListPlaylistsWithSong', val);
                    if (window.ListPlaylistsAPI) {
                        window.ListPlaylistsAPI.setEnabled(val);
                    }
                },
            }),

            // HEXpotify Visualizer section
            e('h3', {
                style: {
                    margin: '18px 0 10px 0',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.9)',
                    borderBottom: '1px solid rgba(255,255,255,0.25)',
                    paddingBottom: '6px',
                }
            }, 'HEXpotify Visualizer 2.0'),

            ConfigMenuSlider({
                label: 'Visualizer Opacity',
                description: `${Math.round(config.superVizOpacity * 100)}% (default ${Math.round(DEFAULT_CONFIG.superVizOpacity * 100)}%)`,
                min: 0.4,
                max: 1,
                step: 0.01,
                value: config.superVizOpacity,
                onChange: (val) => updateConfig('superVizOpacity', val),
            }),

            ConfigMenuSlider({
                label: 'Visualizer Saturation',
                description: `${config.superVizSaturation.toFixed(2)}x (default ${DEFAULT_CONFIG.superVizSaturation.toFixed(2)}x)`,
                min: 0.8,
                max: 2.4,
                step: 0.05,
                value: config.superVizSaturation,
                onChange: (val) => updateConfig('superVizSaturation', val),
            }),

            ConfigMenuSlider({
                label: 'Visualizer Contrast',
                description: `${config.superVizContrast.toFixed(2)}x (default ${DEFAULT_CONFIG.superVizContrast.toFixed(2)}x)`,
                min: 0.8,
                max: 1.8,
                step: 0.05,
                value: config.superVizContrast,
                onChange: (val) => updateConfig('superVizContrast', val),
            }),

            ConfigMenuSlider({
                label: 'Visualizer Brightness',
                description: `${config.superVizBrightness.toFixed(2)}x (default ${DEFAULT_CONFIG.superVizBrightness.toFixed(2)}x)`,
                min: 0.7,
                max: 1.5,
                step: 0.05,
                value: config.superVizBrightness,
                onChange: (val) => updateConfig('superVizBrightness', val),
            }),

            ConfigMenuSlider({
                label: 'Visualizer Bloom Boost',
                description: `${config.superVizBloomBoost.toFixed(2)}x (default ${DEFAULT_CONFIG.superVizBloomBoost.toFixed(2)}x)`,
                min: 0.5,
                max: 2.5,
                step: 0.05,
                value: config.superVizBloomBoost,
                onChange: (val) => updateConfig('superVizBloomBoost', val),
            }),

            ConfigMenuSlider({
                label: 'Visualizer Source Lock',
                description: `${Math.round(config.superVizSourceLockMs)}ms (default ${Math.round(DEFAULT_CONFIG.superVizSourceLockMs)}ms)`,
                min: 300,
                max: 3000,
                step: 100,
                value: config.superVizSourceLockMs,
                onChange: (val) => updateConfig('superVizSourceLockMs', val),
            }),

            ConfigMenuSlider({
                label: 'Low-Energy Reconnect',
                description: `${Math.round(config.superVizLowEnergyReconnectMs)}ms (default ${Math.round(DEFAULT_CONFIG.superVizLowEnergyReconnectMs)}ms)`,
                min: 800,
                max: 5000,
                step: 100,
                value: config.superVizLowEnergyReconnectMs,
                onChange: (val) => updateConfig('superVizLowEnergyReconnectMs', val),
            }),

            // Reset Button with Dynamic Color
            e('button', {
                onClick: resetToDefaults,
                onMouseEnter: (ev) => {
                    ev.currentTarget.style.background = 'rgba(255, 59, 48, 0.5)';
                    ev.currentTarget.style.boxShadow = '0 0 30px 5px rgba(255, 59, 48, 0.6)';
                },
                onMouseLeave: (ev) => {
                    ev.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 59, 48, 0.3), rgba(var(--extracted-color-rgb, 30, 215, 96), 0.2))';
                    ev.currentTarget.style.boxShadow = '0 0 20px 3px rgba(var(--extracted-color-rgb, 255, 59, 48), 0.3)';
                },
                style: {
                    width: '100%',
                    padding: '10px 16px',
                    marginTop: '16px',
                    background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.3), rgba(var(--extracted-color-rgb, 30, 215, 96), 0.2))',
                    border: '2px solid rgba(var(--extracted-color-rgb, 255, 59, 48), 0.4)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 0 20px 3px rgba(var(--extracted-color-rgb, 255, 59, 48), 0.3)',
                    textShadow: '0 0 10px var(--extracted-color, rgba(255, 59, 48, 0.6))',
                }
            }, '↻ Reset to Defaults')
        );
    }

    // ===== CONFIG MENU COMPONENTS =====
    function ConfigMenuToggle({ label, description, value, onChange }) {
        return e('div', {
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid rgba(var(--extracted-color-rgb, 255, 255, 255), 0.2)',
                transition: 'all 0.2s',
            }
        },
            e('div', { style: { flex: 1 } },
                e('div', { style: { fontSize: '14px', fontWeight: '600' } }, label),
                e('div', { style: { fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' } }, description),
            ),
            e('button', {
                onClick: () => onChange(!value),
                onMouseEnter: (ev) => {
                    ev.currentTarget.style.boxShadow = '0 0 15px 3px var(--extracted-color, rgba(30, 215, 96, 0.6))';
                },
                onMouseLeave: (ev) => {
                    ev.currentTarget.style.boxShadow = value ? '0 0 10px 2px var(--extracted-color, rgba(30, 215, 96, 0.4))' : 'none';
                },
                style: {
                    width: '50px',
                    height: '28px',
                    borderRadius: '14px',
                    border: value ? '2px solid rgba(var(--extracted-color-rgb, 30, 215, 96), 0.5)' : '1px solid rgba(255, 255, 255, 0.3)',
                    backgroundColor: value ? 'var(--extracted-color, rgba(30, 215, 96, 0.7))' : 'rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    boxShadow: value ? '0 0 10px 2px var(--extracted-color, rgba(30, 215, 96, 0.4))' : 'none',
                }
            },
                e('div', {
                    style: {
                        position: 'absolute',
                        width: '24px',
                        height: '24px',
                        borderRadius: '12px',
                        backgroundColor: '#fff',
                        top: '2px',
                        left: value ? '24px' : '2px',
                        transition: 'left 0.2s',
                        boxShadow: value ? '0 0 8px var(--extracted-color, rgba(30, 215, 96, 0.8)), 0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }
                })
            )
        );
    }

    function ConfigMenuSlider({ label, description, min, max, step, value, onChange }) {
        return e('div', {
            style: {
                padding: '12px 0',
                borderBottom: '1px solid rgba(var(--extracted-color-rgb, 255, 255, 255), 0.2)',
            }
        },
            e('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
                e('div', { style: { fontSize: '14px', fontWeight: '600' } }, label),
                e('div', { 
                    style: { 
                        fontSize: '12px', 
                        color: 'rgba(var(--extracted-color-rgb, 30, 215, 96), 0.9)',
                        textShadow: '0 0 5px var(--extracted-color, rgba(30, 215, 96, 0.5))'
                    } 
                }, description),
            ),
            e('input', {
                type: 'range',
                min,
                max,
                step,
                value,
                onChange: (e) => onChange(parseFloat(e.target.value)),
                style: {
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer',
                    accentColor: 'var(--extracted-color, rgba(30, 215, 96, 0.9))',
                    boxShadow: '0 0 10px 1px var(--extracted-color, rgba(30, 215, 96, 0.3))',
                }
            })
        );
    }

    // ===== OPEN CONFIG MENU =====
    function openConfigMenu() {
        Spicetify.PopupModal.display({
            title: 'DynamicGlow Configuration',
            content: e(ConfigMenu),
            isLarge: false,
        });
    }

    // ===== ADD MENU BUTTON =====
    function addConfigButton() {
        let tries = 0;
        const maxTries = 10;
        const timer = setInterval(() => {
            tries += 1;
            const reloadButton = document.querySelector('button[aria-label="Reload page"]');
            if (!reloadButton) {
                if (tries >= maxTries) clearInterval(timer);
                return;
            }

            let button = document.getElementById('dynamicglow-config-btn');
            if (!button) {
                button = document.createElement('button');
                button.id = 'dynamicglow-config-btn';
                button.setAttribute('aria-label', 'DynamicGlow Config');
                button.setAttribute('title', 'DynamicGlow Config');
                button.innerHTML = `
                    <svg role="img" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" fill="currentColor"></path>
                    </svg>
                `;
                button.onclick = openConfigMenu;
            }

            button.className = reloadButton.className + ' dynamicglow-config-button';

            const actionButtons = reloadButton.closest('.main-actionButtons');
            const wrapper = reloadButton.closest('div');
            if (actionButtons && wrapper && wrapper.parentElement === actionButtons) {
                if (button.parentElement !== actionButtons || button.nextSibling !== wrapper) {
                    actionButtons.insertBefore(button, wrapper);
                }
            } else if (button !== reloadButton.previousElementSibling) {
                reloadButton.insertAdjacentElement('beforebegin', button);
            }

            if (tries >= maxTries) clearInterval(timer);
        }, 500);
    }

    // ===== EXPOSE GLOBAL FUNCTIONS =====
    window.DynamicGlowConfig = {
        open: openConfigMenu,
        load: () => ConfigStorage.load(),
        save: (config) => ConfigStorage.save(config),
    };

    // ===== INITIALIZE =====
    console.log('[DynamicGlow Config] Initializing...');
    addConfigButton();

    // Keep config UI colors in sync with dynamic accent
    let lastSyncAt = 0;
    const syncObserver = new MutationObserver(() => {
        const now = Date.now();
        if (now - lastSyncAt < 1000) return;
        lastSyncAt = now;
        syncDynamicConfigColors();
    });
    syncObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style']
    });
    setTimeout(syncDynamicConfigColors, 1000);

    // Load saved config into enhanced effects
    setTimeout(() => {
        const savedConfig = ConfigStorage.load();
        if (window.DynamicGlowEnhanced) {
            window.DynamicGlowEnhanced.updateConfig(savedConfig);
        }

        applyBackgroundBlur(savedConfig);
        applyRotateSpeed(savedConfig);
    }, 1000);

    console.log('[DynamicGlow Config] Initialized. Press window.DynamicGlowConfig.open() to access settings');
})();
