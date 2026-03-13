//@ts-check
// NAME: ListPlaylistsWithSong
// AUTHOR: huhridge (based on elijaholmos's version)
// DESCRIPTION: Adds context menu button to view playlists in your library that contain the selected song
/// <reference path="../globals.d.ts" />

(async function listPlaylistsWithSong() {
    if (!(Spicetify?.Player && Spicetify?.Menu && Spicetify?.LocalStorage && Spicetify?.Platform
            && Spicetify?.ContextMenu && Spicetify?.React?.createElement && Spicetify?.URI)) {
        setTimeout(listPlaylistsWithSong, 300);
        return;
    }

    const { Player, Menu, LocalStorage, Platform, React: react, ReactDOM: reactDOM } = Spicetify;
    
    // API Settings (controlled by config menu)
    let isEnabled = true;  // This is low traffic (on-demand), keep enabled
    
    // Load settings from config
    function loadSettings() {
        try {
            const config = JSON.parse(localStorage.getItem('dynamicglow:config') || '{}');
            isEnabled = config.enableListPlaylistsWithSong !== false;
            console.log('[ListPlaylistsWithSong] Feature', isEnabled ? 'enabled' : 'disabled');
        } catch (err) {
            console.log('[ListPlaylistsWithSong] Using default settings');
        }
    }
    
    loadSettings();

    function delay(delayInms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2);
            }, delayInms);
        });
    }

    async function recursivePlaylistFolder(folder) {
        let playlists = [];
        for (const playlist of folder) {
            if (playlist.type == "playlist") {
                if ((playlist.isCollaborative || playlist.isOwnedBySelf || playlist.canAdd) && playlist.totalLength > 0) {
                    let image;
                    try {
                        image = !playlist.images[0]
                            ? (await Spicetify.Platform.PlaylistAPI.getMetadata(playlist.uri)).images[0].url
                            : playlist.images[0].url;
                    } catch {
                        image = "";
                    }
                    playlists.push({
                        uri: playlist.uri,
                        title: playlist.name,
                        desc: playlist.description,
                        isCollab: playlist.isCollaborative || playlist.canAdd,
                        noOfSongs: playlist.totalLength,
                        created: playlist.addedAt.toLocaleString("default", { year: "numeric", month: "short", day: "numeric" }),
                        image: image,
                    });
                }
            } else if (playlist.type == "folder") {
                playlists.push(...(await recursivePlaylistFolder(playlist.items)));
            }
        }
        return playlists;
    }

    async function getUserLibrary() {
        let playlistsToCheck = Array();
        const userContents = await Spicetify.Platform.RootlistAPI.getContents();
        for (const playlist of userContents.items) {
            if (playlist.type == "playlist") {
                if ((playlist.isCollaborative || playlist.isOwnedBySelf || playlist.canAdd) && playlist.totalLength > 0) {
                    let image;
                    try {
                        image = !playlist.images[0]
                            ? (await Spicetify.Platform.PlaylistAPI.getMetadata(playlist.uri)).images[0].url
                            : playlist.images[0].url;
                    } catch {
                        image = "";
                    }
                    playlistsToCheck.push({
                        uri: playlist.uri,
                        title: playlist.name,
                        desc: playlist.description,
                        isCollab: playlist.isCollaborative || playlist.canAdd,
                        noOfSongs: playlist.totalLength,
                        created: playlist.addedAt.toLocaleString("default", { year: "numeric", month: "short", day: "numeric" }),
                        image: image,
                    });
                }
            } else if (playlist.type == "folder") {
                playlistsToCheck.push(...(await recursivePlaylistFolder(playlist.items)));
            }
        }
        return playlistsToCheck;
    }

    async function checkPlaylist(playlist, songUri) {
        var songFound = false;
        let addedAtDate;
        const tracks = await Spicetify.Platform.PlaylistAPI.getContents(playlist.uri);
        for (var i = 0; i < tracks.items.length; i++) {
            if (tracks.items[i].uri == songUri) {
                songFound = true;
                addedAtDate = new Date(tracks.items[i].addedAt).toLocaleString("default", { year: "numeric", month: "short", day: "numeric" });
                break;
            }
        }
        if (songFound) {
            playlist.index = i + 1;
            playlist.songAddedAt = addedAtDate;
            return playlist;
        } else {
            return false;
        }
    }

    const playlistCard = ({ playlist }) => {
        let isDesc = false;
        if (playlist.desc) {
            isDesc = true;
        }
        return react.createElement(
            "div",
            {
                className: "contentSpacing main-entityHeader-container main-entityHeader-nonWrapped main-trackList-trackListHeaderRow",
                style: {
                    minHeight: "280px",
                    marginLeft: "2%",
                    marginRight: "2%",
                    justifyContent: "left",
                },
            },
            react.createElement(
                "div",
                { className: "main-entityHeader-imageContainer" },
                react.createElement("img", {
                    className: "main-image-image",
                    src: playlist.image,
                    style: {
                        height: "inherit",
                    },
                })
            ),
            react.createElement(
                "div",
                { className: "main-entityHeader-headerText" },
                react.createElement(
                    "h2",
                    { className: "main-entityHeader-subtitle main-entityHeader-small main-entityHeader-uppercase main-entityHeader-bold" },
                    playlist.isCollab ? "Collaborative Playlist" : "Playlist"
                ),
                react.createElement(
                    "h1",
                    {
                        className: "main-entityHeader-title main-type-bass",
                        style: {
                            padding: "0.08em 0px",
                            visibility: "visible",
                            width: "100%",
                            fontSize: "9vmin",
                            lineHeight: "9vmin",
                        },
                    },
                    react.createElement(
                        "a",
                        {
                            href: playlist.uri,
                            draggable: "false",
                        },
                        playlist.title
                    )
                ),
                isDesc &&
                    react.createElement("h2", { className: "main-entityHeader-subtitle main-entityHeader-gray main-type-viola" }, playlist.desc),
                react.createElement(
                    "span",
                    { className: "main-entityHeader-metaData main-type-mesto" },
                    `${playlist.created} • ${playlist.noOfSongs} songs`
                )
            )
        );
    };

    async function listPlaylists(uris) {
        // Check if feature is enabled
        if (!isEnabled) {
            console.log('[ListPlaylistsWithSong] Feature disabled - skipping');
            Spicetify.showNotification('List Playlists with Song is disabled in DynamicGlow settings');
            return;
        }
        
        const allPlaylists = await getUserLibrary();
        const playlistsFound = [];
        for (var playlist of allPlaylists) {
            const playlistRes = await checkPlaylist(playlist, uris[0]);
            if (playlistRes) {
                playlistsFound.push(playlistRes);
            }
        }
        if (playlistsFound.length == 0) {
            Spicetify.showNotification("Song is not in any of your playlists.");
            return;
        }

        const songmeta = await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/tracks/" + uris[0].split(":")[2]);
        Spicetify.Platform.History.push(`/album/${songmeta.album.uri.split(":")[2]}?highlight=${uris[0]}`);
        await delay(2000);

        let songRow = document.querySelector(`[aria-selected="true"]`);
        let section = document.querySelector(`[data-testid="album-page"]`);

        let info = document.querySelector(`[data-testid="album-page"] > div`).cloneNode(true);
        info.classList.add("main-trackList-trackListHeaderRow");
        section.innerHTML = "";

        await delay(200);
        document
            .querySelector(".main-topBar-topbarContent.main-entityHeader-topbarContent.main-entityHeader-topbarContentFadeIn")
            .classList.remove("main-entityHeader-topbarContentFadeIn");

        section.appendChild(info);
        let appearsIn = document.createElement("h1");
        appearsIn.className = "main-type-bass main-trackList-trackListHeaderRow";
        appearsIn.style.fontSize = "48px";
        appearsIn.style.lineHeight = "60px";
        appearsIn.style.paddingLeft = "10px";
        appearsIn.style.height = "auto";
        appearsIn.innerText = `Appears In ${playlistsFound.length}/${allPlaylists.length} of your playlists:`;
        section.appendChild(appearsIn);
        let infoText = section.childNodes[0].childNodes[5];
        infoText.childNodes[0].innerText = "SONG";

        infoText.childNodes[1].childNodes[0].style.fontSize = "8vmin";
        infoText.childNodes[1].childNodes[0].style.lineHeight = "8vmin";
        infoText.childNodes[1].childNodes[0].innerText = songmeta.name;
        if (songmeta.album.total_tracks > 1) {
            let albumText = infoText.childNodes[0].cloneNode();
            albumText.classList.remove("main-entityHeader-uppercase", "main-entityHeader-small");
            albumText.style = "margin-top: 0px; margin-bottom: 8px";
            albumText.innerText = `Track ${songmeta.track_number} / ${songmeta.album.total_tracks} • ${songmeta.album.name}`;
            infoText.childNodes[1].appendChild(albumText);
            infoText.childNodes[2].childNodes[2].innerText = `1 song, ${parseInt(songmeta.duration_ms / 1000 / 60)} min ${parseInt(
                (songmeta.duration_ms / 1000) % 60
            )} sec`;
        }

        let songImage = document.createElement("img");
        songImage.className = "main-image-image main-trackList-rowImage";
        songImage.src = songmeta.album.images.at(-1).url;
        songImage.width = 40;
        songImage.height = 40;

        songRow.childNodes[0].classList.remove("main-trackList-selected");
        songRow.childNodes[0].style = "grid-template-columns: [index] 30px [first] 4fr [var1] 3fr [last] minmax(240px,2fr);";
        songRow.childNodes[0].childNodes[1].insertBefore(songImage, songRow.childNodes[0].childNodes[1].firstChild);
        songRow.childNodes[0].childNodes[2].childNodes[0].style.width = "fit-content";
        songRow.childNodes[0].childNodes[2].childNodes[0].innerText = songmeta.album.name;
        songRow.childNodes[0].childNodes[3].childNodes[1].classList.remove("main-trackList-rowDuration");
        if (songRow.childNodes[0].classList.contains("main-trackList-active")) {
            let spanIndex = document.createElement("span");
            spanIndex.classList.add("main-trackList-number", "main-type-ballad");

            songRow.childNodes[0].childNodes[0].childNodes[0].childNodes[0].remove();
            songRow.childNodes[0].childNodes[0].childNodes[0].appendChild(spanIndex);
        }

        for (const playlist of playlistsFound) {
            let preElement = document.createElement("div");
            preElement.classList.add("main-trackList-trackListHeaderRow");
            preElement.style.height = "auto";
            section.append(preElement);

            const playlist_card = react.createElement(playlistCard, { playlist: playlist });
            reactDOM.render(playlist_card, preElement);

            songRow.childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText = playlist.index;
            songRow.childNodes[0].childNodes[3].childNodes[1].innerText = playlist.songAddedAt;
            preElement.appendChild(songRow.cloneNode(true));
        }
    }
    
    // Expose API for config menu
    window.ListPlaylistsAPI = {
        setEnabled: (enabled) => {
            isEnabled = enabled;
            console.log('[ListPlaylistsWithSong]', enabled ? 'Enabled' : 'Disabled');
        },
    };

    new Spicetify.ContextMenu.Item(
        "List playlists with this Song",
        listPlaylists,
        (uris) => {
            if (!isEnabled) return false;
            if (uris.length != 1) return false;
            return Spicetify.URI.fromString(uris[0]).type == Spicetify.URI.Type.TRACK;
        },
        "search"
    ).register();
})();