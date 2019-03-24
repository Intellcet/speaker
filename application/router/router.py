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
            # методы апи о юзерах
            ('GET', '/api/user/login/{login}/{password}/{rnd}', self.login),
            ('GET', '/api/user/logout/{token}', self.logout),
            ('POST', '/api/user', self.register),
            # методы апи о песнях
            ('GET', '/api/song/getAll/{token}', self.getAllSongs),
            ('POST', '/api/song/{token}', self.uploadSong),
            ('GET', '/api/song/{token}/{songId}', self.downloadSong)
        ]
        app.router.add_static('/music/', path=str('./public/music/'))
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
        token = request.match_info.get('token')
        answer = self.mediator.get(self.TRIGGERS['LOGOUT'], { 'token': token })
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(2010))

    async def register(self, request):
        data = await request.json()
        answer = self.mediator.get(self.TRIGGERS['REGISTER'], { 'login': data['login'], 'password': data['password'] })
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(2020))

    def getAllSongs(self):
        return

    async def uploadSong(self, request):
        request._client_max_size = 1024**2 * 15  # 15MB max size
        data = await request.post()
        token = request.match_info.get('token')
        answer = self.mediator.get(self.TRIGGERS['UPLOAD_SONG'], { 'data': data, 'token': token })
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(3010))

    def downloadSong(self, request):
        token = request.match_info.get('token')
        songId = request.match_info.get('songId')
        answer = self.mediator.get(self.TRIGGERS['DOWNLOAD_SONG'], { 'token': token, 'songId': songId })
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(3020))
