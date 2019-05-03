import sqlite3


class DB:

    conn = None

    @staticmethod
    def dictFactory(cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def __init__(self, settings):
        self.conn = sqlite3.connect(settings['PATH'], check_same_thread=False)
        self.conn.row_factory = self.dictFactory
        self.c = self.conn.cursor()

    def __del__(self):
        self.conn.close()

    def getUserByLogin(self, login):
        query = 'SELECT * FROM users WHERE login=:login'
        self.c.execute(query, {'login': login})
        return self.c.fetchone()

    def getUserIdByToken(self, token):
        query = 'SELECT id FROM users WHERE token=:token'
        self.c.execute(query, { 'token': token })
        return self.c.fetchone()

    def getUsers(self):
        query = 'SELECT * FROM users'
        self.c.execute(query)
        return self.c.fetchall()

    def setToken(self, id, token=None):
        query = 'UPDATE users SET token=:token WHERE id=:id'
        self.c.execute(query, { 'token': token, 'id': id })
        self.conn.commit()

    def register(self, login, password):
        query = 'INSERT INTO users (login, password) VALUES (:login, :password)'
        try:
            self.c.execute(query, { 'login': login, 'password': password })
            self.conn.commit()
        except sqlite3.IntegrityError:
            return False
        return self.getUserByLogin(login)

    def getSongs(self):
        query = "SELECT * FROM songs LIMIT 20 OFFSET 0"
        self.c.execute(query)
        return self.c.fetchall()

    def getUserSongs(self, id):
        query = "SELECT * FROM songs WHERE users_id=:id"
        self.c.execute(query, { 'id': id })
        return self.c.fetchall()

    def getUserPlaylists(self, id):
        query = "SELECT * FROM playlists WHERE users_id=:id"
        self.c.execute(query, { 'id': id })
        return self.c.fetchall()

    def getSongsByPlaylistId(self, id):
        query = "SELECT songs.id, songs.name, songs.users_id, songs.url FROM songs " \
                "JOIN songs_in_playlists ON (songs_in_playlists.playlists_id=:id AND songs_in_playlists.songs_id=songs.id)"
        self.c.execute(query, {'id': id})
        return self.c.fetchall()

    def getSongByName(self, url):
        query = "SELECT * FROM songs WHERE url = :url"
        self.c.execute(query, {'url': url})
        return self.c.fetchone()

    def getAllSongs(self):
        query = "SELECT * FROM songs"
        self.c.execute(query)
        return self.c.fetchall()

    def addSong(self, userId, name, url):
        query = "INSERT INTO songs (users_id, name, url) VALUES (:userId, :name, :url)"
        try:
            self.c.execute(query, {'userId': userId, 'name': name, 'url': url })
            self.conn.commit()
        except sqlite3.IntegrityError:
            return False
        return self.getSongByName(url)

    def getSongById(self, songId):
        query = "SELECT * FROM songs WHERE songs.id = :songId"
        self.c.execute(query, { 'songId': songId })
        return self.c.fetchone()

    def deleteSong(self, songId):
        query = "DELETE FROM songs_in_playlists WHERE songs_id = :songId"
        self.c.execute(query, {'songId': songId})
        query = "DELETE FROM songs WHERE id = :songId"
        self.c.execute(query, {'songId': songId})
        self.conn.commit()
        return True

    def getPlaylistById(self, playlistId):
        query = "SELECT * FROM playlists WHERE id = :playlistId"
        self.c.execute(query, { 'playlistId': playlistId })
        return self.c.fetchone()

    def addSongToPlaylist(self, playlistId, songId):
        query = "SELECT * FROM songs_in_playlists WHERE playlists_id = :playlistId AND songs_id = :songId"
        self.c.execute(query, {'playlistId': playlistId, 'songId': songId})
        if self.c.fetchone():
            return False
        query = "INSERT INTO songs_in_playlists (playlists_id, songs_id) VALUES (:playlistId, :songId)"
        self.c.execute(query, {'playlistId': playlistId, 'songId': songId})
        self.conn.commit()
        return True

    def removeSongFromPlaylist(self, playlistId, songId):
        query = "DELETE FROM songs_in_playlists WHERE playlists_id = :playlistId AND songs_id = :songId"
        self.c.execute(query, {'playlistId': playlistId, 'songId': songId})
        self.conn.commit()
        return True

    def addPlaylist(self, userId, name):
        query = "INSERT INTO playlists (users_id, name) VALUES (:userId, :name)"
        self.c.execute(query, {'userId': userId, 'name': name})
        self.conn.commit()
        return True

    def deletePlaylist(self, playlistId):
        query = "DELETE FROM songs_in_playlists WHERE playlists_id = :playlistId"
        self.c.execute(query, { 'playlistId': playlistId })
        query = "DELETE FROM playlists WHERE id = :playlistId"
        self.c.execute(query, {'playlistId': playlistId})
        self.conn.commit()
        return True
