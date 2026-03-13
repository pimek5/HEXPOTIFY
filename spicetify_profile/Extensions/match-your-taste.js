(async function () {
    const EXT_NAME = "Match Your Taste";
    
    // Wait for React
    while (!Spicetify?.React || !Spicetify?.ReactDOM || !Spicetify?.Platform || !Spicetify?.CosmosAsync) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const { React, ReactDOM } = Spicetify;
    const { useState, useEffect } = React;

    // API Settings (controlled by config menu)
    let isEnabled = true;
    
    // Load settings from config
    function loadSettings() {
        try {
            const config = JSON.parse(localStorage.getItem('dynamicglow:config') || '{}');
            isEnabled = config.enableMatchYourTaste !== false;
            console.log('[Match Your Taste] Feature', isEnabled ? 'enabled' : 'disabled');
        } catch (err) {
            console.log('[Match Your Taste] Using default settings');
        }
    }
    
    // Expose API for config menu
    window.MatchYourTasteAPI = {
        setEnabled: (enabled) => {
            isEnabled = enabled;
            console.log('[Match Your Taste]', enabled ? 'Enabled' : 'Disabled');
            if (!enabled) {
                // Hide the page if currently showing
                const container = document.querySelector('#match-your-taste-container');
                if (container) container.style.display = 'none';
            }
        },
    };
    
    loadSettings();

    // Cache & throttling
    const recsCache = new Map();
    const inflightRequests = new Map(); // Track in-flight requests to prevent duplicates
    const CACHE_TTL_MS = 1200000; // 20 min cache
    const REQUEST_DELAY_MS = 25000; // 25 seconds between requests - EXTREMELY aggressive
    const COOLDOWN_AFTER_429_MS = 180000; // 3 minutes cooldown after getting 429
    let lastRequestTime = 0;
    let rateLimitCooldownUntil = 0; // Timestamp when cooldown ends
    let retryCount = 0;

    async function fetchRecommendations(trackId) {
        // Check if feature is enabled
        if (!isEnabled) {
            console.log('[Match Your Taste] Feature disabled - skipping API call');
            return null;
        }
        
        const now = Date.now();
        
        // Check if we're in cooldown period after 429
        if (rateLimitCooldownUntil > now) {
            const remainingSeconds = Math.ceil((rateLimitCooldownUntil - now) / 1000);
            console.warn(`[Match Your Taste] 🚫 IN COOLDOWN - ${remainingSeconds}s remaining. Please wait.`);
            Spicetify.showNotification(`Match Your Taste is in cooldown. Wait ${remainingSeconds} more seconds.`, true, 3000);
            return null;
        }
        
        // Check cache first
        const cached = recsCache.get(trackId);
        if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
            console.log('[Match Your Taste] ✅ Using cached data for:', trackId);
            return cached.data;
        }
        
        // Check if request is already in flight for this track
        if (inflightRequests.has(trackId)) {
            console.log('[Match Your Taste] ⏳ Request already in flight, waiting for it...', trackId);
            return inflightRequests.get(trackId);
        }

        // Throttle requests aggressively
        const elapsed = now - lastRequestTime;
        if (elapsed < REQUEST_DELAY_MS) {
            const waitTime = REQUEST_DELAY_MS - elapsed;
            console.log(`[Match Your Taste] 🛑 Throttling: waiting ${Math.round(waitTime/1000)}s (${waitTime}ms)`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        // Create promise and store in inflight map
        const requestPromise = (async () => {
            try {
                lastRequestTime = Date.now();
                console.log('[Match Your Taste] 🌐 Fetching recommendations for:', trackId);
                const data = await Spicetify.CosmosAsync.get(
                    `https://api.spotify.com/v1/recommendations?limit=6&seed_tracks=${trackId}`
                );
                console.log('[Match Your Taste] API response:', data);
                
                // Check for 429 rate limit - CosmosAsync returns {code: 429} format
                const is429 = data?.code === 429 || data?.error?.status === 429 || data?.status === 429;
                
                if (is429) {
                    console.error('[Match Your Taste] 🚫🚫🚫 RATE LIMITED (429) - Entering 3-minute cooldown');
                    rateLimitCooldownUntil = Date.now() + COOLDOWN_AFTER_429_MS;
                    Spicetify.showNotification('⚠️ Match Your Taste: Rate limited! Disabled for 3 minutes. Please wait.', true, 8000);
                    return null;
                }
                
                // Check if response contains other errors
                if (data?.error) {
                    console.error('[Match Your Taste] ❌ API returned error:', data.error);
                    Spicetify.showNotification(`API Error: ${data.error.message || 'Unknown error'}`, true);
                    return null;
                }
                
                // Check if response has tracks
                if (!data.tracks || !Array.isArray(data.tracks)) {
                    console.error('[Match Your Taste] Invalid response structure:', data);
                    console.error('[Match Your Taste] This might be a 429 rate limit in disguise');
                    
                    // If response looks like an error, treat as potential rate limit
                    if (data?.code || data?.message === 'Failed to fetch') {
                        console.error('[Match Your Taste] 🚫 Detected hidden rate limit - entering cooldown');
                        rateLimitCooldownUntil = Date.now() + COOLDOWN_AFTER_429_MS;
                        Spicetify.showNotification('⚠️ Match Your Taste: API blocked. Disabled for 3 minutes.', true, 8000);
                    }
                    
                    return null;
                }
                
                // Success - cache and return
                console.log(`[Match Your Taste] ✅ Success: Got ${data.tracks.length} recommendations`);
                recsCache.set(trackId, { data, timestamp: Date.now() });
                retryCount = 0;
                return data;
            } catch (err) {
                // Network errors, parsing errors, or other exceptions
                console.error('[Match Your Taste] ❌ Request exception:', err);
                Spicetify.showNotification('Failed to fetch recommendations. Check network connection.', true);
                return null;
            } finally {
                // Always cleanup inflight request
                inflightRequests.delete(trackId);
            }
        })();
        
        // Store the promise so duplicate requests can wait for it
        inflightRequests.set(trackId, requestPromise);
        
        return requestPromise;
    }

    function TrackCard({ track }) {
        const artists = track.artists?.map(a => a.name).join(', ') || 'Unknown';
        const cover = track.album?.images?.[0]?.url || '';
        
        const playTrack = () => {
            Spicetify.Player.playUri(track.uri);
        };

        return React.createElement('div', {
            className: 'match-taste-card',
            onClick: playTrack,
            style: {
                cursor: 'pointer',
                padding: '16px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s',
                border: '1px solid rgba(255,255,255,0.05)',
            },
            onMouseEnter: (e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
            },
            onMouseLeave: (e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }
        },
            React.createElement('img', {
                src: cover,
                style: {
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: '4px',
                    marginBottom: '12px',
                }
            }),
            React.createElement('div', {
                style: {
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '4px',
                }
            }, track.name),
            React.createElement('div', {
                style: {
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }
            }, artists)
        );
    }

    function MatchYourTastePage() {
        const [currentTrack, setCurrentTrack] = useState(null);
        const [recommendations, setRecommendations] = useState([]);
        const [loading, setLoading] = useState(true);
        const [cooldownRemaining, setCooldownRemaining] = useState(0);

        // Update cooldown timer every second
        useEffect(() => {
            const interval = setInterval(() => {
                const now = Date.now();
                if (rateLimitCooldownUntil > now) {
                    setCooldownRemaining(Math.ceil((rateLimitCooldownUntil - now) / 1000));
                } else {
                    setCooldownRemaining(0);
                }
            }, 1000);
            
            return () => clearInterval(interval);
        }, []);

        const fetchCurrentRecommendations = async () => {
            const track = Spicetify.Player?.data?.item;
            if (!track) return;

            setCurrentTrack(track);
            setLoading(true);

            const trackId = track.uri?.split(':').pop();
            if (!trackId) {
                setLoading(false);
                return;
            }

            const data = await fetchRecommendations(trackId);
            
            // Debug logging
            console.log('[Match Your Taste] fetchRecommendations returned:', data);
            
            if (!data) {
                console.error('[Match Your Taste] fetchRecommendations returned null (API error or rate limit)');
                setRecommendations([]);
                setLoading(false);
                return;
            }
            
            console.log('[Match Your Taste] data?.tracks exists?', !!data?.tracks);
            console.log('[Match Your Taste] Type of data:', typeof data, 'Keys:', Object.keys(data));
            
            const tracks = data?.tracks || [];
            console.log('[Match Your Taste] Setting recommendations:', tracks.length, 'tracks');
            setRecommendations(tracks);
            setLoading(false);
        };

        useEffect(() => {
            // Only fetch once on mount, don't track song changes
            fetchCurrentRecommendations();

            // Cleanup function (no listeners to remove)
            return () => {};
        }, []);

        const trackName = currentTrack?.metadata?.title || 'No track';
        const artistName = currentTrack?.metadata?.artist_name || '';
        const albumName = currentTrack?.metadata?.album_title || '';
        const coverUrl = currentTrack?.metadata?.image_url || '';

        const goBack = () => {
            console.log('[Match Your Taste] Going back...');
            Spicetify.Platform.History.push('/');
        };

        return React.createElement('div', {
            style: {
                padding: '24px 40px',
                height: '100%',
                overflow: 'auto',
                background: 'var(--spice-main)',
                position: 'relative',
            }
        },
            // Back button
            React.createElement('button', {
                onClick: goBack,
                style: {
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                },
                onMouseEnter: (e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.transform = 'translateX(-4px)';
                },
                onMouseLeave: (e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateX(0)';
                }
            }, '← Back'),
            React.createElement('div', {
                style: {
                    display: 'flex',
                    gap: '40px',
                    alignItems: 'flex-start',
                }
            },
                // Left sidebar - now playing
                React.createElement('div', {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: '250px',
                        position: 'sticky',
                        top: '24px',
                    }
                },
                    React.createElement('img', {
                        src: coverUrl,
                        style: {
                            width: '250px',
                            height: '250px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        }
                    }),
                    React.createElement('div', {
                        style: {
                            fontSize: '30px',
                            fontWeight: '530',
                            color: 'white',
                            textAlign: 'center',
                            width: '250px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginTop: '5px',
                        }
                    }, trackName),
                    React.createElement('div', {
                        style: {
                            fontSize: '15px',
                            color: 'rgba(255,255,255,0.7)',
                            textAlign: 'center',
                            width: '250px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginBottom: '2px',
                        }
                    }, artistName),
                    React.createElement('div', {
                        style: {
                            fontSize: '15px',
                            color: 'rgba(255,255,255,0.7)',
                            textAlign: 'center',
                            width: '250px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }
                    }, albumName)
                ),
                // Right section - recommendations
                React.createElement('div', {
                    style: {
                        flex: 1,
                        width: '100%',
                    }
                },
                    React.createElement('div', {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px',
                            marginTop: '10px',
                        }
                    },
                        React.createElement('div', {
                            style: {
                                fontSize: '24px',
                                fontWeight: '600',
                                color: 'white',
                            }
                        }, 'Song Recommendations'),
                        React.createElement('div', {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }
                        },
                            React.createElement('button', {
                                onClick: fetchCurrentRecommendations,
                                disabled: loading,
                                style: {
                                    background: loading ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: loading ? 'rgba(255,255,255,0.4)' : 'white',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s',
                                },
                                onMouseEnter: (e) => {
                                    if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                },
                                onMouseLeave: (e) => {
                                    if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                }
                            }, '↻ Refresh'),
                            React.createElement('div', {
                                style: {
                                    fontSize: '14px',
                                    color: 'rgba(255,255,255,0.6)',
                                }
                            }, `${recommendations.length} songs`)
                        )
                    ),
                    cooldownRemaining > 0
                        ? React.createElement('div', {
                            style: { 
                                color: 'white', 
                                fontSize: '16px',
                                padding: '30px 20px',
                                textAlign: 'center',
                                background: 'rgba(255, 59, 48, 0.1)',
                                borderRadius: '12px',
                                border: '2px solid rgba(255, 59, 48, 0.3)',
                                boxShadow: '0 0 20px 5px rgba(255, 59, 48, 0.2)',
                            }
                        }, 
                            React.createElement('div', { 
                                style: { 
                                    fontSize: '48px', 
                                    marginBottom: '16px',
                                } 
                            }, '🚫'),
                            React.createElement('div', { 
                                style: { 
                                    marginBottom: '12px', 
                                    fontWeight: '700',
                                    fontSize: '20px',
                                } 
                            }, 'Rate Limited - Cooldown Active'),
                            React.createElement('div', { 
                                style: { 
                                    marginBottom: '8px',
                                    color: 'rgba(255,255,255,0.8)',
                                } 
                            }, `Please wait ${cooldownRemaining} seconds before trying again.`),
                            React.createElement('div', { 
                                style: { 
                                    fontSize: '13px',
                                    color: 'rgba(255,255,255,0.6)',
                                    marginTop: '16px',
                                } 
                            }, 'Spotify API has rate limited this feature. The cooldown will automatically end.'),
                        )
                        : loading
                        ? React.createElement('div', {
                            style: { 
                                color: 'white', 
                                fontSize: '16px',
                                padding: '20px',
                                textAlign: 'center',
                            }
                        }, 'Loading recommendations...')
                        : recommendations.length === 0
                        ? React.createElement('div', {
                            style: { 
                                color: 'rgba(255,255,255,0.7)', 
                                fontSize: '16px',
                                padding: '20px',
                                textAlign: 'center',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }
                        }, 
                            React.createElement('div', { 
                                style: { 
                                    fontSize: '20px', 
                                    marginBottom: '12px',
                                    color: 'rgba(255,255,255,0.8)'
                                } 
                            }, '⚠️'),
                            React.createElement('div', { 
                                style: { marginBottom: '8px', fontWeight: '600' } 
                            }, 'No recommendations found'),
                            React.createElement('div', { 
                                style: { fontSize: '14px', color: 'rgba(255,255,255,0.5)' } 
                            }, 'Spotify API rate limit reached. Please wait 2-3 minutes and click Refresh.')
                        )
                        : React.createElement('div', {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '16px',
                            }
                        }, recommendations.map(track =>
                            React.createElement(TrackCard, { key: track.id, track })
                        ))
                )
            )
        );
    }

    function addTopbarButton() {
        let tries = 0;
        const maxTries = 10;
        const timer = setInterval(() => {
            tries += 1;
            const reloadButton = document.querySelector('button[aria-label="Reload page"]');
            if (!reloadButton) {
                if (tries >= maxTries) clearInterval(timer);
                return;
            }

            let button = document.getElementById('match-your-taste-btn');
            if (!button) {
                button = document.createElement('button');
                button.id = 'match-your-taste-btn';
                button.setAttribute('aria-label', 'Match Your Taste');
                button.setAttribute('title', 'Match Your Taste');
                button.innerHTML = `
                    <svg role="img" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2l2.8 6h6.2l-5 3.6 1.9 6.4-5.9-4-5.9 4 1.9-6.4-5-3.6h6.2L12 2z" fill="currentColor"></path>
                    </svg>
                `;
                button.onclick = openMatchYourTastePage;
            }

            button.className = reloadButton.className + ' match-your-taste-button';

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

    function openMatchYourTastePage() {
        Spicetify.Platform.History.push({
            pathname: '/match-your-taste'
        });
    }

    function renderMatchYourTastePage() {
        // Check if feature is enabled
        if (!isEnabled) {
            console.log('[Match Your Taste] Feature disabled - not rendering page');
            return;
        }
        
        const mainView = document.querySelector('.main-view-container__scroll-node-child, .main-view-container__scroll-node');
        if (!mainView) {
            setTimeout(renderMatchYourTastePage, 100);
            return;
        }

        // Only render if we're actually on the Match Your Taste route
        if (Spicetify.Platform.History.location.pathname !== '/match-your-taste') {
            return;
        }

        // Find or create container
        let container = document.getElementById('match-taste-page-container');
        if (!container) {
            // Hide existing content instead of removing it
            Array.from(mainView.children).forEach(child => {
                if (child.id !== 'match-taste-page-container') {
                    child.style.display = 'none';
                }
            });

            container = document.createElement('div');
            container.id = 'match-taste-page-container';
            container.style.cssText = `
                width: 100%;
                min-height: 100%;
                position: relative;
                z-index: 1;
            `;

            mainView.appendChild(container);
            
            // Render React component only when creating container
            console.log('[Match Your Taste] Rendering React component');
            ReactDOM.render(React.createElement(MatchYourTastePage), container);
        } else {
            console.log('[Match Your Taste] Container already exists, skipping render');
        }
    }

    function cleanupMatchYourTastePage() {
        const container = document.getElementById('match-taste-page-container');
        if (container) {
            ReactDOM.unmountComponentAtNode(container);
            container.remove();
        }
        
        // Restore visibility of hidden content
        const mainView = document.querySelector('.main-view-container__scroll-node-child, .main-view-container__scroll-node');
        if (mainView) {
            Array.from(mainView.children).forEach(child => {
                if (child.style.display === 'none') {
                    child.style.display = '';
                }
            });
        }
    }

    let lastPathname = '';
    Spicetify.Platform.History.listen((location) => {
        const currentPathname = location.pathname;
        
        // Cleanup when leaving Match Your Taste page
        if (lastPathname === '/match-your-taste' && currentPathname !== '/match-your-taste') {
            console.log('[Match Your Taste] Leaving page, cleaning up');
            cleanupMatchYourTastePage();
        }
        
        // Render when entering Match Your Taste page (only if coming from a different page)
        if (currentPathname === '/match-your-taste' && lastPathname !== '/match-your-taste') {
            console.log('[Match Your Taste] Entering page, rendering');
            renderMatchYourTastePage();
        }
        
        lastPathname = currentPathname;
    });

    addTopbarButton();
    console.log('[Match Your Taste] Initialized');
})();
