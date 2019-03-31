class Playlist:

    id = None
    userId = None
    name = None
    songs = None

    def __init__(self, options):
        self.id = options['id']
        self.userId = options['userId']
        self.name = options['name']
        self.songs = options['songs']

    def __str__(self):
        return "{ id: " + str(self.id) + ", userId: " + str(self.userId) + \
               ", name " + self.name + ", songs: " + str(self.songs) + " }"

    def get(self):
        return { 'id': self.id, 'userId': self.userId, 'name': self.name, 'songs': self.songs }
