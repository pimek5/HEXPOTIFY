/**
 * Enhanced Effects for DynamicGlow Theme
 * - Animated color pulses matching dynamic accent
 * - Glow intensity modulation
 * - Color transition smoothing
 * - Interactive UI elements enhancement
 * Version: 1.0.0
 */

(function() {
    if (!Spicetify) return;

    // ===== CONFIGURATION =====
    const CONFIG = {
        pulseEnabled: true,
        pulseIntensity: 0.8, // 0-1
        pulseSpeed: 2000, // ms
        glowIntensity: 1.0, // 0-1
        colorTransitionSpeed: 300, // ms
        enableAnimatedGradients: true,
        enablePulseOnHover: true,
        enableGlassmorphism: true,
        glassBlur: 2, // px
        accentSaturation: 1.0, // 0-1.5
        shadowBlur: 12, // px
        enableElementGlow: true,
    };

    // Store current glow color
    let currentGlowColor = { r: 30, g: 215, b: 96 }; // Default green
    const ACCENT_OBSERVER_COOLDOWN_MS = 1000;
    let lastObservedAccent = null;
    let lastAccentObservedAt = 0;
    let pendingObservedAccent = null;
    let accentObserverTimer = null;

    // ===== INJECT ANIMATION STYLES =====
    function injectAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Animated Glow Pulse */
            @keyframes glowPulse {
                0%, 100% {
                    filter: drop-shadow(0 0 4px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.3));
                }
                50% {
                    filter: drop-shadow(0 0 12px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.7));
                }
            }

            /* Smooth Color Transition */
            @keyframes colorFade {
                0%, 100% {
                    color: var(--glowify-glow-accent);
                }
            }

            /* Animated Gradient Background */
            @keyframes gradientFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            /* Interactive Button Glow on Hover */
            .glowify-enhanced-button:hover {
                animation: buttonPulse 0.6s ease-in-out;
            }

            @keyframes buttonPulse {
                0%, 100% {
                    box-shadow: 0 0 8px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.4);
                }
                50% {
                    box-shadow: 0 0 16px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.8);
                }
            }

            /* Pulsing Title Text */
            .glowify-pulse-text {
                animation: glowPulse ${CONFIG.pulseSpeed}ms ease-in-out infinite;
            }

            /* Smooth Transition for Color Changes */
            .glowify-transition {
                transition: all ${CONFIG.colorTransitionSpeed}ms cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Animated Border Glow */
            @keyframes borderGlow {
                0%, 100% {
                    border-color: rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.3);
                    box-shadow: inset 0 0 8px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.1);
                }
                50% {
                    border-color: rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.8);
                    box-shadow: inset 0 0 16px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.3);
                }
            }

            .glowify-animated-border {
                animation: borderGlow ${CONFIG.pulseSpeed}ms ease-in-out infinite;
            }

            /* Glow Intensity Modulation */
            .glowify-high-intensity {
                filter: brightness(${1 + CONFIG.glowIntensity * 0.3}) contrast(${1 + CONFIG.glowIntensity * 0.2});
            }
            
            /* Glassmorphic Toggle */
            :root.glassmorphism-disabled {
                --glass-enabled: 0;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== UPDATE GLOW COLOR VARIABLES =====
    function updateGlowVariables(r, g, b) {
        currentGlowColor = { r, g, b };
        document.documentElement.style.setProperty('--glow-r', r);
        document.documentElement.style.setProperty('--glow-g', g);
        document.documentElement.style.setProperty('--glow-b', b);
    }

    // ===== APPLY PULSE TO ELEMENTS =====
    function enhanceElementsWithPulse() {
        // Apply to track titles
        const trackTitles = document.querySelectorAll('.main-trackList-trackListRow .main-trackInfo-name');
        trackTitles.forEach(title => {
            title.classList.add('glowify-transition');
            if (CONFIG.pulseEnabled) {
                title.classList.add('glowify-pulse-text');
            }
        });

        // Apply to artist names
        const artists = document.querySelectorAll('.main-trackList-trackListRow .main-trackInfo-artist');
        artists.forEach(artist => {
            artist.classList.add('glowify-transition');
        });

        // Apply to now playing title
        const nowPlayingTitle = document.querySelector('.Root__now-playing-bar [data-testid="context-item-info-title"]');
        if (nowPlayingTitle) {
            nowPlayingTitle.classList.add('glowify-transition');
            if (CONFIG.pulseEnabled) {
                nowPlayingTitle.classList.add('glowify-pulse-text', 'glowify-high-intensity');
            }
        }
    }

    // ===== APPLY HOVER GLOW EFFECTS =====
    function enhanceHoverEffects() {
        // Interactive buttons
        const buttons = document.querySelectorAll('button, [role="button"], .main-trackList-trackListRow');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (CONFIG.enablePulseOnHover) {
                    button.style.filter = `drop-shadow(0 0 12px rgba(${currentGlowColor.r}, ${currentGlowColor.g}, ${currentGlowColor.b}, 0.6))`;
                }
            });
            button.addEventListener('mouseleave', () => {
                button.style.filter = '';
            });
        });
    }

    // ===== OBSERVE DYNAMIC COLOR CHANGES =====
    function observeColorChanges() {
        const observer = new MutationObserver(() => {
            const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--glowify-glow-accent');
            if (!accentColor) return;

            const trimmed = accentColor.trim();
            if (!trimmed || trimmed === lastObservedAccent) return;

            const now = Date.now();
            const elapsed = now - lastAccentObservedAt;
            if (elapsed < ACCENT_OBSERVER_COOLDOWN_MS) {
                pendingObservedAccent = trimmed;
                if (!accentObserverTimer) {
                    accentObserverTimer = setTimeout(() => {
                        accentObserverTimer = null;
                        const next = pendingObservedAccent;
                        pendingObservedAccent = null;
                        if (!next || next === lastObservedAccent) return;
                        const rgb = hexToRgb(next) || [30, 215, 96];
                        updateGlowVariables(rgb[0], rgb[1], rgb[2]);
                        enhanceElementsWithPulse();
                        lastObservedAccent = next;
                        lastAccentObservedAt = Date.now();
                    }, ACCENT_OBSERVER_COOLDOWN_MS - elapsed);
                }
                return;
            }

            const rgb = hexToRgb(trimmed) || [30, 215, 96];
            updateGlowVariables(rgb[0], rgb[1], rgb[2]);
            enhanceElementsWithPulse();
            lastObservedAccent = trimmed;
            lastAccentObservedAt = now;
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    // ===== HEX TO RGB CONVERSION =====
    function hexToRgb(hex) {
        if (!hex || hex.length === 0) return null;
        
        hex = hex.replace(/^#/, '');
        
        // If it's already rgb/rgba, parse it
        if (hex.includes('rgb')) {
            const match = hex.match(/(\d+)/g);
            return match ? match.slice(0, 3).map(Number) : null;
        }
        
        // Handle short hex
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        
        if (hex.length !== 6) return null;
        
        return [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16)
        ];
    }

    // ===== ANIMATE COLOR TRANSITIONS =====
    function animateColorTransition(fromColor, toColor, duration = CONFIG.colorTransitionSpeed) {
        const steps = 60;
        const startTime = Date.now();
        
        function frame() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const r = Math.round(fromColor.r + (toColor.r - fromColor.r) * progress);
            const g = Math.round(fromColor.g + (toColor.g - fromColor.g) * progress);
            const b = Math.round(fromColor.b + (toColor.b - fromColor.b) * progress);
            
            updateGlowVariables(r, g, b);
            
            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }
        
        requestAnimationFrame(frame);
    }

    // ===== APPLY NEW EFFECTS CONFIGURATION =====
    function applyEffectsConfig() {
        // Update glass blur
        document.documentElement.style.setProperty('--glass-blur', `${CONFIG.glassBlur}px`);
        
        // Update shadow blur
        document.documentElement.style.setProperty('--shadow-blur', `${CONFIG.shadowBlur}px`);
        
        // Update accent saturation - apply to all text elements
        if (CONFIG.accentSaturation !== 1.0) {
            const saturation = CONFIG.accentSaturation;
            const elements = document.querySelectorAll('.main-trackInfo-name, .main-trackInfo-artist, .main-nowPlayingWidget-nowPlaying');
            elements.forEach(el => {
                el.style.filter = `saturate(${saturation})`;
            });
        }
        
        // Toggle element glow
        if (CONFIG.enableElementGlow) {
            const cards = document.querySelectorAll('.main-card-card, .main-userWidget-box');
            cards.forEach(card => {
                card.style.boxShadow = `0 4px 20px rgba(0, 0, 0, 0.3), 0 0 24px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.2)`;
            });
        }
    }

    // ===== INITIALIZE =====
    function init() {
        console.log('[Enhanced Effects] Initializing...');
        
        // Set initial glow color variables
        updateGlowVariables(currentGlowColor.r, currentGlowColor.g, currentGlowColor.b);
        
        // Inject styles
        injectAnimationStyles();
        
        // Apply new effects configuration
        applyEffectsConfig();
        
        // Apply glassmorphism if enabled
        if (CONFIG.enableGlassmorphism) {
            applyGlassmorphism();
        }
        
        // Wait for DOM to be ready
        setTimeout(() => {
            enhanceElementsWithPulse();
            enhanceHoverEffects();
            observeColorChanges();
            
            // Re-enhance elements on track change
            Spicetify.Player?.addEventListener('songchange', () => {
                setTimeout(() => {
                    enhanceElementsWithPulse();
                }, 100);
            });
        }, 1000);
        
        console.log('[Enhanced Effects] Initialized successfully');
    }
    
    // ===== GLASSMORPHISM TOGGLE =====
    function applyGlassmorphism() {
        document.documentElement.classList.remove('glassmorphism-disabled');
        console.log('[Enhanced Effects] Glassmorphism enabled');
    }
    
    function disableGlassmorphism() {
        document.documentElement.classList.add('glassmorphism-disabled');
        console.log('[Enhanced Effects] Glassmorphism disabled');
    }

    // ===== EXPOSE GLOBAL INTERFACE =====
    window.DynamicGlowEnhanced = {
        updateConfig(newConfig) {
            Object.assign(CONFIG, newConfig);
            console.log('[Enhanced Effects] Config updated:', CONFIG);
            injectAnimationStyles();
            applyEffectsConfig();
            
            // Handle glassmorphism toggle
            if (newConfig.enableGlassmorphism !== undefined) {
                if (newConfig.enableGlassmorphism) {
                    applyGlassmorphism();
                } else {
                    disableGlassmorphism();
                }
            }
        },
        getConfig() {
            return { ...CONFIG };
        },
        animateColorTransition,
        updateGlowVariables,
        toggleGlassmorphism(enabled) {
            CONFIG.enableGlassmorphism = enabled;
            if (enabled) {
                applyGlassmorphism();
            } else {
                disableGlassmorphism();
            }
        },
        applyEffectsConfig
    };

    // Start when Spicetify is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
