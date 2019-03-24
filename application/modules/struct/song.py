class Song:
    id = None
    userId = None
    name = None
    url = None

    def __init__(self, options):
        self.id = options['id']
        self.userId = options['userId']
        self.name = options['name']
        self.url = options['url']

    def __str__(self):
        return "{ id: " + str(self.id) + ", userId: " + str(self.userId) + \
               ", name " + self.name + ", url: " + self.url + " }"

    def get(self):
        return {'id': self.id, 'userId': self.userId, 'name': self.name, 'url': self.url}
