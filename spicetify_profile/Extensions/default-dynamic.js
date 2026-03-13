let current = "5.7";

// Cache for album/episode info to prevent rate limiting
const infoCache = new Map();
const CACHE_TTL = 1800000; // 30 minutes
let lastRequestTime = 0;
const REQUEST_DELAY = 10000; // 10 seconds between requests - aggressive rate limiting
let consecutiveErrors = 0;
const MAX_RETRIES = 3;

// API Settings (controlled by config menu)
let apiSettings = {
    enableAlbumMetadata: true,  // Enabled - other endpoints handle rate limits better
    enableEpisodeMetadata: true,  // Enabled - other endpoints handle rate limits better
};

// Load API settings from config
function loadAPISettings() {
    try {
        const config = JSON.parse(localStorage.getItem('dynamicglow:config') || '{}');
        
        // FORCE DISABLE if not explicitly set to true
        // This overrides old saved configs
        apiSettings.enableAlbumMetadata = config.enableAlbumMetadata === true;
        apiSettings.enableEpisodeMetadata = config.enableEpisodeMetadata === true;
        
        console.log('[default-dynamic] 🚫 API Settings loaded (STRICT MODE):', apiSettings);
        console.log('[default-dynamic] Raw config:', config);
        
        if (apiSettings.enableAlbumMetadata || apiSettings.enableEpisodeMetadata) {
            console.warn('[default-dynamic] ⚠️ WARNING: API features enabled - may cause 429 errors!');
        } else {
            console.log('[default-dynamic] ✅ All API features disabled - no 429 errors expected from default-dynamic.js');
        }
    } catch (err) {
        console.log('[default-dynamic] Using default API settings (all disabled)');
    }
}

// Expose API for config menu to control settings
window.DynamicGlowAPI = {
    setAlbumMetadataEnabled: (enabled) => {
        apiSettings.enableAlbumMetadata = enabled;
        console.log('[default-dynamic] Album metadata', enabled ? 'enabled' : 'disabled');
    },
    setEpisodeMetadataEnabled: (enabled) => {
        apiSettings.enableEpisodeMetadata = enabled;
        console.log('[default-dynamic] Episode metadata', enabled ? 'enabled' : 'disabled');
    },
};

function waitForElement(els, func, timeout = 100) {
    const queries = els.map((el) => document.querySelector(el));
    if (queries.every((a) => a)) {
        func(queries);
    } else if (timeout > 0) {
        setTimeout(waitForElement, 300, els, func, --timeout);
    }
}

async function getAlbumInfo(id, retryCount = 0) {
    // Check if album metadata is enabled
    if (!apiSettings.enableAlbumMetadata) {
        console.log('[default-dynamic] Album metadata disabled - skipping API call');
        return null;
    }
    
    // Check cache first
    const cached = infoCache.get(`album:${id}`);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log('[default-dynamic] Using cached album data for', id);
        return cached.data;
    }
    
    // Calculate delay with exponential backoff
    const baseDelay = REQUEST_DELAY;
    const backoffMultiplier = Math.pow(2, consecutiveErrors);
    const totalDelay = Math.min(baseDelay * backoffMultiplier, 10000); // Max 10 seconds
    
    // Throttle requests
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < totalDelay) {
        const waitTime = totalDelay - elapsed;
        console.log(`[default-dynamic] Throttling album request: waiting ${waitTime}ms (backoff: ${backoffMultiplier}x)`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    try {
        lastRequestTime = Date.now();
        // Use public REST API with aggressive throttling
        const data = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${id}`);
        
        // Check for error response
        if (data?.error) {
            console.error('[default-dynamic] Album API error:', data.error);
            consecutiveErrors++;
            return null;
        }
        
        // Success - reset error counter
        consecutiveErrors = Math.max(0, consecutiveErrors - 1);
        
        // Cache successful response
        infoCache.set(`album:${id}`, { data, timestamp: Date.now() });
        console.log('[default-dynamic] Fetched and cached album info for', id);
        return data;
    } catch (err) {
        console.error('[default-dynamic] Album fetch failed:', err);
        consecutiveErrors++;
        return null;
    }
}

async function getEpisodeInfo(id, retryCount = 0) {
    // Check if episode metadata is enabled
    if (!apiSettings.enableEpisodeMetadata) {
        console.log('[default-dynamic] Episode metadata disabled - skipping API call');
        return null;
    }
    
    // Check cache first
    const cached = infoCache.get(`episode:${id}`);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log('[default-dynamic] Using cached episode data for', id);
        return cached.data;
    }
    
    // Calculate delay with exponential backoff
    const baseDelay = REQUEST_DELAY;
    const backoffMultiplier = Math.pow(2, consecutiveErrors);
    const totalDelay = Math.min(baseDelay * backoffMultiplier, 10000); // Max 10 seconds
    
    // Throttle requests
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < totalDelay) {
        const waitTime = totalDelay - elapsed;
        console.log(`[default-dynamic] Throttling episode request: waiting ${waitTime}ms (backoff: ${backoffMultiplier}x)`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    try {
        lastRequestTime = Date.now();
        // Use public REST API with aggressive throttling
        const data = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/episodes/${id}`);
        
        // Check for error response
        if (data?.error) {
            console.error('[default-dynamic] Episode API error:', data.error);
            consecutiveErrors++;
            return null;
        }
        
        // Success - reset error counter
        consecutiveErrors = Math.max(0, consecutiveErrors - 1);
        
        // Cache successful response
        infoCache.set(`episode:${id}`, { data, timestamp: Date.now() });
        console.log('[default-dynamic] Fetched and cached episode info for', id);
        return data;
    } catch (err) {
        console.error('[default-dynamic] Episode fetch failed:', err);
        consecutiveErrors++;
        return null;
    }
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
    (r /= 255), (g /= 255), (b /= 255);
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
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
        r = g = b = l; // achromatic
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

function setRootColor(name, colHex) {
    let root = document.documentElement;
    if (root === null) return;
    root.style.setProperty("--spice-" + name, colHex);
    root.style.setProperty("--spice-rgb-" + name, hexToRgb(colHex).join(","));
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

/* Init with current system light/dark mode */
let systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
toggleDark(systemDark);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    toggleDark(e.matches);
});

waitForElement([".main-actionButtons"], (queries) => {
    // Add activator on top bar
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
    if (textColHex == undefined) return registerCoverListener();

    let isLightBg = isLight(textColorBg);
    if (isLightBg)
        textColHex = lightenDarkenColor(textColHex, -15); // vibrant color is always too bright for white bg mode
    else textColHex = setLightness(textColHex, 0.45);

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

    // compute hue rotation to change spotify green to main color
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
        // warning popup
        if (Spicetify.Platform.PlatformData.client_version_triple < "1.1.68") Spicetify.showNotification(`Your version of Spotify ${Spicetify.Platform.PlatformData.client_version_triple}) is un-supported`);
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
        if (albumInfo && (albumInfo.release_date || albumInfo.date)) {
            let album_date = new Date(albumInfo.release_date || albumInfo.date);
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
        } else {
            // Fallback if API fails
            nearArtistSpanText = `
                <span>
                    <span draggable="true">
                        <a draggable="false" dir="auto" href="${album_uri}">${Spicetify.Player.data.item.metadata.album_title}</a>
                    </span>
                </span>
            `;
        }
    } else if (Spicetify.Player.data.item.type === "episode") {
        // podcast
        const episodeInfo = await getEpisodeInfo(Spicetify.Player.data.item.uri.replace("spotify:episode:", ""));
        if (episodeInfo && (episodeInfo.release_date || episodeInfo.date)) {
            let podcast_date = new Date(episodeInfo.release_date || episodeInfo.date);
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
        } else {
            // Fallback if API fails
            bgImage = bgImage.replace("spotify:image:", "https://i.scdn.co/image/");
            nearArtistSpanText = `
                <span>
                    <span draggable="true">
                        <a draggable="false" dir="auto" href="${album_uri}">${Spicetify.Player.data.item.metadata["show.publisher"]}</a>
                    </span>
                </span>
            `;
        }
    } else if (Spicetify.Player.data.item.isLocal) {
        // local file
        nearArtistSpanText = Spicetify.Player.data.item.metadata.album_title;
    } else if (Spicetify.Player.data.item.provider == "ad") {
        // ad
        nearArtistSpanText.innerHTML = "Advertisement";
        return;
    } else {
        // When clicking a song from the homepage, songChange is fired with half empty metadata
        // todo: retry only once?
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
    if (!img) return setTimeout(pickCoverColor, 250); // Check if image exists

    // Force src for local files, otherwise we will pick color from previous cover
    if (Spicetify.Player.data.item.isLocal) img.src = Spicetify.Player.data.item.metadata.image_url;

    if (!img.complete) return setTimeout(pickCoverColor, 250); // Check if image is loaded

    textColor = "#1db954";
    if (Spicetify.Platform.PlatformData.client_version_triple >= "1.2.48" && img.src.startsWith("https://i.scdn.co/image")) {
        var imgCORS = new Image();
        imgCORS.crossOrigin = "anonymous"; // Enable CORS
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

(function Startup() {
    if (!Spicetify.showNotification) {
        setTimeout(Startup, 300);
        return;
    }
    
    // FORCE RESET CONFIG ON FIRST START - Clear old settings
    const currentVersion = '2.0.4-live-wrapped-enabled';
    const savedVersion = localStorage.getItem('dynamicglow:version');
    
    if (savedVersion !== currentVersion) {
        console.log('[default-dynamic] 🔄 Config version mismatch - resetting to safe defaults');
        const existingConfig = JSON.parse(localStorage.getItem('dynamicglow:config') || '{}');
        
        // Enable all API features including Live Wrapped
        existingConfig.enableAlbumMetadata = true;
        existingConfig.enableEpisodeMetadata = true;
        existingConfig.enableMatchYourTaste = true;  // Now used by Focus/Cover modes
        existingConfig.enableTrackFeatures = true;
        existingConfig.enableSidebarCovers = true;
        existingConfig.enableListPlaylistsWithSong = true;
        
        localStorage.setItem('dynamicglow:config', JSON.stringify(existingConfig));
        localStorage.setItem('dynamicglow:version', currentVersion);
        
        console.log('[default-dynamic] ✅ Config reset complete - All APIs enabled including Focus/Cover modes');
        Spicetify.showNotification('DynamicGlow: All features enabled! Focus/Cover modes available in topbar.', false, 5000);
    }
    
    // Load API settings from config
    loadAPISettings();
    
    // Check latest release
    fetch("https://api.github.com/repos/JulienMaille/spicetify-dynamic-theme/releases/latest")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.tag_name > current) {
                const button = document.querySelector("#main-topBar-moon-button");
                button.classList.remove("main-topBar-buddyFeed");
                button.classList.add("main-actionButtons-button", "main-noConnection-isNotice");
                let updateLink = document.createElement("a");
                updateLink.setAttribute("href", "https://github.com/JulienMaille/spicetify-dynamic-theme/releases/latest");
                updateLink.innerHTML = `v${data.tag_name} available`;
                button.append(updateLink);
                button._tippy.setProps({
                    allowHTML: true,
                    content: `Changes: ${data.name}`
                });
            }
        })
        .catch((err) => {
            // Do something for an error here
        });
    Spicetify.showNotification("Applied system " + (systemDark ? "dark" : "light") + " theme.");
})();

document.documentElement.style.setProperty("--warning_message", " ");
