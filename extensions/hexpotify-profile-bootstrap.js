// HEXpotify profile bootstrap
// Applies a deterministic profile in localStorage so users get a near 1:1 setup.
(async function hexpotifyProfileBootstrap() {
    const PROFILE_VERSION = "hexpotify-profile-v1";

    while (!window.Spicetify?.showNotification) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const lastApplied = localStorage.getItem("hexpotify:profileVersion");
    if (lastApplied === PROFILE_VERSION) return;

    const dynamicGlowConfig = {
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
        enableAlbumMetadata: true,
        enableEpisodeMetadata: true,
        enableMatchYourTaste: true,
        enableTrackFeatures: true,
        enableSidebarCovers: true,
        enableListPlaylistsWithSong: true,
        superVizOpacity: 0.94,
        superVizSaturation: 1.55,
        superVizContrast: 1.12,
        superVizBrightness: 1.08,
        superVizBloomBoost: 1.0,
        superVizSourceLockMs: 1200,
        superVizLowEnergyReconnectMs: 2500,
    };

    const dynamicGlowFlags = {
        enableMatchYourTaste: true,
        enableListPlaylistsWithSong: true,
    };

    const hexpotifySettings = {
        lyricsPlusEnabled: true,
        visualizerEnabled: true,
        sessionHudEnabled: true,
        autoScrollLyrics: true,
    };

    try {
        localStorage.setItem("dynamicglow-config", JSON.stringify(dynamicGlowConfig));
        localStorage.setItem("dynamicglow:config", JSON.stringify(dynamicGlowFlags));
        localStorage.setItem("super-spotify-8910:settings:v1", JSON.stringify(hexpotifySettings));
        localStorage.setItem("hexpotify:profileVersion", PROFILE_VERSION);
        Spicetify.showNotification("HEXpotify profile applied");
    } catch (err) {
        console.warn("[HEXpotify profile] Failed to apply profile", err);
    }
})();
