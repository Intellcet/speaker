class Song:
    id = None
    userId = None
    name = None
    url = None

    def __init__(self, options):
        id = options['id']
        userId = options['id']
        name = options['name']
        url = options['url']

    def __str__(self):
        return "{ id: " + str(self.id) + ", userId: " + str(self.userId) + \
               ", name " + self.name + ", url: " + self.url + " }"

    def get(self):
        return {'id': self.id, 'userId': self.userId, 'name': self.name, 'url': self.url}
