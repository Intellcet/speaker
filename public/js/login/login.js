/**
 * Конструктор для инкапсуляции логики входа в систему
 * @param options параметры с которыми вызывается конструктор
 */

function Login(options) {

    options = options instanceof Object ? options : {};

    const $SELECTORS = options.$SELECTORS;
    const PAGES = options.PAGES;
    const showPage = options.showPage instanceof Function ? options.showPage : () => {};

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    const server = options.server;

    $SELECTORS.loginBtn.off('click').on('click', async e => {
        let loginText = $SELECTORS.login.val();
        let passwordText = $SELECTORS.password.val();
        const rnd = Math.round(Math.random() * 10000);
        let p = md5(md5(loginText + passwordText) + rnd);
        const result = await server.login({login: loginText, password: p, rnd: rnd});
        console.log(result);
        if (!result.error) {
            server.token = result.data.token;
            showPage(PAGES.MAIN);
            new Profile(options);
            new Speaker(options);
        }
    });

}