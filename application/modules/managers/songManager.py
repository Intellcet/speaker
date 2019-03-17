from .baseManager import BaseManager
from ..struct.song import Song
from ..struct.playlist import Playlist


class SongManager(BaseManager):

    def __init__(self, options):
        super().__init__(options)
        self.mediator.set(self.TRIGGERS['GET_USER_SONGS'], self.__getUserSongs)

    def __getUserSongs(self, data):
        if 'id' in data.keys():
            userId = data['id']
            songs = self.db.getUserSongs(userId)
            answer = list()
            for song in songs:
                answer.append(Song({'id': song['id'], 'userId': song['users_id'], 'name': song['name'], 'url': song['url']}))
            return answer
        return False
