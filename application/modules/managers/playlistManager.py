from .baseManager import BaseManager
from ..struct.song import Song
from ..struct.playlist import Playlist


class PlaylistManager(BaseManager):

    def __init__(self, options):
        super().__init__(options)
        self.mediator.set(self.TRIGGERS['GET_USER_PLAYLISTS'], self.__getUserPlaylists)

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
