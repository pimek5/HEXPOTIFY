(function() {
    if (!Spicetify.Platform?.LibraryAPI || !Spicetify.Player) {
        setTimeout(arguments.callee, 100);
        return;
    }

    console.log('[QuickAdd] Initializing playlist checker...');

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .quick-add-playlists-container {
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            margin-right: 8px !important;
        }

        .quick-add-playlist-icon {
            width: 28px !important;
            height: 28px !important;
            border-radius: 4px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            flex-shrink: 0 !important;
            position: relative !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            overflow: hidden !important;
        }

        .quick-add-playlist-icon:hover {
            transform: scale(1.15) !important;
            box-shadow: 0 0 12px var(--glowify-glow-accent) !important;
        }

        .quick-add-playlist-icon img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
        }

        .quick-add-tooltip {
            position: absolute !important;
            bottom: calc(100% + 6px) !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: rgba(0, 0, 0, 0.95) !important;
            color: white !important;
            padding: 6px 10px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            white-space: nowrap !important;
            pointer-events: none !important;
            opacity: 0 !important;
            transition: opacity 0.2s !important;
            z-index: 10000 !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        }

        .quick-add-playlist-icon:hover .quick-add-tooltip {
            opacity: 1 !important;
        }

        .quick-add-loading {
            font-size: 11px !important;
            opacity: 0.5 !important;
            font-style: italic !important;
        }

        .quick-add-empty {
            font-size: 11px !important;
            opacity: 0.4 !important;
        }
    `;
    document.head.appendChild(style);

    let container = null;
    let currentTrackUri = null;

    // Create the playlists container
    function createPlaylistsContainer() {
        const div = document.createElement('div');
        div.className = 'quick-add-playlists-container';
        return div;
    }

    // Check which playlists contain the current track
    async function checkTrackInPlaylists(trackUri) {
        try {
            console.log('[QuickAdd] Checking track:', trackUri);
            
            // Get playlists that contain this track using LibraryAPI
            const containsResponse = await Spicetify.Platform.LibraryAPI.contains(trackUri);
            console.log('[QuickAdd] LibraryAPI contains response:', containsResponse);

            // Alternative: Get all playlists from Platform
            if (!Spicetify.Platform.RootlistAPI) {
                console.log('[QuickAdd] RootlistAPI not available');
                return [];
            }

            const rootlistData = await Spicetify.Platform.RootlistAPI.getContents();
            console.log('[QuickAdd] Rootlist data:', rootlistData);

            const playlists = rootlistData?.items || [];
            console.log('[QuickAdd] Found', playlists.length, 'items in rootlist');

            const playlistsWithTrack = [];

            // Check each playlist
            for (const item of playlists.slice(0, 30)) {
                if (item.type !== 'playlist') continue;

                const playlistUri = item.uri;
                const playlistName = item.name || 'Unnamed';
                const playlistImage = item.images?.[0]?.url || '';
                
                console.log('[QuickAdd] Checking playlist:', playlistName, playlistUri);

                try {
                    // Check if track is in this specific playlist
                    const inPlaylist = await Spicetify.Platform.LibraryAPI.contains(trackUri, [playlistUri]);
                    console.log('[QuickAdd] Track in', playlistName, '?', inPlaylist);

                    if (inPlaylist && inPlaylist[0]) {
                        playlistsWithTrack.push({
                            name: playlistName,
                            uri: playlistUri,
                            image: playlistImage
                        });
                        console.log('[QuickAdd] ✓ Track found in:', playlistName);
                    }
                } catch (e) {
                    console.error('[QuickAdd] Error checking playlist:', playlistName, e);
                }
            }

            console.log('[QuickAdd] Final result: track found in', playlistsWithTrack.length, 'playlists');
            return playlistsWithTrack;

        } catch (e) {
            console.error('[QuickAdd] Error:', e);
            return [];
        }
    }

    // Update the display
    async function updatePlaylistDisplay() {
        if (!container) return;

        const trackInfo = Spicetify.Player.data?.item;
        if (!trackInfo) return;

        const trackUri = trackInfo.uri;
        if (trackUri === currentTrackUri) return;

        currentTrackUri = trackUri;
        container.innerHTML = '<span class="quick-add-loading">Checking playlists...</span>';

        const playlists = await checkTrackInPlaylists(trackUri);
        
        container.innerHTML = '';

        if (playlists.length === 0) {
            container.innerHTML = '<span class="quick-add-empty">—</span>';
        } else {
            playlists.forEach(playlist => {
                const icon = document.createElement('div');
                icon.className = 'quick-add-playlist-icon';
                icon.title = playlist.name;
                
                if (playlist.image) {
                    icon.innerHTML = `
                        <img src="${playlist.image}" alt="${playlist.name}">
                        <div class="quick-add-tooltip">${playlist.name}</div>
                    `;
                } else {
                    icon.innerHTML = `
                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05)); font-size: 14px;">♪</div>
                        <div class="quick-add-tooltip">${playlist.name}</div>
                    `;
                }

                icon.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Open playlist
                    Spicetify.Platform.History.push({
                        pathname: `/playlist/${playlist.uri.split(':')[2]}`
                    });
                };

                container.appendChild(icon);
            });
        }
    }

    // Insert container into UI
    function insertContainer() {
        const contextItemInfo = document.querySelector('.main-nowPlayingView-contextItemInfo');
        
        if (contextItemInfo && !document.querySelector('.quick-add-playlists-container')) {
            container = createPlaylistsContainer();
            
            // Insert before the add to playlist button
            const lastDiv = contextItemInfo.querySelector('.CAVVGuPYPRDhrbGiFOc1');
            if (lastDiv) {
                contextItemInfo.insertBefore(container, lastDiv);
            } else {
                const shareButton = contextItemInfo.querySelector('.main-watchFeed-shareButton');
                if (shareButton && shareButton.parentNode) {
                    shareButton.parentNode.insertBefore(container, shareButton.nextSibling);
                }
            }
            
            console.log('[QuickAdd] Container inserted');
            updatePlaylistDisplay();
        }
    }

    // Watch for track changes
    Spicetify.Player.addEventListener('songchange', () => {
        console.log('[QuickAdd] Song changed, updating...');
        setTimeout(updatePlaylistDisplay, 500);
    });

    // Initial insert with retries
    setTimeout(insertContainer, 1000);
    setTimeout(insertContainer, 2000);
    setTimeout(insertContainer, 3000);

    // Watch for DOM changes
    const observer = new MutationObserver(() => {
        if (!document.querySelector('.quick-add-playlists-container')) {
            insertContainer();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('[QuickAdd] Extension loaded - will show playlist icons where track exists');
})();
