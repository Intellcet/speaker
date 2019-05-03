$(document).ready(() => {

    const $SELECTORS = {
        MAIN_CONTAINER: $('.container'),
        PAGES: {
            PROFILE: $('.profile'),
            RADIO: $('.radio'),
            SPEAKER: $('.speaker'),
        },
        CONTENT: {
            PROFILE_CONTENT: $('.profile-content'),
            RADIO_CONTENT: $('.radio-content'),
            SPEAKER_CONTENT: $('.speaker-content'),
        },
        BUTTONS: {
            REGISTER: $('.reg-btn'),
            LOGIN: $('.login-btn'),
        },
        POPUPS: {
            WRAP: $('.popup-wrapper'),
            LOGIN: $('.login-popup'),
            SELECTED_PLAYLIST: $('.selected-playlist-popup'),
            APPEND_SONG: $('.add-song-popup-bg'),
            ADD_SONG: $('.add-new-song-popup'),
            ADD_PLAYLIST: $('.add-new-playlist-popup'),
        },
        LOGIN: {
            LOGIN: $('.login-input'),
            PASSWORD: $('.password-input'),
            CHECKBOX: $('.checkbox-input'),
            SIGN_IN: $('.login-login-btn'),
            MSG: $('.login-error-msg'),
            LABEL: $('.login-popup-login-elem'),
        },
        PROFILE: {
            TABS: $('.profile-header-tabs'),
            PLAYLISTS: $('.profile-content-playlist'),
            SONGS: $('.profile-content-song'),
            SONGS_CONTENT: $('.profile-content-song-content'),
            PLAYLIST_CONTENT: $('.profile-content-playlist-content'),
        },
        SPEAKER: {
            PLAYLIST_CONTENT: $('.speaker-content-playlist'),
            SONGS_CONTENT: $('.speaker-content-song'),
        },
        PLAYER: {
            PROGRESS_BAR: $('.progress-bar'),
            PROGRESS: $('.progress'),
            MARKER: $('.marker'),
            TIMESTAMP: $('.timestamp'),
            SONG_NAME: $('.playing-song-name'),
            PERFORMER: $('.playing-song-performer'),
            LIKE: $('.like-playing-song-svg'),
            PREV_SONG: $('.prev-song-svg'),
            NEXT_SONG: $('.next-song-svg'),
            MAIN_BTN: $('.main-btn-svg'),
            VOLUME: $('.volume'),
            VOLUME_MARKER: $('.volume-marker'),
            VOLUME_BAR: $('.volume-bar'),
            PLAYER_CONTAINER: $('.player-container'),
        },
        RADIO: {
            RADIO_CONTAINER: $('.content'),
        }
    };

    const mediator = new Mediator({...SETTINGS.MEDIATOR});
    const server = new Server({...SETTINGS});

    new NavigatorUI({$SELECTORS, server, ...SETTINGS, mediator});

    new Login   ({$SELECTORS, server, ...SETTINGS, mediator});
    new Register({$SELECTORS, server, ...SETTINGS, mediator});

    new Player({$SELECTORS, server, ...SETTINGS, mediator});

    new Radio  ({$SELECTORS, server, ...SETTINGS, mediator});
    new Profile({$SELECTORS, server, ...SETTINGS, mediator});
    new Speaker({$SELECTORS, server, ...SETTINGS, mediator});

    mediator.call(mediator.EVENTS.SHOW_RADIO);

});
