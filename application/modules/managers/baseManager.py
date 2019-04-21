class BaseManager:
    db = None
    mediator = None
    TRIGGERS = None
    EVENTS = None
    path = None  # путь к корню песен
    music = None

    def __init__(self, params):
        self.mediator = params['mediator']
        self.db = params['db']
        self.TRIGGERS = self.mediator.getTriggers()
        self.EVENTS = self.mediator.getEvents()
        self.path = params['pathToMusic']
        self.music = params['music']
