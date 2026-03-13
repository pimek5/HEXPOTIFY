/* Innovative Effects - Pulse, Canvas Waves, Glitch Effect, Color History Trail */

// ===== 5. RIPPLE WAVE EFFECT =====
(function rippleWaveEffect() {
    console.log('[InnovativeEffects] Starting Ripple Wave Effect...');
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleExpand {
            0% { 
                width: 0px;
                height: 0px;
                opacity: 0.8;
            }
            50% { 
                opacity: 0.4;
            }
            100% { 
                width: 3000px;
                height: 3000px;
                opacity: 0;
            }
        }

        .glowify-ripple-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 100;
            overflow: hidden;
        }

        .glowify-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            border: 3px solid var(--glowify-glow-accent, var(--accent-color));
            box-shadow: 
                0 0 20px var(--glowify-glow-accent, var(--accent-color)),
                inset 0 0 20px var(--glowify-glow-accent, var(--accent-color));
            opacity: 0;
            animation: rippleExpand 1.5s ease-out forwards;
        }
    `;
    document.head.appendChild(style);

    let rippleContainer = null;

    function createRippleContainer() {
        if (!rippleContainer) {
            rippleContainer = document.createElement('div');
            rippleContainer.className = 'glowify-ripple-container';
            document.body.appendChild(rippleContainer);
            console.log('[InnovativeEffects] Ripple container created');
        }
    }

    function triggerRipple() {
        if (!rippleContainer) createRippleContainer();
        
        // Create multiple ripples with delays for wave effect
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const ripple = document.createElement('div');
                ripple.className = 'glowify-ripple';
                rippleContainer.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 1500);
            }, i * 200);
        }
    }

    createRippleContainer();

    // Trigger ripple on song change
    if (Spicetify.Player) {
        Spicetify.Player.addEventListener('songchange', () => {
            console.log('[InnovativeEffects] Song changed - triggering ripple');
            triggerRipple();
        });
    }

    // Also trigger on color change
    const originalSetProperty = document.documentElement.style.setProperty;
    let lastColorChangeTime = 0;
    document.documentElement.style.setProperty = function(...args) {
        if (args[0] === '--glowify-glow-accent' && args[1]) {
            const now = Date.now();
            // Only trigger ripple every 2 seconds to avoid spam
            if (now - lastColorChangeTime > 2000) {
                triggerRipple();
                lastColorChangeTime = now;
            }
        }
        return originalSetProperty.apply(this, args);
    };

    console.log('[InnovativeEffects] Ripple Wave Effect initialized');
})();

// ===== 4. BLOOM EFFECT FOR COVER ART WITH BLURRED BACKDROP =====
(function coverArtBloomEffect() {
    console.log('[InnovativeEffects] Starting Cover Art Bloom Effect with Multi-Directional Colors...');
    
    const style = document.createElement('style');
    style.textContent = `
        /* Allow overflow for bloom effect */
        .xjf0Pj3YnoegOkJUpaPS,
        .ELBNLm3p55pH7fmnfdh7,
        [data-testid="now-playing-widget"],
        .Root__right-sidebar,
        .main-nowPlayingView-container {
            overflow: visible !important;
        }

        /* Add padding to header to prevent bloom clipping */
        .xjf0Pj3YnoegOkJUpaPS {
            padding-top: 100px !important;
            margin-top: -100px !important;
        }

        /* Ensure cover art has enough space around it */
        [data-testid="track-visual-enhancement"] {
            padding: 100px 0 !important;
            position: relative !important;
        }

        /* Create blurred backdrop bloom effect with actual album colors */
        [data-testid="track-visual-enhancement"]::before {
            content: '' !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) scale(1.8) !important;
            width: 400px !important;
            height: 400px !important;
            background-image: var(--cover-art-image) !important;
            background-size: cover !important;
            background-position: center !important;
            filter: blur(80px) brightness(1.4) saturate(2) !important;
            opacity: 0.8 !important;
            z-index: -1 !important;
            pointer-events: none !important;
            border-radius: 50% !important;
            animation: bloomPulseBackdrop 3s ease-in-out infinite !important;
        }

        @keyframes bloomPulseBackdrop {
            0%, 100% {
                transform: translate(-50%, -50%) scale(1.8) !important;
                opacity: 0.8 !important;
                filter: blur(80px) brightness(1.4) saturate(2) !important;
            }
            50% {
                transform: translate(-50%, -50%) scale(2.1) !important;
                opacity: 0.95 !important;
                filter: blur(90px) brightness(1.6) saturate(2.3) !important;
            }
        }

        /* Directional blooms with sampled colors */
        [data-testid="track-visual-enhancement"]::after {
            content: '' !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 500px !important;
            height: 500px !important;
            background: 
                radial-gradient(ellipse at top, var(--bloom-top, transparent) 0%, transparent 40%),
                radial-gradient(ellipse at bottom, var(--bloom-bottom, transparent) 0%, transparent 40%),
                radial-gradient(ellipse at left, var(--bloom-left, transparent) 0%, transparent 40%),
                radial-gradient(ellipse at right, var(--bloom-right, transparent) 0%, transparent 40%) !important;
            filter: blur(60px) !important;
            opacity: 0.7 !important;
            z-index: -1 !important;
            pointer-events: none !important;
            animation: directionalBloomPulse 4s ease-in-out infinite !important;
        }

        @keyframes directionalBloomPulse {
            0%, 100% {
                opacity: 0.7 !important;
                transform: translate(-50%, -50%) scale(1) !important;
            }
            50% {
                opacity: 0.9 !important;
                transform: translate(-50%, -50%) scale(1.15) !important;
            }
        }

        /* Ultra-strong bloom for cover art container */
        .main-nowPlayingView-coverArt,
        .LAd8oOudR97w458uuzVA {
            box-shadow: 
                0 0 20px 8px var(--glowify-glow-accent),
                0 0 40px 16px var(--glowify-glow-accent),
                0 0 60px 24px var(--glowify-glow-accent) !important;
            filter: drop-shadow(0 0 25px var(--glowify-glow-accent)) !important;
            border-radius: 12px !important;
            position: relative !important;
            z-index: 1 !important;
        }

        /* Additional bloom for the image itself */
        .main-image-image.cover-art-image {
            filter: drop-shadow(0 0 20px var(--glowify-glow-accent)) !important;
        }

        /* Animated pulsating glow for cover */
        @keyframes coverBloomPulse {
            0%, 100% {
                box-shadow: 
                    0 0 20px 8px var(--glowify-glow-accent),
                    0 0 40px 16px var(--glowify-glow-accent),
                    0 0 60px 24px var(--glowify-glow-accent);
            }
            50% {
                box-shadow: 
                    0 0 30px 12px var(--glowify-glow-accent),
                    0 0 60px 24px var(--glowify-glow-accent),
                    0 0 90px 36px var(--glowify-glow-accent);
            }
        }

        .main-nowPlayingView-coverArt,
        .LAd8oOudR97w458uuzVA {
            animation: coverBloomPulse 3s ease-in-out infinite !important;
        }
    `;
    document.head.appendChild(style);

    // Function to sample color from specific edge of image
    async function sampleEdgeColor(imgSrc, edge) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Enable CORS
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.naturalWidth || img.width;
                    canvas.height = img.naturalHeight || img.height;
                    
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        let x, y, sampleWidth, sampleHeight;
        
        switch(edge) {
            case 'top':
                x = canvas.width / 2;
                y = 10;
                sampleWidth = canvas.width;
                sampleHeight = 20;
                break;
            case 'bottom':
                x = canvas.width / 2;
                y = canvas.height - 10;
                sampleWidth = canvas.width;
                sampleHeight = 20;
                break;
            case 'left':
                x = 10;
                y = canvas.height / 2;
                sampleWidth = 20;
                sampleHeight = canvas.height;
                break;
            case 'right':
                x = canvas.width - 10;
                y = canvas.height / 2;
                sampleWidth = 20;
                sampleHeight = canvas.height;
                break;
        }
        
                    const imageData = ctx.getImageData(Math.max(0, x - sampleWidth/2), Math.max(0, y - sampleHeight/2), sampleWidth, sampleHeight);
                    const data = imageData.data;
                    
                    let r = 0, g = 0, b = 0, count = 0;
                    
                    for (let i = 0; i < data.length; i += 4) {
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                        count++;
                    }
                    
                    r = Math.floor(r / count);
                    g = Math.floor(g / count);
                    b = Math.floor(b / count);
                    
                    resolve(`rgb(${r}, ${g}, ${b})`);
                } catch (e) {
                    reject(e);
                }
            };
            
            img.onerror = () => reject(new Error('Image failed to load'));
            img.src = imgSrc;
        });
    }

    // Function to update backdrop with current album art
    async function updateBloomBackdrop() {
        // Try multiple selectors to find the cover image
        let coverImg = document.querySelector('.main-image-image.cover-art-image');
        if (!coverImg) {
            coverImg = document.querySelector('[class*="cover-art-image"]');
        }
        if (!coverImg) {
            coverImg = document.querySelector('img.main-image-image');
        }
        
        if (coverImg && coverImg.complete && coverImg.src) {
            const imgSrc = coverImg.src;
            document.documentElement.style.setProperty('--cover-art-image', `url(${imgSrc})`);
            
            // Sample colors from each edge (async now)
            try {
                const [topColor, bottomColor, leftColor, rightColor] = await Promise.all([
                    sampleEdgeColor(imgSrc, 'top'),
                    sampleEdgeColor(imgSrc, 'bottom'),
                    sampleEdgeColor(imgSrc, 'left'),
                    sampleEdgeColor(imgSrc, 'right')
                ]);
                
                document.documentElement.style.setProperty('--bloom-top', topColor);
                document.documentElement.style.setProperty('--bloom-bottom', bottomColor);
                document.documentElement.style.setProperty('--bloom-left', leftColor);
                document.documentElement.style.setProperty('--bloom-right', rightColor);
                
                console.log('[InnovativeEffects] Sampled edge colors:', {topColor, bottomColor, leftColor, rightColor});
            } catch (e) {
                console.warn('[InnovativeEffects] Could not sample edge colors:', e);
            }
        } else if (!coverImg) {
            // Retry if image not found yet
            setTimeout(() => updateBloomBackdrop(), 500);
        }
    }

    // Update on song change
    if (Spicetify.Player) {
        Spicetify.Player.addEventListener('songchange', () => {
            setTimeout(() => updateBloomBackdrop(), 500);
            setTimeout(() => updateBloomBackdrop(), 1500);
        });
    }

    // Initial update
    setTimeout(() => updateBloomBackdrop(), 1000);
    setTimeout(() => updateBloomBackdrop(), 2000);
    setTimeout(() => updateBloomBackdrop(), 3000);

    // Watch for image changes
    const observer = new MutationObserver(() => {
        updateBloomBackdrop();
    });

    setTimeout(() => {
        const targetNode = document.querySelector('[data-testid="track-visual-enhancement"]');
        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src']
            });
        }
    }, 1000);

    console.log('[InnovativeEffects] Cover Art Bloom Effect with Multi-Directional Edge Sampling initialized! 🔥');
})();


// ===== 10. COLOR HISTORY TRAIL =====
(function colorHistoryTrail() {
    console.log('[InnovativeEffects] Starting Color History Trail...');
    
    let colorHistory = [];
    const MAX_HISTORY = 5;

    const style = document.createElement('style');
    style.textContent = `
        .glowify-color-history {
            position: fixed !important;
            top: 70px !important;
            right: 20px !important;
            display: flex !important;
            gap: 8px !important;
            z-index: 9999 !important;
            pointer-events: auto !important;
        }

        .glowify-history-dot {
            width: 28px !important;
            height: 28px !important;
            border-radius: 50% !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            box-shadow: 0 0 12px currentColor,
                       inset 0 0 8px rgba(255, 255, 255, 0.2) !important;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            position: relative !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .glowify-history-dot:hover {
            transform: scale(1.3) !important;
            border-color: rgba(255, 255, 255, 0.8) !important;
            box-shadow: 0 0 20px currentColor,
                       inset 0 0 12px rgba(255, 255, 255, 0.4) !important;
        }

        .glowify-history-label {
            position: absolute !important;
            bottom: -25px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            font-size: 10px !important;
            color: rgba(255, 255, 255, 0.6) !important;
            white-space: nowrap !important;
            opacity: 0 !important;
            transition: opacity 0.3s !important;
            pointer-events: none !important;
        }

        .glowify-history-dot:hover .glowify-history-label {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
    console.log('[InnovativeEffects] Color History Trail CSS added');

    // Track color changes
    const originalSetProperty = document.documentElement.style.setProperty;
    document.documentElement.style.setProperty = function(...args) {
        if (args[0] === '--glowify-glow-accent' && args[1]) {
            const newColor = args[1].trim();
            
            // Only add if different from last
            if (colorHistory.length === 0 || colorHistory[0] !== newColor) {
                colorHistory.unshift(newColor);
                if (colorHistory.length > MAX_HISTORY) {
                    colorHistory.pop();
                }
                updateHistoryUI();
                console.log('[InnovativeEffects] Color added to history:', newColor);
            }
        }
        return originalSetProperty.apply(this, args);
    };

    function updateHistoryUI() {
        let historyContainer = document.querySelector('.glowify-color-history');
        
        if (!historyContainer) {
            historyContainer = document.createElement('div');
            historyContainer.className = 'glowify-color-history';
            document.body.appendChild(historyContainer);
            console.log('[InnovativeEffects] History container created');
        }

        historyContainer.innerHTML = '';
        colorHistory.forEach((color, index) => {
            const dot = document.createElement('div');
            dot.className = 'glowify-history-dot';
            dot.style.color = color;
            
            const label = document.createElement('div');
            label.className = 'glowify-history-label';
            label.textContent = index === 0 ? 'Current' : `-${index}`;
            
            dot.appendChild(label);
            historyContainer.appendChild(dot);
        });
    }

    console.log('[InnovativeEffects] Color History Trail initialized');
})();

// ===== 1. ANIMATED PULSE EFFECT =====
(function animatedPulseEffect() {
    console.log('[InnovativeEffects] Starting Animated Pulse Effect...');
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glowPulseIntense {
            0%, 100% {
                filter: drop-shadow(0 0 15px var(--glowify-glow-accent)) 
                        drop-shadow(0 0 30px rgba(var(--spice-rgb-main), 0.3));
                transform: scale(1) !important;
            }
            50% {
                filter: drop-shadow(0 0 25px var(--glowify-glow-accent)) 
                        drop-shadow(0 0 50px rgba(var(--spice-rgb-main), 0.6));
                transform: scale(1.03) !important;
            }
        }

        [data-testid="now-playing-widget"] {
            animation: glowPulseIntense 2s ease-in-out infinite !important;
        }
    `;
    document.head.appendChild(style);
    console.log('[InnovativeEffects] Animated Pulse Effect CSS added');
})();

console.log('[InnovativeEffects] ✅ All innovative effects loaded!');

