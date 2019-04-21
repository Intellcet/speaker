function UI(options) {
    options = options instanceof Object ? options : {};

    const $SELECTORS = options.$SELECTORS;
    const PAGES = options.PAGES;
    const showPage = options.showPage instanceof Function ? options.showPage : () => {};

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    $SELECTORS.toRadio.off('click').on('click', e => showPage(PAGES.RADIO));
    $SELECTORS.toSpeaker.off('click').on('click', e => showPage(PAGES.SPEAKER));
    $SELECTORS.toUpload.off('click').on('click', e => showPage(PAGES.UPLOAD));

}