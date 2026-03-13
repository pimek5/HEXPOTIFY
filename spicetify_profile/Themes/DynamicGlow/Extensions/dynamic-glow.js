/* DynamicGlow Theme - Połączenie DefaultDynamic i Glowify
 * Autor: Custom Theme
 * Wersja: 1.0.0
 */

let current = "1.0.0";

// ===== UTILITY FUNCTIONS FROM DEFAULTDYNAMIC =====
function waitForElement(els, func, timeout = 100) {
    const queries = els.map((el) => document.querySelector(el));
    if (queries.every((a) => a)) {
        func(queries);
    } else if (timeout > 0) {
        setTimeout(waitForElement, 300, els, func, --timeout);
    }
}

function getAlbumInfo(id) {
    return Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${id}`);
}

function getEpisodeInfo(id) {
    return Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/episodes/${id}`);
}

function isLight(hex) {
    var [r, g, b] = hexToRgb(hex).map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
}

function hexToRgb(hex) {
    var bigint = parseInt(hex.replace("#", ""), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return [r, g, b];
}

function rgbToHex([r, g, b]) {
    const rgb = (r << 16) | (g << 8) | (b << 0);
    return "#" + (0x1000000 + rgb).toString(16).slice(1);
}

function lightenDarkenColor(h, p) {
    return (
        "#" +
        [1, 3, 5]
            .map((s) => parseInt(h.substr(s, 2), 16))
            .map((c) => parseInt((c * (100 + p)) / 100))
            .map((c) => (c < 255 ? c : 255))
            .map((c) => c.toString(16).padStart(2, "0"))
            .join("")
    );
}

function rgbToHsl([r, g, b]) {
    ((r /= 255), (g /= 255), (b /= 255));
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function hslToRgb([h, s, l]) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l;
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [r * 255, g * 255, b * 255];
}

function setLightness(hex, lightness) {
    hsl = rgbToHsl(hexToRgb(hex));
    hsl[2] = lightness;
    return rgbToHex(hslToRgb(hsl));
}

let textColor = "#1db954";
let textColorBg = getComputedStyle(document.documentElement).getPropertyValue("--spice-main");
let settingsDark = getComputedStyle(document.documentElement).getPropertyValue("--spice-dark") == "#010101";
const ACCENT_COOLDOWN_MS = 1500;
let lastAccentUpdateAt = 0;
let lastAccentValue = null;
let pendingAccentValue = null;
let accentUpdateTimer = null;
let lastColorKey = null;

function setRootColor(name, colHex) {
    let root = document.documentElement;
    if (root === null) return;
    root.style.setProperty("--spice-" + name, colHex);
    root.style.setProperty("--spice-rgb-" + name, hexToRgb(colHex).join(","));
}

function setGlowAccent(color) {
    if (!color) return;
    const normalized = color.trim().toLowerCase();
    if (normalized === lastAccentValue) return;

    let rgb = null;
    if (normalized.startsWith("rgb")) {
        const match = normalized.match(/\d+/g);
        if (match && match.length >= 3) {
            rgb = match.slice(0, 3).map(Number);
        }
    } else if (normalized.startsWith("#")) {
        rgb = hexToRgb(normalized);
    }

    const now = Date.now();
    const elapsed = now - lastAccentUpdateAt;
    if (elapsed < ACCENT_COOLDOWN_MS) {
        pendingAccentValue = color;
        if (!accentUpdateTimer) {
            accentUpdateTimer = setTimeout(() => {
                accentUpdateTimer = null;
                const next = pendingAccentValue;
                pendingAccentValue = null;
                if (next) setGlowAccent(next);
            }, ACCENT_COOLDOWN_MS - elapsed);
        }
        return;
    }

    lastAccentUpdateAt = now;
    lastAccentValue = normalized;
    document.documentElement.style.setProperty("--accent-color", color);
    document.documentElement.style.setProperty("--glowify-glow-accent", color);
    document.documentElement.style.setProperty("--extracted-color", color);
    if (rgb) {
        document.documentElement.style.setProperty("--extracted-color-rgb", rgb.join(","));
    }
}

function toggleDark(setDark) {
    if (setDark === undefined) setDark = isLight(textColorBg);

    document.documentElement.style.setProperty("--is_light", setDark ? 0 : 1);
    textColorBg = setDark ? "#0A0A0A" : "#FAFAFA";

    setRootColor("main", textColorBg);
    setRootColor("sidebar", textColorBg);
    setRootColor("player", textColorBg);
    setRootColor("shadow", textColorBg);
    setRootColor("card", setDark ? "#040404" : "#ECECEC");
    setRootColor("subtext", setDark ? "#EAEAEA" : "#3D3D3D");
    setRootColor("selected-row", setDark ? "#EAEAEA" : "#3D3D3D");
    setRootColor("main-elevated", setDark ? "#303030" : "#DDDDDD");
    setRootColor("notification", setDark ? "#303030" : "#DDDDDD");
    setRootColor("highlight-elevated", setDark ? "#303030" : "#DDDDDD");

    updateColors(textColor);
}

toggleDark(settingsDark);

Spicetify.Config = new Proxy(Spicetify.Config, {
    set(target, property, value) {
        if (property === "color_scheme") {
            setTimeout(() => {
                let dark = getComputedStyle(document.documentElement).getPropertyValue("--spice-dark").trim() === "#010101";
                toggleDark(dark);
            }, 100);
        }
        target[property] = value;
        return true;
    }
});

// Add light/dark toggle button
waitForElement([".main-actionButtons"], (queries) => {
    const buttonContainer = queries[0];

    const button = document.createElement("button");
    Array.from(buttonContainer.firstChild.attributes).forEach((attr) => {
        button.setAttribute(attr.name, attr.value);
    });
    button.id = "main-topBar-moon-button";
    button.className = buttonContainer.firstChild.className;
    button.onclick = () => {
        toggleDark();
    };
    button.innerHTML = `<svg role="img" viewBox="0 0 16 16" height="16" width="16"><path fill="currentColor" d="M9.598 1.591a.75.75 0 01.785-.175 7 7 0 11-8.967 8.967.75.75 0 01.961-.96 5.5 5.5 0 007.046-7.046.75.75 0 01.175-.786zm1.616 1.945a7 7 0 01-7.678 7.678 5.5 5.5 0 107.678-7.678z"></path></svg>`;

    const tooltip = Spicetify.Tippy(button, {
        ...Spicetify.TippyProps,
        content: "Light/Dark"
    });

    buttonContainer.insertBefore(button, buttonContainer.firstChild);
});

function updateColors(textColHex) {
    if (textColHex == undefined) return;

    let isLightBg = isLight(textColorBg);
    if (isLightBg)
        textColHex = lightenDarkenColor(textColHex, -15);
    else textColHex = setLightness(textColHex, 0.45);

    const colorKey = `${textColHex}|${textColorBg}`;
    if (colorKey === lastColorKey) return;
    lastColorKey = colorKey;

    let darkColHex = lightenDarkenColor(textColHex, isLightBg ? 12 : -20);
    let darkerColHex = lightenDarkenColor(textColHex, isLightBg ? 30 : -40);
    let softHighlightHex = setLightness(textColHex, isLightBg ? 0.9 : 0.14);
    setRootColor("text", textColHex);
    setRootColor("button", darkerColHex);
    setRootColor("button-active", darkColHex);
    setRootColor("tab-active", softHighlightHex);
    setRootColor("button-disabled", softHighlightHex);
    let softerHighlightHex = setLightness(textColHex, isLightBg ? 0.9 : 0.1);
    setRootColor("highlight", softerHighlightHex);

    // Set accent-color for Glowify glow effects
    setGlowAccent(textColHex);

    let rgb = hexToRgb(textColHex);
    let m = `url('data:image/svg+xml;utf8,
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter id="recolor" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="
            0 0 0 0 ${rgb[0] / 255}
            0 0 0 0 ${rgb[1] / 255}
            0 0 0 0 ${rgb[2] / 255}
            0 0 0 1 0
          "/>
        </filter>
      </svg>
      #recolor')`;
    document.documentElement.style.setProperty("--colormatrix", encodeURI(m));
}

let nearArtistSpanText = "";
async function songchange() {
    if (!document.querySelector(".main-trackInfo-container")) return setTimeout(songchange, 300);
    
    try {
        if (Spicetify.Platform.PlatformData.client_version_triple < "1.1.68") {
            Spicetify.showNotification(`Twoja wersja Spotify ${Spicetify.Platform.PlatformData.client_version_triple}) nie jest wspierana`);
        }
    } catch (err) {
        console.error(err);
    }

    let album_uri = Spicetify.Player.data.item.metadata.album_uri;
    let bgImage = Spicetify.Player.data.item.metadata.image_url;
    
    if (!bgImage) {
        bgImage = "https://cdn.jsdelivr.net/gh/JulienMaille/spicetify-dynamic-theme@main/images/tracklist-row-song-fallback.svg";
        textColor = "#1db954";
        updateColors(textColor);
    }

    if (album_uri && !album_uri.includes("spotify:show")) {
        const albumInfo = await getAlbumInfo(album_uri.replace("spotify:album:", ""));
        let album_date = new Date(albumInfo.release_date);
        let recent_date = new Date();
        recent_date.setMonth(recent_date.getMonth() - 6);
        album_date = album_date.toLocaleString("default", album_date > recent_date ? { year: "numeric", month: "short" } : { year: "numeric" });
        nearArtistSpanText = `
            <span>
                <span draggable="true">
                    <a draggable="false" dir="auto" href="${album_uri}">${Spicetify.Player.data.item.metadata.album_title}</a>
                </span>
            </span>
            <span> • ${album_date}</span>
        `;
    } else if (Spicetify.Player.data.item.type === "episode") {
        const episodeInfo = await getEpisodeInfo(Spicetify.Player.data.item.uri.replace("spotify:episode:", ""));
        let podcast_date = new Date(episodeInfo.release_date);
        podcast_date = podcast_date.toLocaleString("default", { year: "numeric", month: "short" });
        bgImage = bgImage.replace("spotify:image:", "https://i.scdn.co/image/");
        nearArtistSpanText = `
            <span>
                <span draggable="true">
                    <a draggable="false" dir="auto" href="${album_uri}">${Spicetify.Player.data.item.metadata["show.publisher"]}</a>
                </span>
            </span>
            <span> • ${podcast_date}</span>
        `;
    } else if (Spicetify.Player.data.item.isLocal) {
        nearArtistSpanText = Spicetify.Player.data.item.metadata.album_title;
    } else if (Spicetify.Player.data.item.provider == "ad") {
        nearArtistSpanText.innerHTML = "Reklama";
        return;
    } else {
        setTimeout(songchange, 200);
    }

    if (!document.querySelector("#main-trackInfo-year")) {
        waitForElement([".main-trackInfo-container:not(#upcomingSongDiv)"], (queries) => {
            nearArtistSpan = document.createElement("div");
            nearArtistSpan.id = "main-trackInfo-year";
            nearArtistSpan.classList.add("main-trackInfo-release", "standalone-ellipsis-one-line", "main-type-finale");
            nearArtistSpan.innerHTML = nearArtistSpanText;
            queries[0].append(nearArtistSpan);
        });
    } else {
        nearArtistSpan.innerHTML = nearArtistSpanText;
    }
    
    document.documentElement.style.setProperty("--image_url", `url("${bgImage}")`);
    
    // Trigger Glowify background update
    window.dispatchEvent(new CustomEvent("glowifyBackgroundChange", { detail: { coverUrl: bgImage } }));
    
    pickCoverColor();
}

function getVibrant(image) {
    try {
        var swatches = new Vibrant(image, 12).swatches();
        cols = isLight(textColorBg) ? ["Vibrant", "DarkVibrant", "Muted", "LightVibrant"] : ["Vibrant", "LightVibrant", "Muted", "DarkVibrant"];
        for (var col in cols)
            if (swatches[cols[col]]) {
                textColor = swatches[cols[col]].getHex();
                break;
            }
    } catch (err) {
        console.error(err);
    }
}

function pickCoverColor() {
    const img = document.querySelector(".main-image-image.cover-art-image");
    if (!img) return setTimeout(pickCoverColor, 250);

    if (Spicetify.Player.data.item.isLocal) img.src = Spicetify.Player.data.item.metadata.image_url;
    if (!img.complete) return setTimeout(pickCoverColor, 250);

    textColor = "#1db954";
    if (Spicetify.Platform.PlatformData.client_version_triple >= "1.2.48" && img.src.startsWith("https://i.scdn.co/image")) {
        var imgCORS = new Image();
        imgCORS.crossOrigin = "anonymous";
        imgCORS.src = Spicetify.Player.data.item.metadata.image_url.replace("spotify:image:", "https://i.scdn.co/image/");

        imgCORS.onload = function () {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imgCORS, 0, 0);

            getVibrant(imgCORS);
            imgCORS = null;
            updateColors(textColor);
        };
        return;
    } else {
        if (!img.src.startsWith("spotify:")) return;
    }

    if (img.complete) getVibrant(img);
    updateColors(textColor);
}

Spicetify.Player.addEventListener("songchange", songchange);
songchange();

// ===== GLOWIFY BACKGROUND THEME INTEGRATION =====
(async function () {
    while (!Spicetify?.Player || !Spicetify?.Player?.data) {
        await new Promise((r) => setTimeout(r, 300));
    }

    const root = document.querySelector(".Root__top-container");
    if (!root) return;

    const layerA = document.createElement("div");
    const layerB = document.createElement("div");
    layerA.classList.add("glowify-bg-layer", "layer-a");
    layerB.classList.add("glowify-bg-layer", "layer-b");
    root.prepend(layerA, layerB);

    let useA = true;
    let lastCoverUrl = null;
    const BG_UPDATE_COOLDOWN_MS = 2000;
    let lastBgUpdateAt = 0;
    let pendingCoverUrl = null;
    let bgUpdateTimer = null;
    let bgUpdateInFlight = false;

    function getCoverUrl() {
        const meta = Spicetify.Player.data?.item?.metadata;
        if (!meta) return null;
        return meta.image_xlarge_url || meta.image_large_url || meta.image_url || null;
    }

    function enhanceColor(rgb, saturationBoost = 2.2, lightnessBoost = 1.3) {
        const [r, g, b] = rgb.match(/\d+/g).map(Number);
        let r1 = r / 255, g1 = g / 255, b1 = b / 255;
        const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
                case g1: h = (b1 - r1) / d + 2; break;
                case b1: h = (r1 - g1) / d + 4; break;
            }
            h /= 6;
        }

        s = Math.min(s * saturationBoost, 1);
        l = Math.min(l * lightnessBoost, 1);

        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h * 6) % 2 - 1));
        let m = l - c / 2;
        let r2, g2, b2;

        if (h < 1 / 6) [r2, g2, b2] = [c, x, 0];
        else if (h < 2 / 6) [r2, g2, b2] = [x, c, 0];
        else if (h < 3 / 6) [r2, g2, b2] = [0, c, x];
        else if (h < 4 / 6) [r2, g2, b2] = [0, x, c];
        else if (h < 5 / 6) [r2, g2, b2] = [x, 0, c];
        else [r2, g2, b2] = [c, 0, x];

        return `rgb(${Math.round((r2 + m) * 255)},${Math.round((g2 + m) * 255)},${Math.round((b2 + m) * 255)})`;
    }

    function getDominantColor(url) {
        return new Promise((resolve) => {
            if (!url) return resolve("rgb(30,215,96)");
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const data = ctx.getImageData(0, 0, img.width, img.height).data;
                let r = 0, g = 0, b = 0, count = 0;
                // Skip bardzo ciemne i bardzo jasne piksele dla lepszego koloru
                for (let i = 0; i < data.length; i += 4) {
                    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    if (brightness > 30 && brightness < 225) {
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                        count++;
                    }
                }
                if (!count) return resolve("rgb(30,215,96)");
                resolve(`rgb(${Math.round(r / count)},${Math.round(g / count)},${Math.round(b / count)})`);
            };
            img.onerror = () => resolve("rgb(30,215,96)");
        });
    }

    async function updateBackgroundAndAccent(forcedUrl) {
        const coverUrl = forcedUrl || getCoverUrl();
        if (!coverUrl) return;
        if (coverUrl === lastCoverUrl) return;

        const now = Date.now();
        const elapsed = now - lastBgUpdateAt;
        if (bgUpdateInFlight) {
            pendingCoverUrl = coverUrl;
            return;
        }
        if (elapsed < BG_UPDATE_COOLDOWN_MS) {
            pendingCoverUrl = coverUrl;
            if (!bgUpdateTimer) {
                bgUpdateTimer = setTimeout(() => {
                    bgUpdateTimer = null;
                    const next = pendingCoverUrl;
                    pendingCoverUrl = null;
                    if (next) updateBackgroundAndAccent(next);
                }, BG_UPDATE_COOLDOWN_MS - elapsed);
            }
            return;
        }

        bgUpdateInFlight = true;
        try {
            lastCoverUrl = coverUrl;

            const targetLayer = useA ? layerA : layerB;
            const otherLayer = useA ? layerB : layerA;

            targetLayer.style.backgroundImage = `url("${coverUrl}")`;
            targetLayer.classList.add("active");
            otherLayer.classList.remove("active");

            const dominantRgb = await getDominantColor(coverUrl);
            const accentColor = enhanceColor(dominantRgb);
            setGlowAccent(accentColor);

            useA = !useA;
        } finally {
            bgUpdateInFlight = false;
            lastBgUpdateAt = Date.now();
            if (pendingCoverUrl && pendingCoverUrl !== lastCoverUrl) {
                const next = pendingCoverUrl;
                pendingCoverUrl = null;
                updateBackgroundAndAccent(next);
            }
        }
    }

    updateBackgroundAndAccent();
    Spicetify.Player.addEventListener("songchange", () => {
        console.log("[DynamicGlow] Song changed, updating background...");
        updateBackgroundAndAccent();
    });
    window.addEventListener("glowifyBackgroundChange", () => {
        console.log("[DynamicGlow] Manual background change triggered");
        updateBackgroundAndAccent();
    });
})();

// Force remove backgrounds from nowplaying widget
(function removeNowPlayingBackgrounds() {
    console.log("[DynamicGlow] Starting background removal...");
    
    // Override CSS variables globally on documentElement
    document.documentElement.style.setProperty('--background-base', 'transparent', 'important');
    document.documentElement.style.setProperty('--background-elevated-base', 'transparent', 'important');
    document.documentElement.style.setProperty('--background-tinted-base', 'transparent', 'important');
    
    // Ultra aggressive CSS injection
    const style = document.createElement('style');
    style.id = 'dynamicglow-transparency';
    style.textContent = `
        /* Right sidebar - ALL possible selectors */
        .Root__top-container > :last-child,
        .Root__top-container > div:last-child,
        .Root__top-container > div:last-child *,
        [data-testid="now-playing-widget"],
        [data-testid="now-playing-widget"] *,
        .main-nowPlayingBar-container,
        .main-nowPlayingBar-container *,
        .main-nowPlayingView-nowPlayingWidget,
        .main-nowPlayingView-nowPlayingWidget *,
        .main-nowPlayingView-section,
        .main-nowPlayingView-section *,
        [class*="nowPlaying"],
        [class*="nowPlaying"] * {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            --background-base: transparent !important;
            --background-elevated-base: transparent !important;
            --background-tinted-base: transparent !important;
            --background-tinted-highlight: transparent !important;
            --background-tinted-press: transparent !important;
            --background-surface: transparent !important;
        }
    `;
    document.head.appendChild(style);
    console.log("[DynamicGlow] Background removal style injected");
    
    const forceTransparent = () => {
        // Target every possible container
        const selectors = [
            '.Root__top-container > div:last-child',
            '[data-testid="now-playing-widget"]',
            '.main-nowPlayingBar-container',
            '.main-nowPlayingView-nowPlayingWidget',
            '.main-nowPlayingView-section'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) {
                    el.style.cssText += 'background: transparent !important; background-color: transparent !important; background-image: none !important;';
                    // Force on all descendants
                    el.querySelectorAll('*').forEach(child => {
                        child.style.cssText += 'background: transparent !important; background-color: transparent !important;';
                    });
                }
            });
        });
        
        console.log("[DynamicGlow] Forced transparency on all containers");
    };
    
    // Run immediately and repeatedly
    setTimeout(forceTransparent, 50);
    setTimeout(forceTransparent, 100);
    setTimeout(forceTransparent, 500);
    setTimeout(forceTransparent, 1000);
    setTimeout(forceTransparent, 2000);
    setInterval(forceTransparent, 2000);
    
    // Also watch for DOM changes
    const observer = new MutationObserver(forceTransparent);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

// ===== PARTICLE EFFECTS =====
(function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.3;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let currentColor = '#ffffff';
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = currentColor;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Update particle color on song change
    Spicetify.Player.addEventListener("songchange", () => {
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--spice-text').trim();
        currentColor = accentColor || '#ffffff';
    });
})();

// ===== WAVE ANIMATION =====
(function initWaveAnimation() {
    const waveCanvas = document.createElement('canvas');
    waveCanvas.id = 'wave-canvas';
    waveCanvas.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 200px;
        pointer-events: none;
        z-index: 1;
        opacity: 0.15;
    `;
    document.body.appendChild(waveCanvas);
    
    const ctx = waveCanvas.getContext('2d');
    let waveColor = '#ffffff';
    let offset = 0;
    
    function resizeCanvas() {
        waveCanvas.width = window.innerWidth;
        waveCanvas.height = 200;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function drawWave() {
        ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
        
        ctx.beginPath();
        ctx.moveTo(0, waveCanvas.height / 2);
        
        for (let x = 0; x < waveCanvas.width; x++) {
            const y = Math.sin((x + offset) * 0.01) * 30 + 
                      Math.sin((x + offset) * 0.02) * 20 +
                      waveCanvas.height / 2;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(waveCanvas.width, waveCanvas.height);
        ctx.lineTo(0, waveCanvas.height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, 0, 0, waveCanvas.height);
        gradient.addColorStop(0, waveColor + '80');
        gradient.addColorStop(1, waveColor + '00');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        offset += 2;
        requestAnimationFrame(drawWave);
    }
    drawWave();
    
    // Update wave color on song change
    Spicetify.Player.addEventListener("songchange", () => {
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--spice-text').trim();
        waveColor = accentColor || '#ffffff';
    });
})();

// ===== AUDIO VISUALIZER =====
(function initAudioVisualizer() {
    const visualizerCanvas = document.createElement('canvas');
    visualizerCanvas.id = 'audio-visualizer';
    visualizerCanvas.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 800px;
        height: 150px;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.7;
    `;
    document.body.appendChild(visualizerCanvas);
    
    const ctx = visualizerCanvas.getContext('2d');
    const bars = 64;
    const barWidth = 800 / bars;
    let dataArray = new Array(bars).fill(0);
    let visualizerColor = '#ffffff';
    
    visualizerCanvas.width = 800;
    visualizerCanvas.height = 150;
    
    // Simulate audio data (since we can't access real audio)
    function generateFakeAudioData() {
        const isPlaying = !Spicetify.Player.data?.isPaused;
        
        for (let i = 0; i < bars; i++) {
            if (isPlaying) {
                // Create wave-like pattern
                const wave1 = Math.sin(Date.now() * 0.002 + i * 0.2) * 0.3;
                const wave2 = Math.sin(Date.now() * 0.003 + i * 0.15) * 0.2;
                const wave3 = Math.sin(Date.now() * 0.005 + i * 0.1) * 0.15;
                const randomness = Math.random() * 0.35;
                
                const target = (wave1 + wave2 + wave3 + randomness + 1) * 0.5;
                dataArray[i] += (target - dataArray[i]) * 0.2;
            } else {
                dataArray[i] *= 0.95; // Fade out when paused
            }
        }
    }
    
    function drawVisualizer() {
        ctx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
        
        generateFakeAudioData();
        
        for (let i = 0; i < bars; i++) {
            const barHeight = dataArray[i] * visualizerCanvas.height;
            const x = i * barWidth;
            const y = visualizerCanvas.height - barHeight;
            
            // Gradient for each bar
            const gradient = ctx.createLinearGradient(x, visualizerCanvas.height, x, y);
            gradient.addColorStop(0, visualizerColor + 'FF');
            gradient.addColorStop(0.5, visualizerColor + 'CC');
            gradient.addColorStop(1, visualizerColor + '66');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - 2, barHeight);
            
            // Glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = visualizerColor;
        }
        
        ctx.shadowBlur = 0;
        requestAnimationFrame(drawVisualizer);
    }
    drawVisualizer();
    
    // Update visualizer color on song change
    Spicetify.Player.addEventListener("songchange", () => {
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--spice-text').trim();
        visualizerColor = accentColor || '#ffffff';
    });
})();

// ===== PULSING EFFECTS =====
(function initPulsingEffects() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-glow {
            0%, 100% {
                box-shadow: 
                    0 0 20px 6px var(--glowify-glow-accent, var(--accent-color)),
                    0 0 40px 12px rgba(var(--spice-rgb-text), 0.15);
                transform: scale(1);
            }
            50% {
                box-shadow: 
                    0 0 30px 10px var(--glowify-glow-accent, var(--accent-color)),
                    0 0 60px 18px rgba(var(--spice-rgb-text), 0.25);
                transform: scale(1.02);
            }
        }
        
        @keyframes pulse-scale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes pulse-brightness {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.2); }
        }
        
        /* Pulse library containers when playing */
        body:not(.paused) .main-yourLibraryX-libraryContainer {
            animation: pulse-glow 3s ease-in-out infinite;
        }
        
        /* Pulse currently playing track */
        [aria-label*="playing"] .main-trackList-rowSectionVariable,
        .main-nowPlayingWidget-nowPlaying {
            animation: pulse-brightness 2s ease-in-out infinite;
        }
        
        /* Pulse play button */
        button[aria-label*="Play"],
        button[aria-label*="Pause"] {
            animation: pulse-scale 1.5s ease-in-out infinite;
        }
        
        /* Pulse card images on hover */
        .main-card-card:hover .main-cardImage-image {
            animation: pulse-scale 0.8s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Add/remove paused class based on playback state
    function updatePlaybackState() {
        const isPaused = Spicetify.Player.data?.isPaused;
        if (isPaused) {
            document.body.classList.add('paused');
        } else {
            document.body.classList.remove('paused');
        }
    }
    
    Spicetify.Player.addEventListener("onplaypause", updatePlaybackState);
    Spicetify.Player.addEventListener("songchange", updatePlaybackState);
    updatePlaybackState();
})();

// ===== PROGRESS BAR GLOW =====
(function initProgressBarGlow() {
    const style = document.createElement('style');
    style.textContent = `
        .playback-bar__progress-time-elapsed {
            background: linear-gradient(90deg, 
                var(--spice-text) 0%, 
                var(--glowify-glow-accent) 100%) !important;
            box-shadow: 
                0 0 10px 2px var(--glowify-glow-accent),
                0 0 20px 4px rgba(var(--spice-rgb-text), 0.3);
            filter: brightness(1.2);
        }
        
        .playback-progressbar__progress-bar {
            background: var(--glowify-glow-accent) !important;
        }
        
        .playback-progressbar__slider {
            background: var(--spice-text) !important;
            box-shadow: 0 0 15px 5px var(--glowify-glow-accent);
        }
    `;
    document.head.appendChild(style);
})();

// ===== VOLUME VISUALIZER =====
(function initVolumeVisualizer() {
    const style = document.createElement('style');
    style.textContent = `
        .volume-bar__slider-container::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            width: var(--volume-percentage, 50%);
            height: 4px;
            background: linear-gradient(90deg, 
                var(--glowify-glow-accent) 0%, 
                var(--spice-text) 100%);
            box-shadow: 0 0 8px 2px var(--glowify-glow-accent);
            transform: translateY(-50%);
            pointer-events: none;
            border-radius: 2px;
            z-index: 1;
        }
        
        .volume-bar__slider {
            background: var(--spice-text) !important;
            box-shadow: 0 0 10px 3px var(--glowify-glow-accent) !important;
        }
    `;
    document.head.appendChild(style);
    
    function updateVolumeVisual() {
        const volume = Spicetify.Player.getVolume();
        document.documentElement.style.setProperty('--volume-percentage', `${volume * 100}%`);
    }
    
    Spicetify.Player.addEventListener("onplaypause", updateVolumeVisual);
    setInterval(updateVolumeVisual, 100);
})();

// ===== SHUFFLE/REPEAT ANIMATION =====
(function initControlsAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin-shuffle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
        }
        
        @keyframes bounce-repeat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
        
        button[aria-label*="shuffle" i][aria-checked="true"] svg,
        button[aria-label*="Losowo" i][aria-checked="true"] svg {
            animation: spin-shuffle 2s ease-in-out infinite;
            filter: drop-shadow(0 0 8px var(--glowify-glow-accent));
        }
        
        button[aria-label*="repeat" i][aria-checked="true"] svg,
        button[aria-label*="Powtarzaj" i][aria-checked="true"] svg {
            animation: bounce-repeat 1.5s ease-in-out infinite;
            filter: drop-shadow(0 0 8px var(--glowify-glow-accent));
        }
    `;
    document.head.appendChild(style);
})();

// ===== LIKED SONGS COUNTER =====
(function initLikedSongsCounter() {
    let likedCount = 0;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes heart-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        .main-trackList-rowHeartButton[aria-checked="true"] svg {
            animation: heart-pulse 0.5s ease-in-out;
            filter: drop-shadow(0 0 10px var(--glowify-glow-accent));
        }
        
        .liked-counter {
            position: fixed;
            top: 16px;
            right: 200px;
            background: rgba(var(--spice-rgb-text), 0.1);
            backdrop-filter: blur(20px);
            padding: 8px 16px;
            border-radius: 20px;
            color: var(--spice-text);
            font-weight: bold;
            box-shadow: 0 0 15px 3px var(--glowify-glow-accent);
            z-index: 9999;
            transition: all 0.3s ease;
        }
        
        .liked-counter:hover {
            transform: scale(1.05);
            box-shadow: 0 0 25px 5px var(--glowify-glow-accent);
        }
    `;
    document.head.appendChild(style);
    
    async function updateLikedCount() {
        try {
            const response = await Spicetify.CosmosAsync.get('sp://core-playlist/v1/rootlist');
            const likedSongs = response.items?.find(item => item.type === 'collection');
            if (likedSongs) {
                likedCount = likedSongs.totalLength || 0;
            }
        } catch (e) {
            console.log('[DynamicGlow] Could not fetch liked songs count');
        }
    }
    
    function createCounter() {
        console.log('[DynamicGlow] Creating liked counter...');
        
        // Remove old counter if exists
        const oldCounter = document.querySelector('.liked-counter');
        if (oldCounter) oldCounter.remove();
        
        const counter = document.createElement('div');
        counter.className = 'liked-counter';
        counter.innerHTML = `❤️ ${likedCount}`;
        document.body.appendChild(counter);
        
        console.log('[DynamicGlow] Liked counter created!', likedCount);
        
        setInterval(() => {
            counter.innerHTML = `❤️ ${likedCount}`;
        }, 1000);
    }
    
    updateLikedCount();
    setTimeout(createCounter, 2000);
    setTimeout(createCounter, 4000);
    Spicetify.Player.addEventListener("songchange", updateLikedCount);
})();

// ===== SPOTIFY WEB API - TRACK FEATURES =====
(function initTrackFeatures() {
    let currentTrackFeatures = null;
    
    async function getTrackFeatures(trackId) {
        try {
            const features = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/audio-features/${trackId}`);
            return features;
        } catch (e) {
            console.log('[DynamicGlow] Could not fetch track features');
            return null;
        }
    }
    
    function createFeaturesDisplay() {
        const style = document.createElement('style');
        style.textContent = `
            .track-features {
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: rgba(var(--spice-rgb-text), 0.1);
                backdrop-filter: blur(25px);
                padding: 12px 20px;
                border-radius: 15px;
                color: var(--spice-text);
                font-size: 12px;
                box-shadow: 0 0 20px 5px var(--glowify-glow-accent);
                z-index: 9999;
                min-width: 150px;
            }
            
            .track-features .feature-item {
                display: flex;
                justify-content: space-between;
                margin: 4px 0;
                padding: 4px 0;
                border-bottom: 1px solid rgba(var(--spice-rgb-text), 0.2);
            }
            
            .track-features .feature-label {
                opacity: 0.7;
            }
            
            .track-features .feature-value {
                font-weight: bold;
                text-shadow: 0 0 8px var(--glowify-glow-accent);
            }
        `;
        document.head.appendChild(style);
        
        const container = document.createElement('div');
        container.className = 'track-features';
        container.style.display = 'none';
        document.body.appendChild(container);
        
        return container;
    }
    
    const featuresDisplay = createFeaturesDisplay();
    
    async function updateTrackFeatures() {
        console.log('[DynamicGlow] Fetching track features...');
        const currentTrack = Spicetify.Player.data?.item;
        if (!currentTrack?.uri) {
            console.log('[DynamicGlow] No current track');
            return;
        }
        
        const trackId = currentTrack.uri.split(':')[2];
        console.log('[DynamicGlow] Track ID:', trackId);
        const features = await getTrackFeatures(trackId);
        
        if (features) {
            console.log('[DynamicGlow] Track features:', features);
            currentTrackFeatures = features;
            const bpm = Math.round(features.tempo);
            const energy = Math.round(features.energy * 100);
            const danceability = Math.round(features.danceability * 100);
            const valence = Math.round(features.valence * 100);
            
            featuresDisplay.innerHTML = `
                <div class="feature-item">
                    <span class="feature-label">BPM:</span>
                    <span class="feature-value">${bpm}</span>
                </div>
                <div class="feature-item">
                    <span class="feature-label">Energy:</span>
                    <span class="feature-value">${energy}%</span>
                </div>
                <div class="feature-item">
                    <span class="feature-label">Dance:</span>
                    <span class="feature-value">${danceability}%</span>
                </div>
                <div class="feature-item">
                    <span class="feature-label">Mood:</span>
                    <span class="feature-value">${valence}%</span>
                </div>
            `;
            featuresDisplay.style.display = 'block';
            console.log('[DynamicGlow] Track features displayed!');
        }
    }
    
    Spicetify.Player.addEventListener("songchange", updateTrackFeatures);
    setTimeout(updateTrackFeatures, 3000);
    setTimeout(updateTrackFeatures, 5000);
})();

// ===== BEAT DETECTION & WAVEFORM =====
(function initBeatDetection() {
    // Simulated beat detection based on BPM
    let beatInterval = null;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes beat-pulse {
            0%, 100% { 
                transform: scale(1);
                box-shadow: 0 0 20px 6px var(--glowify-glow-accent);
            }
            50% { 
                transform: scale(1.03);
                box-shadow: 0 0 40px 12px var(--glowify-glow-accent);
            }
        }
        
        body.beat-active .main-nowPlayingBar-container {
            animation: beat-pulse 0.15s ease-out;
        }
    `;
    document.head.appendChild(style);
    
    function triggerBeat() {
        document.body.classList.add('beat-active');
        setTimeout(() => {
            document.body.classList.remove('beat-active');
        }, 150);
    }
    
    function startBeatDetection(bpm = 120) {
        if (beatInterval) clearInterval(beatInterval);
        const interval = (60 / bpm) * 1000;
        beatInterval = setInterval(triggerBeat, interval);
    }
    
    Spicetify.Player.addEventListener("songchange", () => {
        // Default BPM, will be updated by track features
        startBeatDetection(120);
    });
})();

// ===== ADVANCED COLOR PALETTE =====
(function initAdvancedColorPalette() {
    async function getAdvancedColors(imageUrl) {
        try {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imageUrl;
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            
            // Extract multiple colors
            const colors = [];
            const step = 4 * Math.floor(pixels.length / (4 * 10));
            
            for (let i = 0; i < pixels.length; i += step) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const brightness = (r + g + b) / 3;
                
                if (brightness > 30 && brightness < 225) {
                    colors.push({ r, g, b, brightness });
                }
            }
            
            // Sort by brightness and saturation
            colors.sort((a, b) => {
                const satA = Math.max(a.r, a.g, a.b) - Math.min(a.r, a.g, a.b);
                const satB = Math.max(b.r, b.g, b.b) - Math.min(b.r, b.g, b.b);
                return satB - satA;
            });
            
            return colors.slice(0, 5);
        } catch (e) {
            console.log('[DynamicGlow] Advanced color extraction failed');
            return null;
        }
    }
    
    Spicetify.Player.addEventListener("songchange", async () => {
        const currentTrack = Spicetify.Player.data?.item;
        if (currentTrack?.metadata?.image_xlarge_url) {
            const colors = await getAdvancedColors(currentTrack.metadata.image_xlarge_url);
            if (colors && colors.length > 0) {
                const primary = colors[0];
                const secondary = colors[1] || colors[0];
                
                document.documentElement.style.setProperty('--color-primary', 
                    `rgb(${primary.r}, ${primary.g}, ${primary.b})`);
                document.documentElement.style.setProperty('--color-secondary', 
                    `rgb(${secondary.r}, ${secondary.g}, ${secondary.b})`);
            }
        }
    });
})();

// ===== HIDE DEFAULT PLAYLISTS & FOLDERS =====
(function hideDefaultPlaylists() {
    const style = document.createElement('style');
    style.textContent = `
        /* Hide Liked Songs */
        a[href="/collection/tracks"],
        a[aria-label*="Liked" i],
        a[aria-label*="Polubione" i] {
            display: none !important;
        }
        
        /* Hide default folders and playlists */
        [data-testid="rootlist-item"]:has(a[href="/collection/tracks"]),
        [data-testid="rootlist-item"]:has([data-testid="your-episodes-folder"]),
        [data-testid="rootlist-item"]:has([aria-label*="Episodes" i]),
        [data-testid="rootlist-item"]:has([aria-label*="Odcinki" i]) {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();

// ===== THEME SETTINGS BUTTON =====
(function initThemeSettings() {
    const style = document.createElement('style');
    style.textContent = `
        .theme-settings-button {
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(var(--spice-rgb-text), 0.1);
            backdrop-filter: blur(20px);
            border: 2px solid var(--spice-text);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 0 15px 3px var(--glowify-glow-accent);
        }
        
        .theme-settings-button:hover {
            transform: scale(1.1) rotate(90deg);
            box-shadow: 0 0 25px 5px var(--glowify-glow-accent);
        }
        
        .theme-settings-button svg {
            width: 18px;
            height: 18px;
            fill: var(--spice-text);
        }
        
        .theme-settings-panel {
            position: fixed;
            top: 60px;
            right: 20px;
            width: 300px;
            max-height: 500px;
            background: rgba(var(--spice-rgb-main), 0.95);
            backdrop-filter: blur(30px);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 0 30px 10px var(--glowify-glow-accent);
            z-index: 10000;
            display: none;
            overflow-y: auto;
        }
        
        .theme-settings-panel.visible {
            display: block;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .theme-settings-panel h2 {
            color: var(--spice-text);
            margin: 0 0 16px 0;
            font-size: 18px;
            text-shadow: 0 0 10px var(--glowify-glow-accent);
        }
        
        .theme-setting-item {
            margin: 12px 0;
            padding: 12px;
            background: rgba(var(--spice-rgb-text), 0.05);
            border-radius: 8px;
            border: 1px solid rgba(var(--spice-rgb-text), 0.2);
        }
        
        .theme-setting-item label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--spice-text);
            font-size: 14px;
            cursor: pointer;
        }
        
        .theme-setting-item input[type="checkbox"] {
            width: 40px;
            height: 20px;
            appearance: none;
            background: rgba(var(--spice-rgb-text), 0.2);
            border-radius: 10px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .theme-setting-item input[type="checkbox"]:checked {
            background: var(--glowify-glow-accent);
        }
        
        .theme-setting-item input[type="checkbox"]::before {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            top: 2px;
            left: 2px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .theme-setting-item input[type="checkbox"]:checked::before {
            left: 22px;
        }
    `;
    document.head.appendChild(style);
    
    function createSettingsButton() {
        console.log('[DynamicGlow] Attempting to create settings button...');
        
        // Try multiple selectors
        let topBar = document.querySelector('.main-topBar-topbarContentWrapper');
        if (!topBar) {
            topBar = document.querySelector('.main-topBar-container');
        }
        if (!topBar) {
            topBar = document.querySelector('[data-testid="topbar-content-wrapper"]');
        }
        if (!topBar) {
            topBar = document.querySelector('.Root__top-bar');
        }
        
        if (!topBar) {
            console.log('[DynamicGlow] TopBar not found, retrying...');
            setTimeout(createSettingsButton, 1000);
            return;
        }
        
        console.log('[DynamicGlow] TopBar found!', topBar);
        
        // Check if button already exists
        if (document.querySelector('.theme-settings-button')) {
            console.log('[DynamicGlow] Settings button already exists');
            return;
        }
        
        const button = document.createElement('button');
        button.className = 'theme-settings-button';
        button.title = 'DynamicGlow Settings';
        button.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
            </svg>
        `;
        
        const panel = document.createElement('div');
        panel.className = 'theme-settings-panel';
        panel.innerHTML = `
            <h2>🎨 DynamicGlow Settings</h2>
            
            <div class="theme-setting-item">
                <label>
                    <span>Particles</span>
                    <input type="checkbox" id="toggle-particles" checked>
                </label>
            </div>
            
            <div class="theme-setting-item">
                <label>
                    <span>Wave Animation</span>
                    <input type="checkbox" id="toggle-wave" checked>
                </label>
            </div>
            
            <div class="theme-setting-item">
                <label>
                    <span>Audio Visualizer</span>
                    <input type="checkbox" id="toggle-visualizer" checked>
                </label>
            </div>
            
            <div class="theme-setting-item">
                <label>
                    <span>Pulsing Effects</span>
                    <input type="checkbox" id="toggle-pulsing" checked>
                </label>
            </div>
            
            <div class="theme-setting-item">
                <label>
                    <span>Track Features</span>
                    <input type="checkbox" id="toggle-features" checked>
                </label>
            </div>
            
            <div class="theme-setting-item">
                <label>
                    <span>Liked Counter</span>
                    <input type="checkbox" id="toggle-counter" checked>
                </label>
            </div>
        `;
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('visible');
        });
        
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== button) {
                panel.classList.remove('visible');
            }
        });
        
        // Toggle functionality
        panel.querySelector('#toggle-particles').addEventListener('change', (e) => {
            const canvas = document.getElementById('particle-canvas');
            if (canvas) canvas.style.display = e.target.checked ? 'block' : 'none';
        });
        
        panel.querySelector('#toggle-wave').addEventListener('change', (e) => {
            const canvas = document.getElementById('wave-canvas');
            if (canvas) canvas.style.display = e.target.checked ? 'block' : 'none';
        });
        
        panel.querySelector('#toggle-visualizer').addEventListener('change', (e) => {
            const canvas = document.getElementById('audio-visualizer');
            if (canvas) canvas.style.display = e.target.checked ? 'block' : 'none';
        });
        
        panel.querySelector('#toggle-features').addEventListener('change', (e) => {
            const features = document.querySelector('.track-features');
            if (features) features.style.display = e.target.checked ? 'block' : 'none';
        });
        
        panel.querySelector('#toggle-counter').addEventListener('change', (e) => {
            const counter = document.querySelector('.liked-counter');
            if (counter) counter.style.display = e.target.checked ? 'block' : 'none';
        });
        
        topBar.insertBefore(button, topBar.firstChild);
        document.body.appendChild(panel);
        
        console.log('[DynamicGlow] Settings button created successfully!');
    }
    
    // Try multiple times to ensure it's added
    setTimeout(createSettingsButton, 2000);
    setTimeout(createSettingsButton, 4000);
    setTimeout(createSettingsButton, 6000);
})();

// Startup notification
(function Startup() {
    if (!Spicetify.showNotification) {
        setTimeout(Startup, 300);
        return;
    }
    Spicetify.showNotification("Zastosowano motyw " + (settingsDark ? "ciemny" : "jasny") + " DynamicGlow.");
})();

document.documentElement.style.setProperty("--warning_message", " ");
