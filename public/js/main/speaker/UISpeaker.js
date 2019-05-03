function UISpeaker(options) {

    options = options instanceof Object ? options : {};

    const $S = options.$SELECTORS;

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    let user = null;
    let selectedPlaylist = null;

    /**
     * Обработчик выбора песни
     */
    function songsHandler() {
        const songs = $('.speaker-content-song-row');
        songs.off('click').on('click', function () {
            const songId = this.dataset.id;
            if (songId) {
                if (selectedPlaylist) {
                    mediator.call(EVENTS.PLAY_PLAYLIST_FROM_SONG, {playlistId: selectedPlaylist.id, songId})
                } else {
                    mediator.call(EVENTS.PLAY_SONG, {id: songId});
                }
            }
        });
    }

    /**
     * Заполнить список песен
     * @param _songs
     */
    function fillListSongs(_songs) {
        if (user) {
            const songs = (_songs && _songs.length) ?  _songs : user.songs;
            $S.SPEAKER.SONGS_CONTENT.empty();
            (_songs) ? $S.SPEAKER.SONGS_CONTENT.addClass('chosen-playlists-songs') : $S.SPEAKER.SONGS_CONTENT.removeClass('chosen-playlists-songs');
            for (const song of songs) {
                const row = `<div class="speaker-content-song-row" data-id="${song.id}">
                                <p class="speaker-content-song-name">${song.name}</p>
                             </div>`;
                $S.SPEAKER.SONGS_CONTENT.prepend(row);
            }
            songsHandler();
        }
    }

    /**
     * Обработчик выбора плейлиста
     */
    function playlistsHandler() {
        const playlists = $('.speaker-content-playlist-row');
        playlists.off('click').on('click', function () {
            const playlistId = this.dataset.id - 0;
            if (playlistId) {
                if (!this.classList.contains('chosen-playlist')) {
                    const playlist = user.playlists.find(p => p.id === playlistId);
                    if (playlist.songs && playlist.songs.length) {
                        selectedPlaylist = playlist;
                        fillListSongs(playlist.songs);
                        playlists.removeClass('chosen-playlist');
                        this.classList.add('chosen-playlist')
                    }
                } else {
                    selectedPlaylist = null;
                    fillListSongs();
                    playlists.removeClass('chosen-playlist');
                }
            }
        });
    }

    /**
     * Заполнить список плейлистов
     */
    function fillListPlaylists() {
        $S.SPEAKER.PLAYLIST_CONTENT.empty();
        if (user) {
            for (const playlist of user.playlists) {
                const row = `<div class="speaker-content-playlist-row" data-id="${playlist.id}">
                                <p class="speaker-content-playlist-name">${playlist.name}</p>
                                <p class="speaker-content-playlist-songs">${playlist.songs.length} песен</p>
                             </div>`;
                $S.SPEAKER.PLAYLIST_CONTENT.prepend(row);
            }
            playlistsHandler();
        }
    }

    /**
     * Заполнить список плейлистов и список песен пользователя
     */
    function fillPlaylistsAndSongs() {
        user = mediator.get(TRIGGERS.GET_USER);
        fillListPlaylists();
        fillListSongs();
    }

    function speakerUpdated() {
        fillPlaylistsAndSongs();
    }

    function init() {
        fillPlaylistsAndSongs();
        mediator.subscribe(EVENTS.SPEAKER_UPDATE, speakerUpdated);
    }
    init();

}