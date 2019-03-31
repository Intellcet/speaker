from .baseManager import BaseManager
from ..struct.song import Song
from ..struct.playlist import Playlist


class PlaylistManager(BaseManager):

    def __init__(self, options):
        super().__init__(options)
        self.mediator.set(self.TRIGGERS['GET_USER_PLAYLISTS'], self.__getUserPlaylists)
        self.mediator.set(self.TRIGGERS['GET_PLAYLIST'], self.getPlaylist)
        self.mediator.set(self.TRIGGERS['ADD_PLAYLIST'], self.addPlaylist)
        self.mediator.set(self.TRIGGERS['DELETE_PLAYLIST'], self.deletePlaylist)

    def __getUserPlaylists(self, data):
        if 'id' in data.keys():
            userId = data['id']
            playlists = self.db.getUserPlaylists(userId)
            answer = list()
            for playlist in playlists:
                songs = self.db.getSongsByPlaylistId(playlist['id'])
                for song in songs:
                    song = Song({ 'id': song['id'], 'userId': song['users_id'], 'name': song['name'], 'url': song['url'] })
                answer.append(Playlist({ 'id': playlist['id'], 'userId': playlist['users_id'],
                                         'name': playlist['name'], 'songs': songs }))
            return answer
        return False

    # Получить плейлист
    # data = { token, playlistId }
    def getPlaylist(self, data):
        token = data['token']
        playlistId = int(data['playlistId'])
        users = self.mediator.get(self.TRIGGERS['GET_USERS'])
        if token in users.keys():
            user = users[token]
            if user:
                for playlist in user.playlists:
                    if playlist.id == playlistId:
                        return playlist.get()
        return False

    # Добавить плейлист
    # data = { token, name }
    def addPlaylist(self, data):
        token = data['token']
        name = data['name']
        users = self.mediator.get(self.TRIGGERS['GET_USERS'])
        if token in users.keys():
            user = users[token]
            if user:
                for playlist in user.playlists:
                    if playlist.name == name:
                        return False
                self.db.addPlaylist(user.id, name)
                return True
        return False

    # Удалить плейлист
    # data = { token, playlistId }
    def deletePlaylist(self, data):
        token = data['token']
        playlistId = int(data['playlistId'])
        users = self.mediator.get(self.TRIGGERS['GET_USERS'])
        if token in users.keys():
            user = users[token]
            if user:
                for playlist in user.playlists:
                    if playlist.id == playlistId:
                        self.db.deletePlaylist(playlistId)
                        user.playlists.remove(playlist)
                        return True
        return False
