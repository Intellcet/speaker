from .baseManager import BaseManager
from ..struct.user import User
from ..struct.song import Song
from ..struct.playlist import Playlist


class UserManager(BaseManager):

    users = {}

    def __init__(self, options):
        super().__init__(options)
