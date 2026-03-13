// Progress Bar Glow - Minimal CSS-only approach
(function initProgressGlow() {
    const style = document.createElement('style');
    style.textContent = `
        /* Add glow and bloom to progress bar fill */
        .x-progressBar-fillColor {
            box-shadow: 
                0 0 6px var(--glowify-glow-accent),
                0 0 12px var(--glowify-glow-accent),
                0 0 20px var(--glowify-glow-accent),
                0 0 32px var(--glowify-glow-accent),
                0 0 48px var(--glowify-glow-accent),
                0 0 64px rgba(0, 0, 0, 0.5) !important;
            background: var(--glowify-glow-accent) !important;
            filter: drop-shadow(0 0 12px var(--glowify-glow-accent)) drop-shadow(0 0 20px var(--glowify-glow-accent)) !important;
            opacity: 1 !important;
        }

        /* Add bloom glow to volume bar fill */
        .x-volumeBar-fillColor {
            box-shadow: 
                0 0 6px var(--glowify-glow-accent),
                0 0 12px var(--glowify-glow-accent),
                0 0 20px var(--glowify-glow-accent),
                0 0 32px var(--glowify-glow-accent),
                0 0 48px rgba(0, 0, 0, 0.4) !important;
            background: var(--glowify-glow-accent) !important;
            filter: drop-shadow(0 0 12px var(--glowify-glow-accent)) drop-shadow(0 0 16px var(--glowify-glow-accent)) !important;
            opacity: 1 !important;
        }

        /* Brighten progress bar track */
        .progress-bar {
            background: rgba(255, 255, 255, 0.15) !important;
        }

        /* Brighten volume bar track */
        .volume-bar {
            background: rgba(255, 255, 255, 0.15) !important;
        }
    `;
    document.head.appendChild(style);
    console.log("[Progress Glow] Bloom effects with full opacity applied");
})();
