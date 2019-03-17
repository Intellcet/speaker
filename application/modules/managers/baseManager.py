class BaseManager:
    db = None
    mediator = None
    TRIGGERS = None
    EVENTS = None

    def __init__(self, params):
        self.mediator = params['mediator']
        self.db = params['db']
        self.TRIGGERS = self.mediator.getTriggers()
        self.EVENTS = self.mediator.getEvents()
