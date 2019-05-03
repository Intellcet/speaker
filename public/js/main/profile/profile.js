function Profile(options) {
    options = options instanceof Object ? options : {};

    const $S = options.$SELECTORS;
    const PAGES = options.PAGES;

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    const server = options.server;

    let user = null;

    let uiProfile = null;

    function profileHandler() {
        uiProfile = null;
        uiProfile = new UIProfile(options);
    }

    function loggedIn(_user) {
        if (_user && _user.token) {
            user = _user;
        }
    }

    function checkSongInPlaylist(pId, sId) {
        const playlist = user.playlists.find(p => p.id === pId);
        if (playlist) {
            const song = playlist.songs.find(s => s.id === sId);
            if (song) {
                return true;
            }
        }
        return false;
    }

    async function addSongToPlaylist({playlistId, songId}) {
        if (!checkSongInPlaylist(playlistId, songId)) {
            return server.addSongToPlaylist({playlistId, songId});
        }
        return false;
    }

    async function uploadSong(song) {
        return server.uploadSong(song);
    }

    async function addNewPlaylist(name) {
        return server.addNewPlaylist({name});
    }

    async function deletePlaylist(id) {
        return server.deletePlaylist({id});
    }

    async function deleteSongFromPlaylist(data) {
        return server.deleteSongFromPlaylist(data);
    }

    async function addSongToFavorite(songId) {
        if (user) {
            const playlist = user.playlists.find(p => p.name === 'favorite');
            if (playlist) {
                if (!checkSongInPlaylist(playlist.id, songId)) {
                    return server.addSongToPlaylist({playlistId: playlist.id, songId});
                }
            }
            return false;
        }
    }

    async function deleteSongFromFavorite(songId) {
        const playlist = user.playlists.find(p => p.name === 'favorite');
        if (playlist) {
            return server.deleteSongFromPlaylist({playlistId: playlist.id, songId});
        }
        return false;
    }

    async function userUpdated() {
        user = (await server.getUser()).data;
        mediator.call(EVENTS.FILL_PLAYLISTS_LIST_PROFILE);
        mediator.call(EVENTS.FILL_SONGS_LIST_PROFILE);
        mediator.call(EVENTS.SELECTED_PLAYLIST_HANDLER);
        mediator.call(EVENTS.SPEAKER_UPDATE);
        mediator.call(EVENTS.UPDATE_RADIO_HISTORY);
    }

    function isSongLiked(songId) {
        if (user) {
            const playlist = user.playlists.find(p => p.name === 'favorite');
            let song = null;
            if (playlist) {
                song = playlist.songs.find(s => s.id === songId);
            }
            return !!song;
        }
        return false;
    }

    function init() {
        mediator.subscribe(EVENTS.PROFILE_HANDLER, profileHandler);
        mediator.subscribe(EVENTS.LOGGED_IN, loggedIn);
        mediator.subscribe(EVENTS.USER_UPDATED, userUpdated);
        mediator.subscribe(EVENTS.DELETE_PLAYLIST, deletePlaylist);
        mediator.set(TRIGGERS.GET_USER, () => user);
        mediator.set(TRIGGERS.UPLOAD_SONG, uploadSong);
        mediator.set(TRIGGERS.ADD_NEW_PLAYLIST, addNewPlaylist);
        mediator.set(TRIGGERS.ADD_SONG_TO_PLAYLIST, addSongToPlaylist);
        mediator.set(TRIGGERS.ADD_SONG_TO_FAVORITE, addSongToFavorite);
        mediator.set(TRIGGERS.DELETE_SONG_FROM_PLAYLIST, deleteSongFromPlaylist);
        mediator.set(TRIGGERS.DELETE_SONG_FROM_FAVORITE, deleteSongFromFavorite);
        mediator.set(TRIGGERS.IS_SONG_LIKED, isSongLiked);
    }
    init();

}