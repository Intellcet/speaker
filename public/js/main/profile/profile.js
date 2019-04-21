function Profile(options) {
    options = options instanceof Object ? options : {};

    const $SELECTORS = options.$SELECTORS;
    const PAGES = options.PAGES;

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    const server = options.server;

    $SELECTORS.uploadSongBtn.off('click').on('click', async e => {
        let file = $('#upload-song-value')[0].files[0];
        if (file.type === 'audio/mp3') {
            file = new FormData();
            file.append('file', $('#upload-song-value')[0].files[0]);
            const result = await server.uploadSong(file);
            if (result.error) {
                alert(result.error);
            } else {
                console.log(result.data);
            }
        }
    });

}