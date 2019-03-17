from .baseManager import BaseManager
from ..struct.song import Song
from ..struct.playlist import Playlist


class PlaylistManager(BaseManager):

    def __init__(self, options):
        super().__init__(options)
