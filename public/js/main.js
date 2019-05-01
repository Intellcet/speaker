$(document).ready(() => {

    const $SELECTORS = {
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
    };

    const mediator = new Mediator({...SETTINGS.MEDIATOR});
    const server = new Server({...SETTINGS});
    new NavigatorUI({$SELECTORS, server, ...SETTINGS, mediator});

    new Login({$SELECTORS, server, ...SETTINGS, mediator});
    new Register({$SELECTORS, server, ...SETTINGS, mediator});
    new Profile({$SELECTORS, server, ...SETTINGS, mediator});
    // new UI({$SELECTORS, server, ...SETTINGS, mediator});

});
