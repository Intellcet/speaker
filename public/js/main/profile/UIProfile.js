function UIProfile(options) {

    options = options instanceof Object ? options : {};

    const $S = options.$SELECTORS;
    const PAGES = options.PAGES;
    const POPUPS = options.POPUPS;

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    let user = null;
    let selectedPlaylist = null;

    /**
     * Обработчик события добавить песню в плейлист*/
    function addSongToPlaylistHandler() {
        $('.sub-menu-playlist-name').off('click').on('click', async function (e) {
            const playlistId = $(this).data('id');
            const songId = $($(this)[0].parentElement).parent('div').data('id');
            if (playlistId && songId) {
                mediator.call(EVENTS.ADD_SONG_TO_PLAYLIST, {playlistId, songId});
            }
        });
    }

    /**Заполнить контекстное меню**/
    function fillSubMenu(elem) {
        if (user) {
            elem.empty();
            elem.append('Добавить в ...');
            for (const playlist of user.playlists) {
                const row = `<p class="sub-menu-playlist-name" data-id="${playlist.id}">${playlist.name}</p>`;
                elem.append(row);
            }
            addSongToPlaylistHandler();
        }
    }
    /**
     * Добавить в ...
     * <p class="sub-menu-playlist-name">Первый плейлист</p>
     * */

    /**Обработчик показывания/скрытия кнтекстного меню**/
    function subMenuHandler(flag, elem) {
        if (flag) {
            $($(elem).children('div')[0]).off('click').on('click', e => {
                elem = $($(elem).children('div')[1]);
                elem.addClass('show-sub-menu');
                fillSubMenu(elem);
            });
        } else {
            $($(elem).children('div')[1]).removeClass('show-sub-menu');
        }
    }

    function addSongHandler() {
        $('.upload-song-btn').off('click').on('click', async function (e) {
            let file = $('.upload-song')[0].files[0];
            const msg = $('.upload-song-error');
            if (file.type === 'audio/mp3') {
                file = new FormData();
                file.append('file', $('#upload-song-value')[0].files[0]);
                const result = await mediator.get(TRIGGERS.UPLOAD_SONG, file);
                if (!result.error) {
                    msg.empty().append('Песня успешно загружена!');
                    setTimeout(() => msg.empty(), 2000);
                    return;
                }
                msg.empty().append('Ошибка при загрузке песни.');
                setTimeout(() => msg.empty(), 2000);
                return;
            }
            msg.empty().append('Не выбрана песня!');
            setTimeout(() => msg.empty(), 2000);
        });
    }

    /**Обработчик событий, связанных с песнями**/
    function songsEventHandler() {
        $('.profile-content-song-row').off('mouseenter mouseleave').on('mouseenter', function(e) {
            $($(this).children('div')[0]).addClass('shown-options');
            subMenuHandler(true, this);
        }).on('mouseleave', function (e) {
            $($(this).children('div')[0]).removeClass('shown-options');
            subMenuHandler(false, this);
        });
        $('.add-song-btn').off('click').on('click', function (e) {
            mediator.call(EVENTS.SWITCH_POPUPS, POPUPS.ADD_SONG);
            addSongHandler();
        });
    }

    /**Заполнить список песнями**/
    function fillSongs() {
        user = mediator.get(TRIGGERS.GET_USER);
        if (user) {
            const songs = user.songs;
            $S.PROFILE.SONGS_CONTENT.empty();
            for (const song of songs) {
                const row = `<div class="profile-content-song-row" data-id="${song.id}">
                                 <p class="profile-content-song-name">${song.name}</p>
                                 <div class="options-container"> <!-- shown-options -->
                                     <div class="options"><div></div><div></div><div></div></div>
                                 </div>
                                 <svg version="1.1" class="profile-content-song-like content-row-like" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                      width="0" height="0" viewBox="0 0 100 100" xml:space="preserve">
                                     <path class="like-svg" d="M94.5,35.5"></path>
                                     <path class="like-svg" d="M118.5,38.5"></path>
                                     <path class="like-svg" d="M92,17.2c-0.1-0.1-0.2-0.2-0.3-0.3c-0.1-0.1-0.2-0.2-0.2-0.2c0,0,0,0,0,0C87.1,12.6,81.2,10,74.7,10
                                         c-13.4,0-24.3,10.9-24.3,24.3c0,0.2,0,0.5,0,0.7l0,0l0,0c0-0.2,0-0.4,0-0.7C50.5,20.9,39.6,10,26.2,10c-6.5,0-12.4,2.6-16.8,6.7
                                         c0,0,0,0,0,0c-0.1,0.1-0.2,0.2-0.2,0.2c-0.1,0.1-0.2,0.2-0.3,0.3C-19.5,44.8,43.8,90,50,94.3c0.1,0,0.2,0,0.4,0c0,0,0.1,0,0.1,0
                                         c0.2,0,0.3,0,0.5,0C57,90.1,120.4,44.8,92,17.2z"></path>
                                 </svg>
                                 <div class="sub-menu "> <!-- show-sub-menu -->
                                            Добавить в ...
                                            <p class="sub-menu-playlist-name">Первый плейлист</p>
                                </div>
                             </div>`;
                $S.PROFILE.SONGS_CONTENT.prepend(row);
            }
            songsEventHandler();
        }
    }
    /**
     * <div class="profile-content-song-row">
            <p class="profile-content-song-name">Название песни</p>
            <div class="options-container"> <!-- shown-options -->
                <div class="options"><div></div><div></div><div></div></div>
            </div>
            <svg version="1.1" class="profile-content-song-like content-row-like" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 width="0" height="0" viewBox="0 0 100 100" xml:space="preserve">
                <path class="like-svg" d="M94.5,35.5"></path>
                <path class="like-svg" d="M118.5,38.5"></path>
                <path class="like-svg" d="M92,17.2c-0.1-0.1-0.2-0.2-0.3-0.3c-0.1-0.1-0.2-0.2-0.2-0.2c0,0,0,0,0,0C87.1,12.6,81.2,10,74.7,10
                    c-13.4,0-24.3,10.9-24.3,24.3c0,0.2,0,0.5,0,0.7l0,0l0,0c0-0.2,0-0.4,0-0.7C50.5,20.9,39.6,10,26.2,10c-6.5,0-12.4,2.6-16.8,6.7
                    c0,0,0,0,0,0c-0.1,0.1-0.2,0.2-0.2,0.2c-0.1,0.1-0.2,0.2-0.3,0.3C-19.5,44.8,43.8,90,50,94.3c0.1,0,0.2,0,0.4,0c0,0,0.1,0,0.1,0
                    c0.2,0,0.3,0,0.5,0C57,90.1,120.4,44.8,92,17.2z"></path>
            </svg>
        </div>
     */

    function deleteSongsHandler() {
        $('.selected-playlist-content-row-delete-btn').off('click').on('click', async function (e) {
            const songElem = this.parentElement;
            const songId = songElem.dataset.id;
            if (songId) {
                const result = await mediator.get(TRIGGERS.DELETE_SONG_FROM_PLAYLIST, songId);
                if (!result.error) {
                    songElem.remove();
                }
            }
        });
    }

    function listSongsHandler(container) {
        container.empty();
        for (const song of user.songs) {
            const row = `<div class="add-song-list-row" data-id="${song.id}">
                            <p class="add-song-list-elem add-song-list-elem-name">${song.name}</p>
<!--                        <p class="add-song-list-elem add-song-list-elem-time">3:23</p>-->
                        </div>`;
            container.prepend(row);
        }
        $('.add-song-list-row').off('click').on('click', function (e) {
            const songName = this.firstChild.nextElementSibling.innerHTML;
            const songId = this.dataset.id;
            container.hide();
            $('.pre-add').css('display', 'flex');
            const selectedSong = $('.add-song-popup-song-name');
            selectedSong.empty().append(songName);
            selectedSong.data('id', songId);
        });
    }

    function appendSongHandler() {
        $('.add-song-popup-chose-btn').off('click').on('click', e => {
            $('.pre-add').hide();
            const container = $('.add-song-popup-list-container');
            container.show();
            listSongsHandler(container);
        });
        $('.add-song-popup-add-btn').off('click').on('click', e => {
            const songId = $('.add-song-popup-song-name').data('id');
            if (songId) {
                mediator.call(EVENTS.ADD_SONG_TO_PLAYLIST, {playlistId: selectedPlaylist.id, songId});
            }
        })
    }

    function fillSelectedPlaylist() {
        const content = $('.selected-playlist-content-content');
        content.empty();
        for (const song of selectedPlaylist.songs) {
            const row = `<div class="selected-playlist-content-row" data-id="${song.id}">
                            <div class="selected-playlist-info-row">
                                <p class="selected-playlist-content-row-elem selected-playlist-content-row-name">${song.name}</p>
                    <!--        <p class="selected-playlist-content-row-elem selected-playlist-content-row-time">3:23</p>-->
                                <svg version="1.1" class="selected-playlist-content-row-elem selected-playlist-content-row-like" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                 width="0" height="0" viewBox="0 0 100 100" xml:space="preserve">
                                    <path class="like-svg" d="M94.5,35.5"></path>
                                    <path class="like-svg" d="M118.5,38.5"></path>
                                    <path class="like-svg" d="M92,17.2c-0.1-0.1-0.2-0.2-0.3-0.3c-0.1-0.1-0.2-0.2-0.2-0.2c0,0,0,0,0,0C87.1,12.6,81.2,10,74.7,10
                                        c-13.4,0-24.3,10.9-24.3,24.3c0,0.2,0,0.5,0,0.7l0,0l0,0c0-0.2,0-0.4,0-0.7C50.5,20.9,39.6,10,26.2,10c-6.5,0-12.4,2.6-16.8,6.7
                                        c0,0,0,0,0,0c-0.1,0.1-0.2,0.2-0.2,0.2c-0.1,0.1-0.2,0.2-0.3,0.3C-19.5,44.8,43.8,90,50,94.3c0.1,0,0.2,0,0.4,0c0,0,0.1,0,0.1,0
                                        c0.2,0,0.3,0,0.5,0C57,90.1,120.4,44.8,92,17.2z"></path>
                                </svg>
                            </div>
                            <button class="selected-playlist-content-row-elem selected-playlist-content-row-delete-btn">X</button>
                        </div>`;
            content.prepend(row);
        }
        deleteSongsHandler();
        $('.selected-playlist-delete-btn').off('click').on('click', function (e) {
            mediator.call(EVENTS.DELETE_PLAYLIST, selectedPlaylist.id);
        });
        $('.selected-playlist-add-song-btn').off('click').on('click', function (e) {
            mediator.call(EVENTS.SWITCH_POPUPS, POPUPS.APPEND_SONG);
            appendSongHandler();
        });
    }

    /**
    <div class="selected-playlist-content-row">
        <div class="selected-playlist-info-row">
            <p class="selected-playlist-content-row-elem selected-playlist-content-row-name">Название песни</p>
<!--        <p class="selected-playlist-content-row-elem selected-playlist-content-row-time">3:23</p>-->
            <svg version="1.1" class="selected-playlist-content-row-elem selected-playlist-content-row-like" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             width="0" height="0" viewBox="0 0 100 100" xml:space="preserve">
                <path class="like-svg" d="M94.5,35.5"></path>
                <path class="like-svg" d="M118.5,38.5"></path>
                <path class="like-svg" d="M92,17.2c-0.1-0.1-0.2-0.2-0.3-0.3c-0.1-0.1-0.2-0.2-0.2-0.2c0,0,0,0,0,0C87.1,12.6,81.2,10,74.7,10
                    c-13.4,0-24.3,10.9-24.3,24.3c0,0.2,0,0.5,0,0.7l0,0l0,0c0-0.2,0-0.4,0-0.7C50.5,20.9,39.6,10,26.2,10c-6.5,0-12.4,2.6-16.8,6.7
                    c0,0,0,0,0,0c-0.1,0.1-0.2,0.2-0.2,0.2c-0.1,0.1-0.2,0.2-0.3,0.3C-19.5,44.8,43.8,90,50,94.3c0.1,0,0.2,0,0.4,0c0,0,0.1,0,0.1,0
                    c0.2,0,0.3,0,0.5,0C57,90.1,120.4,44.8,92,17.2z"></path>
            </svg>
        </div>
        <button class="selected-playlist-content-row-elem selected-playlist-content-row-delete-btn">X</button>
    </div>
    */

    function selectedPlaylistHandler() {
        if (selectedPlaylist) {
            $('.selected-playlist-name').empty().append(selectedPlaylist.name);
            fillSelectedPlaylist();
        }
    }

    function addPlaylistHandler() {
        $('.add-new-playlist-btn').off('click').on('click', async e => {
            const playlistName = $('.playlist-name');
            const name = playlistName.val();
            const msg = $('.add-playlist-error');
            if (name) {
                const result = await mediator.subscribe(TRIGGERS.ADD_NEW_PLAYLIST, name);
                if (!result.error) {
                    msg.empty().append("Плейлист успешно добавлен! Нажмите куда-нибудь для продолжения.");
                    setTimeout(() => { playlistName.val(''); msg.empty(); }, 2000);
                    return;
                }
                msg.empty().append("Плейлист с таким именем уже существует!");
                setTimeout(() => { playlistName.val(''); msg.empty(); }, 2000);
                return;
            }
            msg.empty().append("Не введено название плейлиста!");
            setTimeout(() => { playlistName.val(''); msg.empty(); }, 2000);
        })
    }

    function playlistsEventHandler() {
        $('.profile-content-playlist-row').off('click').on('click', function (e) {
            const selectedPlaylistId = $(this).data('id');
            selectedPlaylist = user.playlists.find(p => p.id === selectedPlaylistId);
            mediator.call(EVENTS.SWITCH_POPUPS, POPUPS.SELECTED_PLAYLIST);
        });
        $('.add-playlist-btn').off('click').on('click', e => {
            mediator.call(EVENTS.SWITCH_POPUPS, POPUPS.ADD_PLAYLIST);
            addPlaylistHandler();
        });
    }

    /**Заполнить список плейлистами**/
    function fillPlaylists() {
        user = mediator.get(TRIGGERS.GET_USER);
        if (user) {
            const playlists = user.playlists;
            $S.PROFILE.PLAYLIST_CONTENT.empty();
            for (const playlist of playlists) {
                const row = `<div class="profile-content-playlist-row" data-id="${playlist.id}">
                                <p class="profile-content-playlist-name">${playlist.name}</p>
                                <p class="profile-content-playlist-songs">${playlist.songs.length} песен</p>
                             </div>`;
                $S.PROFILE.PLAYLIST_CONTENT.prepend(row);
            }
            playlistsEventHandler();
        }
    }

    /**Показать нужный контент**/
    function showContent(content) {
        $S.PROFILE.SONGS.removeClass('selected-profile-content');
        $S.PROFILE.PLAYLISTS.removeClass('selected-profile-content');
        if (content === 'song') {
            $S.PROFILE.SONGS.addClass('selected-profile-content');
            fillSongs();
        } else {
            $S.PROFILE.PLAYLISTS.addClass('selected-profile-content');
            fillPlaylists();
        }
    }

    /**Обработчик нажатий на вкладки**/
    function profileUIHandler() {
        $S.PROFILE.TABS.off('click').on('click', e => {
            let content = null;
            $S.PROFILE.TABS.children('p').removeClass('selected-profile-tab');
            if (!e.target.classList.contains('profile-header-text')) {
                $(e.target).children('p').addClass('selected-profile-tab');
                content = $(e.target).data('tab')
            } else {
                e.target.classList.add('selected-profile-tab');
                content = $(e.target.parentElement).data('tab')
            }
            showContent(content);
        });
    }

    function init() {
        profileUIHandler();
        fillSongs();
        mediator.subscribe(EVENTS.SELECTED_PLAYLIST_HANDLER, selectedPlaylistHandler);
    }
    init();

}