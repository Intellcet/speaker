function Speaker(options) {

    options = options instanceof Object ? options : {};

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    const server = options.server;

    let uiSpeaker = null;

    let user = null;
    let currentPlaylist = null;
    let currentSong = null;

    let playingSongId = null;

    function speakerHandler() {
        uiSpeaker = null;
        uiSpeaker = new UISpeaker(options);
        mediator.call(EVENTS.FILL_PLAYER);
        mediator.call(EVENTS.CLOSED_RADIO);
    }

    /**
     * Воспроизвести плейлист начиная с выбранной песни
     * @param playlistId
     * @param songId
     */
    async function playPlaylistFromSong({playlistId, songId}) {
        user = mediator.get(TRIGGERS.GET_USER);
        if (user) {
            currentPlaylist = user.playlists.find(p => p.id === playlistId);
            currentPlaylist.songs.reverse();
            if (currentPlaylist) {
                currentSong = currentPlaylist.songs.find(s => s.id === (songId - 0));
                if (currentSong) {
                    playingSongId = currentSong.id;
                    playSong({id: currentSong.id}, false);
                }
            }
        }
    }

    /**
     * Воспроизвести выбранную песню
     * @param songId
     * @param flag
     */
    async function playSong({id}, flag = true) {
        const currentSongFromRadio = mediator.get(TRIGGERS.GET_CURRENT_RADIO_SONG);
        if (currentSongFromRadio) {
            currentSongFromRadio.pause();
            currentSongFromRadio.src="";
        }
        if (flag) {
            currentPlaylist = null;
            currentSong = null;
        }
        const result = await server.playSong({id});
        if (result && !result.error) {
            playingSongId = id;
            mediator.call(EVENTS.FILL_PLAYER, id);
        }
    }

    function playPrevSong() {
        if (currentPlaylist) {
            for (let i = 0; i < currentPlaylist.songs.length; i++) {
                const song = currentPlaylist.songs[i];
                if (song.id === currentSong.id) {
                    let newSong = currentPlaylist.songs[i - 1];
                    if (newSong) {
                        playSong({id: newSong.id}, false).finally();
                        currentSong = newSong;
                    } else {
                        newSong = currentPlaylist.songs[currentPlaylist.songs.length - 1];
                        playingSongId = newSong.id;
                        playSong({id: newSong.id}, false).finally();
                        currentSong = newSong;
                    }
                    break;
                }
            }
        }
    }

    function playNextSong() {
        if (currentPlaylist) {
            for (let i = 0; i < currentPlaylist.songs.length; i++) {
                const song = currentPlaylist.songs[i];
                if (song.id === currentSong.id) {
                    let newSong = currentPlaylist.songs[i + 1];
                    if (newSong) {
                        playSong({id: newSong.id}, false).finally();
                        currentSong = newSong;
                    } else {
                        newSong = currentPlaylist.songs[0];
                        playingSongId = newSong.id;
                        playSong({id: newSong.id}, false).finally();
                        currentSong = newSong;
                    }
                    break;
                }
            }
        }
    }

    async function closeSpeaker() {
        if (currentPlaylist) {
            currentPlaylist = null;
        }
        if (currentSong) {
            currentSong = null;
        }
        const result = await server.stopSong({songId: playingSongId});
        if (result && !result.error) {
            mediator.call(EVENTS.RESET_PLAYER);
        }
    }

    function init() {
        mediator.subscribe(EVENTS.SPEAKER_HANDLER, speakerHandler);
        mediator.subscribe(EVENTS.CLOSED_SPEAKER, closeSpeaker);
        mediator.subscribe(EVENTS.PLAY_PLAYLIST_FROM_SONG, playPlaylistFromSong);
        mediator.subscribe(EVENTS.PLAY_SONG, playSong);
        mediator.subscribe(EVENTS.PLAY_PREV_SONG, playPrevSong);
        mediator.subscribe(EVENTS.PLAY_NEXT_SONG, playNextSong);

    }
    init();

}