// Advanced Stats Custom App for DynamicGlow

(function() {
    if (!Spicetify.React) return;

    const { React } = Spicetify;
    const { useState, useEffect } = React;

    function StatsApp() {
        const [stats, setStats] = useState({
            totalTracks: 0,
            totalArtists: 0,
            totalPlaylists: 0,
            currentPlaying: null
        });

        useEffect(() => {
            fetchStats();
            Spicetify.Player.addEventListener("songchange", fetchStats);
        }, []);

        async function fetchStats() {
            try {
                // Get current track
                const item = Spicetify.Player.data?.item;
                
                // Get library info
                const response = await Spicetify.CosmosAsync.get('sp://core-playlist/v1/rootlist');
                const playlists = response.items?.filter(i => i.type !== 'collection').length || 0;

                setStats({
                    totalTracks: item?.uri || 'N/A',
                    totalArtists: item?.artist?.length || 0,
                    totalPlaylists: playlists,
                    currentPlaying: item?.name || 'Not playing'
                });
            } catch (e) {
                console.log('Stats fetch error:', e);
            }
        }

        return React.createElement('div', {
            style: {
                padding: '30px',
                background: 'var(--spice-main)',
                borderRadius: '10px',
                color: 'var(--spice-text)',
                fontFamily: 'Spotify Circular, sans-serif'
            }
        },
            React.createElement('h1', { style: { fontSize: '32px', marginBottom: '20px' } }, '📊 DynamicGlow Stats'),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } },
                React.createElement('div', { style: { padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' } },
                    React.createElement('h3', null, '🎵 Now Playing'),
                    React.createElement('p', { style: { fontSize: '14px', opacity: 0.8 } }, stats.currentPlaying)
                ),
                React.createElement('div', { style: { padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' } },
                    React.createElement('h3', null, '👥 Artists'),
                    React.createElement('p', { style: { fontSize: '24px', fontWeight: 'bold' } }, stats.totalArtists)
                ),
                React.createElement('div', { style: { padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' } },
                    React.createElement('h3', null, '🎵 Playlists'),
                    React.createElement('p', { style: { fontSize: '24px', fontWeight: 'bold' } }, stats.totalPlaylists)
                ),
                React.createElement('div', { style: { padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' } },
                    React.createElement('h3', null, '⚙️ Version'),
                    React.createElement('p', { style: { fontSize: '14px' } }, 'DynamicGlow v1.0')
                )
            )
        );
    }

    Spicetify.ReactDOM.render(
        React.createElement(StatsApp),
        document.getElementById('react-container')
    );
})();
