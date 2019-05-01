function Register(options) {

    options = options instanceof Object ? options : {};

    const $S = options.$SELECTORS;
    const PAGES = options.PAGES;

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    const server = options.server;

    function registerHandler() {
        $S.LOGIN.LABEL.hide();
        $S.LOGIN.SIGN_IN.off('click').on('click', async e => {
            const login = $S.LOGIN.LOGIN.val();
            const password = $S.LOGIN.PASSWORD.val();
            if (login && password) {
                const data = new FormData();
                data.append('login', login);
                data.append('password', password);
                const result = await server.register(data);
                if (!result.error) {
                    $S.LOGIN.MSG.empty().append('Вы успешно зарегистрировались! Нажмите где-нибудь для закрытия.');
                    $S.LOGIN.LOGIN.val('');
                    $S.LOGIN.PASSWORD.val('');
                    setTimeout(() => $S.LOGIN.MSG.empty(), 2000);
                    return;
                }
                $S.LOGIN.MSG.empty().append('Пользователь с таким логином уже существует! Придумайте другой.');
                setTimeout(() => $S.LOGIN.MSG.empty(), 2000);
                return;
            }
            $S.LOGIN.MSG.empty().append('Не введены логин и(или) пароль!');
            setTimeout(() => $S.LOGIN.MSG.empty(), 2000);
        });
    }

    function init() {
        mediator.subscribe(EVENTS.REGISTER_EVENT_HANDLER, registerHandler)
    }
    init();
}