function Radio(options) {

    options = options instanceof Object ? options : {};

    const $S = options.$SELECTORS;

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    const server = options.server;

    let uiRadio = null;
    let changeVolume = false;

    let timestampIntervalId = null;

    let user = null;
    const audio = new Audio();
    let currentVolume = null;

    function radioHandler() {
        user = mediator.get(TRIGGERS.GET_USER);
        uiRadio = null;
        uiRadio = new UIRadio(options);
    }

    function getRadioHistory() {
        return server.getRadioHistory();
    }

    function moveVolumeMarker(position) {
        const elemWidth = $S.PLAYER.VOLUME_BAR.innerWidth();
        let posX = 100 *  position / elemWidth;
        if (posX >= 100) {
            posX = 100;
        }
        if (posX < 0) {
            posX = 0;
        }
        $S.PLAYER.VOLUME.css('transform', `scaleX(${posX / 100})`);
        $S.PLAYER.VOLUME_MARKER.css('left', `calc(${posX}% - 10px)`);
        currentVolume = posX / 100;
    }

    /**
     * Обработчик громкости
     */
    function volumeHandler(song) {
        $S.PLAYER.VOLUME_MARKER.off('mousedown touchstart').on('mousedown touchstart', () => changeVolume = true);
        $S.PLAYER.VOLUME_BAR.off('mouseup touchend').on('mouseup touchend', () => {
            changeVolume = false;
            audio.volume = currentVolume;
        });
        $S.PLAYER.VOLUME_BAR.off('mousemove touchmove').on('mousemove touchmove', e => {
            if (changeVolume) {
                const clientX = (e.originalEvent.changedTouches) ? e.originalEvent.changedTouches[0].clientX : e.originalEvent.clientX;
                moveVolumeMarker(clientX - $S.PLAYER.VOLUME_BAR.position().left);
            }
        });
    }

    function fillAboutSong(song) {
        $S.PLAYER.SONG_NAME.empty().append(song.name.split(' - ')[1].split('.')[0]);
        $S.PLAYER.PERFORMER.empty().append(song.name.split(' - ')[0]);
        $($('.like-playing-song-svg').children('path')[2]).css('fill', `${(mediator.get(TRIGGERS.IS_SONG_LIKED, song.id)) ? "#5ab3b8" : "#fff"}`)
    }

    function fillTimestamp() {
        let minutes = parseInt(audio.duration / 60, 10);
        let seconds = parseInt(audio.duration % 60);
        const duration = `${minutes ? minutes : '0'}:${seconds ? (seconds < 10 ? '0' + seconds : seconds) : '00'}`;
        minutes = parseInt(audio.currentTime / 60, 10);
        seconds = parseInt(audio.currentTime % 60);
        const currentTime = `${minutes ? minutes : '0'}:${seconds ? (seconds < 10 ? '0' + seconds : seconds) : '00'}`;
        $S.PLAYER.TIMESTAMP.empty().append(`${currentTime} / ${duration}`);
    }

    function fillProgress() {
        const currentPosition = 100 * audio.currentTime / audio.duration;
        $S.PLAYER.PROGRESS.css('transform', `scaleX(${currentPosition / 100})`);
        $S.PLAYER.MARKER.css('left', `calc(${currentPosition}% - 30px)`);
    }

    function timestampIntervalHandler() {
        if (audio.currentTime >= audio.duration) {
            clearInterval(timestampIntervalId);
            getCurrentSong(true);
            mediator.call(EVENTS.UPDATE_RADIO_HISTORY);
        }
        fillTimestamp(audio);
        fillProgress(audio);
    }

    function fillProgressBar() {
        fillTimestamp();
        timestampIntervalHandler();
        timestampIntervalId = setInterval(timestampIntervalHandler, 250);
    }

    function likeHandler(song) {
        if (user) {
            const _song = user.playlists.find(p => p.name === 'favorite').songs.find(s => s.id === song.id);
            $S.PLAYER.LIKE[0].dataset.liked = (_song) ? 'true' : 'false';
            $S.PLAYER.LIKE.off('click').on('click', async function () {
                const isLiked = this.dataset.liked;
                if (isLiked === 'false') {
                    //like
                    const result = await mediator.get(TRIGGERS.ADD_SONG_TO_FAVORITE, song.id);
                    if (result && !result.error) {
                        $($(this).children('path')[2]).css('fill', '#5ab3b8');
                        this.dataset.liked = true;
                        mediator.call(EVENTS.USER_UPDATED);
                    }
                } else {
                    //unlike
                    const result = await mediator.get(TRIGGERS.DELETE_SONG_FROM_FAVORITE, song.id);
                    if (result && !result.error) {
                        $($(this).children('path')[2]).css('fill', '#fff');
                        this.dataset.liked = false;
                        mediator.call(EVENTS.USER_UPDATED);
                    }
                }
            });
        }
    }

    function playHandler(song, flag = false) {
        let isPlaying = false;
        if (flag) {
            isPlaying = true;
            audio.play();
        }
        $S.PLAYER.MAIN_BTN.off('click').on('click', () => {
            if (!isPlaying) {
                audio.play();
                isPlaying = true;
                fillProgressBar();
                $S.PLAYER.MAIN_BTN.empty().html(`<image class="main-btn-image"  x="0px" y="0px" width="0px" height="0px"  xlink:href="data:img/png;base64,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"></image>`);
            } else {
                audio.pause();
                isPlaying = false;
                clearInterval(timestampIntervalId);
                $S.PLAYER.MAIN_BTN.empty().html(`<image class="main-btn-image" x="0px" y="0px" width="0px" height="0px" xlink:href="data:img/png;base64,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"/>`);
            }
        });
        fillAboutSong(song);
        volumeHandler();
        likeHandler(song);
    }

    async function getCurrentSong(flag) {
        const result = await server.getCurrentSong();
        if (result && !result.error) {
            const song = result.data.song;
            audio.src = `data:audio/mp3;base64,${result.data.data}`;
            playHandler(song, flag);
        }
    }

    function init() {
        uiRadio = new UIRadio(options);
        mediator.subscribe(EVENTS.RADIO_HANDLER, radioHandler);
        mediator.set(TRIGGERS.GET_RADIO_HISTORY, getRadioHistory);
        mediator.set(TRIGGERS.GET_CURRENT_RADIO_SONG, () => audio);
        getCurrentSong();
    }
    init();

}