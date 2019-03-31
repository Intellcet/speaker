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
            ('GET', '/api/song/getAll/{token}', self.getAllSongsByUserId),  # Получить все песни пользователя
            ('POST', '/api/song/{token}', self.uploadSong),
            ('GET', '/api/song/{token}/{songId}', self.downloadSong),
            ('DELETE', '/api/song/{token}/{songId}', self.deleteSong),  # Удалить песню пользователя
            ('GET', '/api/song/playlist/{token}/{songId}/{playlistId}', self.addSongToPlaylist),  # Добавить песню в плейлист
            ('DELETE', '/api/song/playlist/{token}/{songId}/{playlistId}', self.removeSongFromPlaylist),  # Убрать песню из плейлиста
            # методы апи о плейлистах
            # Показать плейлисты пользователя
            # Показать конкретный плейлист
            # Добавить плейлист
            # Удалить плейлист

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

    def getAllSongsByUserId(self):
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

    def deleteSong(self, request):
        token = request.match_info.get('token')
        songId = request.match_info.get('songId')
        answer = self.mediator.get(self.TRIGGERS['DELETE_SONG'], { 'token': token, 'songId': songId })
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(3030))

    def addSongToPlaylist(self, request):
        token = request.match_info.get('token')
        songId = request.match_info.get('songId')
        playlistId = request.match_info.get('playlistId')
        answer = self.mediator.get(self.TRIGGERS['ADD_SONG_TO_PLAYLIST'],
                                   {'token': token, 'songId': songId, 'playlistId': playlistId})
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(3040))

    def removeSongFromPlaylist(self, request):
        token = request.match_info.get('token')
        songId = request.match_info.get('songId')
        playlistId = request.match_info.get('playlistId')
        answer = self.mediator.get(self.TRIGGERS['REMOVE_SONG_FROM_PLAYLIST'],
                                   {'token': token, 'songId': songId, 'playlistId': playlistId})
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(3050))
