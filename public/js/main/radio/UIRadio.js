function UIRadio(options) {

    options = options instanceof Object ? options : {};

    const $S = options.$SELECTORS;

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    let user = null;

    function disablePlayerButtons() {
        $S.PLAYER.NEXT_SONG.off('click');
        $S.PLAYER.PREV_SONG.off('click');
        $S.PLAYER.MARKER.off('mousemove');
    }

    function historyHandler() {
        $('.content-row-like').off('click').on('click', async function () {
            const isLiked = this.dataset.liked;
            const songId = $(this).parent('div').data('id');
            if (isLiked === 'false') {
                const result = await mediator.get(TRIGGERS.ADD_SONG_TO_FAVORITE, songId);
                if (result && !result.error) {
                    $($(this).children('path')[2]).css('fill', '#5ab3b8');
                    this.dataset.liked = true;
                    mediator.call(EVENTS.USER_UPDATED);
                }
            } else {
                const result = await mediator.get(TRIGGERS.DELETE_SONG_FROM_FAVORITE, songId);
                if (result && !result.error) {
                    $($(this).children('path')[2]).css('fill', '#fff');
                    this.dataset.liked = false;
                    mediator.call(EVENTS.USER_UPDATED);
                }
            }
        });
    }

    async function fillRadioHistory() {
        const result = await mediator.get(TRIGGERS.GET_RADIO_HISTORY);
        if (result && !result.error) {
            const history = result.data;
            $S.RADIO.RADIO_CONTAINER.empty();
            if (history && history.length) {
                for (const song of history) {
                    const row = `<div class="content-row" data-id="${song.id}">
                                    <p class="content-row-elem content-row-name">${song.name}</p>
                                    <svg version="1.1" class="content-row-elem content-row-like" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                width="0" height="0" viewBox="0 0 100 100" xml:space="preserve" data-liked="${mediator.get(TRIGGERS.IS_SONG_LIKED, song.id)}">
                                               <path class="like-svg" d="M94.5,35.5"></path>
                                               <path class="like-svg" d="M118.5,38.5"></path>
                                               <path class="like-svg" style="${(mediator.get(TRIGGERS.IS_SONG_LIKED, song.id)) ? "fill: #5ab3b8" : "fill: #fff"}" d="M92,17.2c-0.1-0.1-0.2-0.2-0.3-0.3c-0.1-0.1-0.2-0.2-0.2-0.2c0,0,0,0,0,0C87.1,12.6,81.2,10,74.7,10
                                                   c-13.4,0-24.3,10.9-24.3,24.3c0,0.2,0,0.5,0,0.7l0,0l0,0c0-0.2,0-0.4,0-0.7C50.5,20.9,39.6,10,26.2,10c-6.5,0-12.4,2.6-16.8,6.7
                                                   c0,0,0,0,0,0c-0.1,0.1-0.2,0.2-0.2,0.2c-0.1,0.1-0.2,0.2-0.3,0.3C-19.5,44.8,43.8,90,50,94.3c0.1,0,0.2,0,0.4,0c0,0,0.1,0,0.1,0
                                                   c0.2,0,0.3,0,0.5,0C57,90.1,120.4,44.8,92,17.2z"></path>
                                    </svg>
                                 </div>`;
                    $S.RADIO.RADIO_CONTAINER.prepend(row);
                }
                historyHandler();
            }
        }
    }

    function init() {
        disablePlayerButtons();
        fillRadioHistory();
        mediator.subscribe(EVENTS.UPDATE_RADIO_HISTORY, fillRadioHistory)
    }
    init();

}