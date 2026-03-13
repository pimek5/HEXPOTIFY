// DynamicGlow - Audio Visualizer Extension

(async function initVisualizer() {
    // Wait for Spicetify
    while (!Spicetify?.showNotification) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Create canvas for visualizer
    const canvas = document.createElement('canvas');
    canvas.id = 'dynamicglow-visualizer';
    canvas.style.cssText = `
        position: fixed;
        bottom: 95px;
        left: 50%;
        transform: translateX(-50%);
        width: 600px;
        height: 120px;
        z-index: 999;
        opacity: 0.8;
        pointer-events: none;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const bars = 64;
    const dataArray = new Array(bars).fill(0);
    
    function resizeCanvas() {
        canvas.width = 600;
        canvas.height = 120;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Get accent color
    function getAccentColor() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--spice-text')
            .trim() || '#FFFFFF';
    }
    
    function animate() {
        const isPlaying = !Spicetify.Player.data?.isPaused;
        
        // Generate wave data
        for (let i = 0; i < bars; i++) {
            if (isPlaying) {
                const time = Date.now() * 0.001;
                const wave1 = Math.sin(time + i * 0.3) * 0.4;
                const wave2 = Math.sin(time * 0.7 + i * 0.2) * 0.3;
                const wave3 = Math.sin(time * 1.3 + i * 0.1) * 0.2;
                const randomness = Math.random() * 0.3;
                
                const target = Math.max(0, wave1 + wave2 + wave3 + randomness + 0.3);
                dataArray[i] += (target - dataArray[i]) * 0.15;
            } else {
                dataArray[i] *= 0.92;
            }
        }
        
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw bars
        const accentColor = getAccentColor();
        const barWidth = canvas.width / bars - 2;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < bars; i++) {
            const barHeight = dataArray[i] * canvas.height * 0.6;
            const x = i * (barWidth + 2);
            
            // Gradient for each bar
            const gradient = ctx.createLinearGradient(x, centerY - barHeight, x, centerY + barHeight);
            gradient.addColorStop(0, accentColor + '00');
            gradient.addColorStop(0.3, accentColor + 'CC');
            gradient.addColorStop(0.7, accentColor + 'CC');
            gradient.addColorStop(1, accentColor + '00');
            
            // Top bar
            ctx.fillStyle = gradient;
            ctx.shadowBlur = 15;
            ctx.shadowColor = accentColor;
            ctx.fillRect(x, centerY - barHeight, barWidth, barHeight);
            
            // Bottom bar (mirrored)
            ctx.fillRect(x, centerY, barWidth, barHeight);
        }
        
        ctx.shadowBlur = 0;
        requestAnimationFrame(animate);
    }
    
    animate();
    Spicetify.showNotification("🎵 Audio Visualizer Loaded!");
})();
