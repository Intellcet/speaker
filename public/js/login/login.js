/**
 * Конструктор для инкапсуляции логики входа в систему
 * @param options параметры с которыми вызывается конструктор
 */

function Login(options) {

    options = options instanceof Object ? options : {};

    const $S = options.$SELECTORS;
    const PAGES = options.PAGES;

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    const server = options.server;

    function logoutHandler() {
        $S.BUTTONS.LOGIN.off('click').on('click', async e => {
            const result = await server.logout();
            if (!result.error) {
                server.token = null;
                $S.BUTTONS.LOGIN.html('Войти');
                $S.BUTTONS.REGISTER.show();
                $S.PAGES.SPEAKER.addClass('speaker-active'); // Открываем доступ к колонке
                mediator.call(EVENTS.BUTTONS_EVENT_HANDLER);
                mediator.call(EVENTS.SHOW_RADIO, PAGES.RADIO);
                mediator.call(EVENTS.USER_UPDATED);
            }
        });
    }

    function loginHandler() {
        $S.LOGIN.LABEL.hide(); /*label for checkbox*/
        $S.LOGIN.SIGN_IN.off('click').on('click', async e => {
            const login = $S.LOGIN.LOGIN.val();
            const password = $S.LOGIN.PASSWORD.val();
            if (login && password) {
                const rnd = Math.floor(Math.random() * 10000);
                const hash = md5(md5(login + password) + rnd);
                const result = await server.login({login, password: hash, rnd});
                if (!result.error) {
                    server.token = result.data.token;
                    $S.LOGIN.MSG.empty().append('Вы успешно авторизовались! Нажмите где-нибудь для закрытия.');
                    $S.LOGIN.LOGIN.val('');
                    $S.LOGIN.PASSWORD.val('');
                    $S.PAGES.SPEAKER.removeClass('speaker-active'); // Открываем доступ к колонке
                    logoutHandler();
                    mediator.call(EVENTS.LOGGED_IN, result.data);
                    mediator.call(EVENTS.USER_UPDATED);
                    setTimeout(() => $S.LOGIN.MSG.empty(), 2000);
                    return;
                }
                $S.LOGIN.MSG.empty().append('Неверный логин и(или) пароль!');
                setTimeout(() => $S.LOGIN.MSG.empty(), 2000);
                return;
            }
            $S.LOGIN.MSG.empty().append('Не введены логин и(или) пароль!');
            setTimeout(() => $S.LOGIN.MSG.empty(), 2000);
        });
    }

    function init() {
        mediator.subscribe(EVENTS.LOGIN_EVENT_HANDLER, loginHandler);
    }
    init();
}