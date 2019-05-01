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
            const result = await server.addSongToPlaylist({playlistId, songId});
            if (!result.error) {
                user = await server.getUser();
                mediator.call(EVENTS.USER_UPDATED, user);
            }
        }
    }

    function init() {
        mediator.subscribe(EVENTS.PROFILE_HANDLER, profileHandler);
        mediator.subscribe(EVENTS.ADD_SONG_TO_PLAYLIST, addSongToPlaylist);
        mediator.subscribe(EVENTS.LOGGED_IN, loggedIn);
        mediator.subscribe(EVENTS.USER_UPDATED, u => user = u);
        mediator.set(TRIGGERS.GET_USER, () => user);
    }
    init();

}