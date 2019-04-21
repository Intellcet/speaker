$(document).ready(() => {

    const $SELECTORS = {
        authBlock: $('.auth-block'), loginBlock: $('.auth-login-container'), registerBlock: $('.auth-register-container'),
        mainBlock: $('.main-block'), uploadBlock: $('.main-upload-block'), radioBlock: $('.main-radio-block'),
        speakerBlock: $('.main-speaker-block'), toUpload: $('.main-to-upload'), toRadio: $('.main-to-radio'), toSpeaker: $('.main-to-speaker'),
        login: $('#login'), password: $('#password'), loginBtn: $('#loginBtn'), toRegisterBtn: $('#toRegister'),
        uploadSongValue: $('#upload-song-value'), uploadSongBtn: $('.upload-song-btn'),
        playRadioBtn: $('.play-radio-btn'),
    };

    const PAGES = SETTINGS.PAGES;

    function showPage(page) {
        $SELECTORS.authBlock.hide();
        $SELECTORS.loginBlock.hide();
        $SELECTORS.registerBlock.hide();
        $SELECTORS.mainBlock.hide();
        $SELECTORS.uploadBlock.hide();
        $SELECTORS.radioBlock.hide();
        $SELECTORS.speakerBlock.hide();
        switch (page) {
            case PAGES.LOGIN:
                $SELECTORS.authBlock.show();
                $SELECTORS.loginBlock.show();
            break;
            case PAGES.REGISTER:
                $SELECTORS.authBlock.show();
                $SELECTORS.registerBlock.show();
            break;
            case PAGES.MAIN:
                $SELECTORS.mainBlock.show();
            break;
            case PAGES.SPEAKER:
                $SELECTORS.mainBlock.show();
                $SELECTORS.speakerBlock.show();
            break;
            case PAGES.RADIO:
                $SELECTORS.mainBlock.show();
                $SELECTORS.radioBlock.show();
            break;
            case PAGES.UPLOAD:
                $SELECTORS.mainBlock.show();
                $SELECTORS.uploadBlock.show();
            break;
        }
    }

    // button.addEventListener("click", async e => {
    //     const data = await $.get(`${url}song/${token}/21`);
    //     audio.src = `data:audio/mp3;base64,${data.data}`;
    //     audio.play().catch(e => console.log(e));
    //     setInterval(() => {
    //         console.log({buf: audio.duration, ctime: audio.currentTime});
    //     }, 10000);
    //     button.style.backgroundColor = "#0f0";
    // });

    const mediator = new Mediator({...SETTINGS.MEDIATOR});
    const server = new Server({...SETTINGS});

    new Login({$SELECTORS, server, ...SETTINGS, mediator, showPage});
    new UI({$SELECTORS, server, ...SETTINGS, mediator, showPage});


    //showPage(PAGES.LOGIN);

});
