import base64

from .baseManager import BaseManager
from ..struct.song import Song
from ..struct.playlist import Playlist


class SongManager(BaseManager):

    def __init__(self, options):
        super().__init__(options)
        self.mediator.set(self.TRIGGERS['GET_USER_SONGS'], self.getUserSongs)
        self.mediator.set(self.TRIGGERS['UPLOAD_SONG'], self.uploadSong)
        self.mediator.set(self.TRIGGERS['DOWNLOAD_SONG'], self.downloadSong)

    # Получить песни пользователя
    # data = { id }
    def getUserSongs(self, data):
        if 'id' in data.keys():
            userId = data['id']
            songs = self.db.getUserSongs(userId)
            answer = list()
            for song in songs:
                answer.append(Song({'id': song['id'], 'userId': song['users_id'], 'name': song['name'], 'url': song['url']}))
            return answer
        return False

    # Выгрузить песню на сервер
    # data = { data = { file }, token }
    def uploadSong(self, data):
        song = data['data']['file']
        token = data['token']
        if song.content_type == 'audio/mpeg':
            filename = song.filename
            iofile = song.file
            content = iofile.read()
            users = self.mediator.get(self.TRIGGERS['GET_USERS'])
            if token in users.keys():
                user = users[token]
                if user:
                    username = user.login
                    filepath = self.path + username + "/" + filename
                    file = open(filepath, 'wb')
                    file.write(content)
                    file.close()
                    result = self.db.addSong(user.id, filename, filepath)
                    if result:
                        user.songs.append(Song({ 'id': result['id'], 'userId': result['users_id'],
                                                 'name': result['name'], 'url': result['url'] }))
                        return True
        return False

    # Выгрузка песни на клиент
    # data = { token, songId }
    def downloadSong(self, data):
        token = data['token']
        songId = data['songId']
        users = self.mediator.get(self.TRIGGERS['GET_USERS'])
        if token in users.keys():
            user = users[token]
            if user:
                song = self.db.getSongById(songId)
                if song:
                    songUrl = song['url']
                    with open(songUrl, 'rb') as f:  # открываем файл с песней
                        data = base64.b64encode(bytearray(f.read()))  # кодируем в бинарник
                        return data.decode('utf-8')  # декодируем в utf-8
        return False
