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
        self.conn = sqlite3.connect(settings['PATH'])
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
