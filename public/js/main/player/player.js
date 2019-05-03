function Player(options) {

    options = options instanceof Object ? options : {};

    const $S = options.$SELECTORS;
    const PAGES = options.PAGES;

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    const server = options.server;

    let uiPlayer = null;

    function getSong(id) {
        return server.downloadSong({id});
    }

    function setNewSongPosition(data) {
        server.setNewSongPosition(data);
    }

    function pauseSong(songId) {
        server.pauseSong({songId});
    }

    function resumeSong(songId) {
        server.resumeSong({songId});
    }

    function setVolume(data) {
        server.setVolume(data);
    }

    function init() {
        uiPlayer = new UIPlayer(options);
        mediator.set(TRIGGERS.GET_SONG, getSong);
        mediator.subscribe(EVENTS.SET_NEW_SONG_POSITION, setNewSongPosition);
        mediator.subscribe(EVENTS.PAUSE_SONG, pauseSong);
        mediator.subscribe(EVENTS.RESUME_SONG, resumeSong);
        mediator.subscribe(EVENTS.SET_VOLUME, setVolume);
    }
    init();
}