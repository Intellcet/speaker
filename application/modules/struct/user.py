class User:

    id = None
    login = None
    password = None
    token = None
    isUsing = False
    songs = None
    playlists = None

    def __init__(self, options):
        self.id = options["id"]
        self.login = options["login"]
        self.password = options["password"]
        self.token = options["token"]
        self.songs = options["songs"]
        self.playlists = options["playlists"]

    def __str__(self):
        return "{id: " + str(self.id) + ", login: " + self.login + ", password: " + self.password + \
               ", token: " + str(self.token) + ", songs: " + str(self.songs) + ", playlists: " + str(self.playlists) + "}"

    def get(self):
        return {"id": self.id, "login": self.login, "password": self.password, "token": self.token,
                "songs": self.songs, "playlists": self.playlists}
