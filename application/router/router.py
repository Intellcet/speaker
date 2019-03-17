from .apiAnswer import ApiAnswer


class Router:

    web = None
    api = None

    def __init__(self, app, web, mediator):
        self.web = web
        self.api = ApiAnswer()
        self.mediator = mediator
        self.TYPES = mediator.getEvents()
        self.TRIGGERS = mediator.getTriggers()
        routes = [
            ('*', '/', self.staticHandler),
            ('GET', '/api/user/login/{login}/{password}/{rnd}', self.login),
            ('GET', '/api/user/logout/{token}', self.logout),
            ('POST', '/api/user', self.register)
        ]
        app.router.add_static('/css/', path=str('./public/css/'))
        app.router.add_static('/js/', path=str('./public/js/'))
        for route in routes:
            app.router.add_route(route[0], route[1], route[2])

    def staticHandler(self, request):
        return self.web.FileResponse('./public/index.html')

    def login(self, request):
        login = request.match_info.get('login')
        password = request.match_info.get('password')
        rnd = request.match_info.get('rnd')
        answer = self.mediator.get(self.TRIGGERS['LOGIN'], { 'login': login, 'password': password, 'rnd': rnd })
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(2010))

    def logout(self, request):
        return

    def register(self, request):
        return
