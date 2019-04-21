function Speaker(options) {
    options = options instanceof Object ? options : {};

    const $SELECTORS = options.$SELECTORS;
    const PAGES = options.PAGES;

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    const server = options.server;

    function buttonsHandler() {
        $('.playBtn').off('click').on('click', function (e) {
            const id = this.dataset.id;
            if (id) {
                server.playSong({id});
            }
        });
        $('.stopBtn').off('click').on('click', function (e) {
            const id = this.dataset.id;
            if (id) {
                server.stopSong({id});
            }
        });
    }

    function createListElems(songs) {
        let str = '';
        for (let song of songs) {
            str += `<li class="speaker-list-elem"><span class="song-name">${song.name}</span>` +
                    `<button class="playBtn" data-id="${song.id}">Play</button>` +
                    `<button class="stopBtn" data-id="${song.id}">Stop</button></li>`
        }
        return str;
    }

    async function fillList() {
        const result = await server.getSongs();
        if (!result.error) {
            const list = $('.speaker-list');
            list.empty().append(createListElems(result.data));
            buttonsHandler();
        }
    }

    function init() {
        fillList();
    }
    init();

}