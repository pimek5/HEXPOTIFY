/* Force Bloom - Ensures bloom stays on cards */

(function forceBloom() {
    console.log('[ForceBloom] Starting persistent bloom enforcer...');

    const style = document.createElement('style');
    style.id = 'force-bloom-style';
    style.textContent = `
        .Root__right-sidebar .main-nowPlayingView-section,
        .Root__right-sidebar [data-testid="now-playing-widget"] section,
        .Root__right-sidebar [data-testid="now-playing-widget"] article,
        [data-testid="now-playing-widget"] .main-nowPlayingView-section,
        .main-nowPlayingView-nowPlayingGrid .main-nowPlayingView-section {
            box-shadow: 
                0 0 20px 5px var(--glowify-glow-accent) !important,
                0 0 40px 10px var(--glowify-glow-accent) !important,
                0 0 60px 15px rgba(var(--spice-rgb-text), 0.3) !important,
                0 0 80px 20px rgba(var(--spice-rgb-text), 0.2) !important,
                0 0 20px rgba(255, 255, 255, 0.08) !important, 
                0 0 40px rgba(0, 0, 0, 0.25) !important;
            animation: cardBloomPulse 4s ease-in-out infinite !important;
            will-change: box-shadow !important;
        }

        @keyframes cardBloomPulse {
            0%, 100% {
                box-shadow: 
                    0 0 20px 5px var(--glowify-glow-accent) !important,
                    0 0 40px 10px var(--glowify-glow-accent) !important,
                    0 0 60px 15px rgba(var(--spice-rgb-text), 0.3) !important,
                    0 0 80px 20px rgba(var(--spice-rgb-text), 0.2) !important,
                    0 0 20px rgba(255, 255, 255, 0.08) !important, 
                    0 0 40px rgba(0, 0, 0, 0.25) !important;
            }
            50% {
                box-shadow: 
                    0 0 30px 8px var(--glowify-glow-accent) !important,
                    0 0 60px 16px var(--glowify-glow-accent) !important,
                    0 0 90px 24px rgba(var(--spice-rgb-text), 0.4) !important,
                    0 0 120px 32px rgba(var(--spice-rgb-text), 0.3) !important,
                    0 0 30px rgba(255, 255, 255, 0.12) !important, 
                    0 0 60px rgba(0, 0, 0, 0.35) !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Continuously enforce bloom on elements
    function enforceBloom() {
        const cards = document.querySelectorAll(`
            .Root__right-sidebar .main-nowPlayingView-section,
            .Root__right-sidebar [data-testid="now-playing-widget"] section,
            .Root__right-sidebar [data-testid="now-playing-widget"] article,
            [data-testid="now-playing-widget"] .main-nowPlayingView-section,
            .main-nowPlayingView-nowPlayingGrid .main-nowPlayingView-section
        `);

        cards.forEach(card => {
            // Force animation property
            if (card.style.animation !== 'cardBloomPulse 4s ease-in-out infinite') {
                card.style.animation = 'cardBloomPulse 4s ease-in-out infinite';
            }
            
            // Ensure box-shadow is present
            const currentShadow = getComputedStyle(card).boxShadow;
            if (currentShadow === 'none' || !currentShadow.includes('var(--glowify-glow-accent)')) {
                card.style.setProperty('box-shadow', 
                    '0 0 20px 5px var(--glowify-glow-accent), 0 0 40px 10px var(--glowify-glow-accent), 0 0 60px 15px rgba(var(--spice-rgb-text), 0.3), 0 0 80px 20px rgba(var(--spice-rgb-text), 0.2), 0 0 20px rgba(255, 255, 255, 0.08), 0 0 40px rgba(0, 0, 0, 0.25)',
                    'important'
                );
            }
        });
    }

    // Run immediately
    enforceBloom();

    // Run every 500ms to catch new elements
    setInterval(enforceBloom, 500);

    // Run on mutations
    const observer = new MutationObserver(() => {
        enforceBloom();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('[ForceBloom] Persistent bloom enforcer active!');
})();
