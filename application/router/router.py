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
            ('GET', '/api/user/{token}', self.getUser),
            # методы апи о песнях
            ('GET', '/api/song/get/{token}', self.getSongs),  # Получить список песен
            ('GET', '/api/song/{token}/{songId}', self.playSong),  # Воспроизвести песню на колонке
            ('GET', '/api/song/pause/{token}/{songId}', self.pauseSong),  # Приостановить песню на колонке
            ('GET', '/api/song/resume/{token}/{songId}', self.resumeSong),  # Возобновить песню на колонке
            ('GET', '/api/song/stop/{token}/{songId}', self.stopSong),  # Остановить песню на колонке
            ('POST', '/api/song/{token}', self.uploadSong),  # Выгрузить песню
            ('GET', '/api/song/{token}/{songId}', self.downloadSong),  # Воспроизвести песню
            ('DELETE', '/api/song/{token}/{songId}', self.deleteSong),  # Удалить песню пользователя
            ('GET', '/api/song/playlist/{token}/{songId}/{playlistId}', self.addSongToPlaylist),  # Добавить песню в плейлист
            ('DELETE', '/api/song/playlist/{token}/{songId}/{playlistId}', self.removeSongFromPlaylist),  # Убрать песню из плейлиста
            # методы апи о плейлистах
            ('GET', '/api/playlist/{token}/{playlistId}', self.getPlaylist),  # Показать конкретный плейлист
            ('GET', '/api/playlist/add/{token}/{name}', self.addPlaylist),  # Добавить плейлист
            ('DELETE', '/api/playlist/{token}/{playlistId}', self.deletePlaylist),  # Удалить плейлист

        ]
        app.router.add_static('/music/', path=str('./public/music/'))
        app.router.add_static('/css/', path=str('./public/css/'))
        app.router.add_static('/js/', path=str('./public/js/'))
        for route in routes:
            app.router.add_route(route[0], route[1], route[2])

    def staticHandler(self, request):
        return self.web.FileResponse('./public/index.html')

    def getUser(self, request):
        token = request.match_info.get('token')
        answer = self.mediator.get(self.TRIGGERS['GET_USER_DATA'], {'token': token})
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(2010))

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
        data = await request.post()
        answer = self.mediator.get(self.TRIGGERS['REGISTER'], { 'login': data['login'], 'password': data['password'] })
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(2020))

    def getSongs(self, request):
        token = request.match_info.get('token')
        answer = self.mediator.get(self.TRIGGERS['GET_SONGS'], { 'token': token })
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(3005))

    def playSong(self, request):
        token = request.match_info.get('token')
        songId = request.match_info.get('songId')
        answer = self.mediator.get(self.TRIGGERS['PLAY_SONG'], { 'token': token, 'songId': songId })
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(5010))

    def pauseSong(self, request):
        token = request.match_info.get('token')
        songId = request.match_info.get('songId')
        answer = self.mediator.get(self.TRIGGERS['PAUSE_SONG'], {'token': token, 'songId': songId})
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(5020))

    def resumeSong(self, request):
        token = request.match_info.get('token')
        songId = request.match_info.get('songId')
        answer = self.mediator.get(self.TRIGGERS['RESUME_SONG'], { 'token': token, 'songId': songId })
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(5030))

    def stopSong(self, request):
        token = request.match_info.get('token')
        songId = request.match_info.get('songId')
        answer = self.mediator.get(self.TRIGGERS['STOP_SONG'], { 'token': token, 'songId': songId })
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(5040))

    async def uploadSong(self, request):
        request._client_max_size = 1024**2 * 15  # 15MB max size
        data = await request.post()
        token = request.match_info.get('token')
        answer = self.mediator.get(self.TRIGGERS['UPLOAD_SONG'], { 'file': data['file'], 'token': token })
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

    def getPlaylist(self, request):
        token = request.match_info.get('token')
        playlistId = request.match_info.get('playlistId')
        answer = self.mediator.get(self.TRIGGERS['GET_PLAYLIST'], {'token': token, 'playlistId': playlistId})
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(4010))

    def addPlaylist(self, request):
        token = request.match_info.get('token')
        name = request.match_info.get('name')
        answer = self.mediator.get(self.TRIGGERS['ADD_PLAYLIST'], {'token': token, 'name': name})
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(4020))

    def deletePlaylist(self, request):
        token = request.match_info.get('token')
        playlistId = request.match_info.get('playlistId')
        answer = self.mediator.get(self.TRIGGERS['DELETE_PLAYLIST'], {'token': token, 'playlistId': playlistId})
        if answer:
            return self.web.json_response(self.api.answer(answer))
        return self.web.json_response(self.api.error(4030))
