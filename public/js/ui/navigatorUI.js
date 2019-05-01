function NavigatorUI(options) {

    options = options instanceof Object ? options : {};

    const $S = options.$SELECTORS;
    const PAGES = options.PAGES;
    const POPUPS = options.POPUPS;

    const server = options.server;

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;

    // Спрятать все страницы
    function hideAll() {
        Object.keys($S.PAGES).forEach(page => $S.PAGES[page].removeClass('selected-elem'));
        Object.keys($S.CONTENT).forEach(content => $S.CONTENT[content].removeClass('selected-content'));
    }

    // Показать нужную страницу
    function switchPages(page) {
        switch(page) {
            case PAGES.RADIO:
            default:
                hideAll();
                $S.PAGES.RADIO.addClass('selected-elem');
                $S.CONTENT.RADIO_CONTENT.addClass('selected-content');
                mediator.call(EVENTS.RADIO_HANDLER);
                break;
            case PAGES.SPEAKER:
                if (!$S.PAGES.SPEAKER.hasClass('speaker-active')) {
                    hideAll();
                    $S.PAGES.SPEAKER.addClass('selected-elem');
                    $S.CONTENT.SPEAKER_CONTENT.addClass('selected-content');
                    mediator.call(EVENTS.SPEAKER_HANDLER);
                }
                break;
            case PAGES.PROFILE:
                if (server.token) {
                    hideAll();
                    $S.PAGES.PROFILE.addClass('selected-elem');
                    $S.CONTENT.PROFILE_CONTENT.addClass('selected-content');
                    mediator.call(EVENTS.PROFILE_HANDLER);
                }
                break;
        }
    }

    function popupWrapHandler() {
        $S.POPUPS.WRAP.off('click').on('click', e => {
            if (e.target === $S.POPUPS.WRAP[0]) {
                e.stopPropagation();
                if (server.token) {
                    $S.BUTTONS.REGISTER.hide();
                    $S.BUTTONS.LOGIN.html('Выйти');
                }
                Object.keys($S.POPUPS).forEach(popup => $S.POPUPS[popup].removeClass('selected-elem'));
                $S.POPUPS.WRAP.removeClass('show-popup');
            }
        });
    }

    function popupAppendSongWrapperHandler() {
        $S.POPUPS.APPEND_SONG.off('click').on('click', e => {
            if (e.target === $S.POPUPS.APPEND_SONG[0]) {
                e.stopPropagation();
                $S.POPUPS.APPEND_SONG.removeClass('show-action-popup');
                $('.pre-add').css('display', 'flex');
            }
        })
    }

    function hidePopups() {
        $S.POPUPS.LOGIN.removeClass('show-action-popup');
        $S.POPUPS.SELECTED_PLAYLIST.removeClass('show-action-popup');
        $S.POPUPS.ADD_PLAYLIST.removeClass('show-action-popup');
        $S.POPUPS.ADD_SONG.removeClass('show-action-popup');
        $S.POPUPS.APPEND_SONG.removeClass('show-action-popup');
    }

    function switchPopups(popup, elem=null) {
        switch (popup) {
            case POPUPS.LOGIN_POPUP:
                hidePopups();
                $S.POPUPS.WRAP.addClass('show-popup');
                $S.POPUPS.LOGIN.addClass('show-action-popup');
                if (elem.hasClass('login-btn')) {
                    mediator.call(EVENTS.LOGIN_EVENT_HANDLER);
                }
                if (elem.hasClass('reg-btn')) {
                    mediator.call(EVENTS.REGISTER_EVENT_HANDLER);
                }
                popupWrapHandler();
                break;
            case POPUPS.SELECTED_PLAYLIST:
                hidePopups();
                $S.POPUPS.WRAP.addClass('show-popup');
                $S.POPUPS.SELECTED_PLAYLIST.addClass('show-action-popup');
                mediator.call(EVENTS.SELECTED_PLAYLIST_HANDLER);
                popupWrapHandler();
                break;
            case POPUPS.ADD_PLAYLIST:
                hidePopups();
                $S.POPUPS.WRAP.addClass('show-popup');
                $S.POPUPS.ADD_PLAYLIST.addClass('show-action-popup');
                mediator.call(EVENTS.ADD_PLAYLIST_HANDLER);
                popupWrapHandler();
                break;
            case POPUPS.ADD_SONG:
                hidePopups();
                $S.POPUPS.WRAP.addClass('show-popup');
                $S.POPUPS.ADD_SONG.addClass('show-action-popup');
                mediator.call(EVENTS.ADD_SONG_HANDLER);
                popupWrapHandler();
                break;
            case POPUPS.APPEND_SONG:
                $S.POPUPS.LOGIN.removeClass('show-action-popup');
                $S.POPUPS.ADD_PLAYLIST.removeClass('show-action-popup');
                $S.POPUPS.ADD_SONG.removeClass('show-action-popup');
                $S.POPUPS.APPEND_SONG.removeClass('show-action-popup');
                $S.POPUPS.WRAP.addClass('show-popup');
                $S.POPUPS.APPEND_SONG.addClass('show-action-popup');
                mediator.call(EVENTS.APPEND_SONG_HANDLER);
                popupAppendSongWrapperHandler();
                popupWrapHandler();
                break;
        }
    }

    // Слушатель событий клика на название страницы
    function pagesEventHandler() {
        $S.PAGES.RADIO.off('click').on('click', e => switchPages(PAGES.RADIO));
        $S.PAGES.SPEAKER.off('click').on('click', e => switchPages(PAGES.SPEAKER));
        $S.PAGES.PROFILE.off('click').on('click', e => switchPages(PAGES.PROFILE));
    }

    function buttonsEventHandler() {
        $S.BUTTONS.REGISTER.off('click').on('click', e => switchPopups(POPUPS.LOGIN_POPUP, $S.BUTTONS.REGISTER));
        $S.BUTTONS.LOGIN.off('click').on('click', e => {
            if (server.token) {
                mediator.call(EVENTS.LOGOUT);
                return;
            }
            switchPopups(POPUPS.LOGIN_POPUP, $S.BUTTONS.LOGIN)
        });
    }

    function init() {
        if (!server.token) {
            $S.PAGES.SPEAKER.addClass('speaker-active');
        }
        pagesEventHandler();
        buttonsEventHandler();
        mediator.subscribe(EVENTS.BUTTONS_EVENT_HANDLER, buttonsEventHandler);
        mediator.subscribe(EVENTS.SHOW_RADIO, switchPages);
        mediator.subscribe(EVENTS.SWITCH_POPUPS, switchPopups);
    }
    init();

}