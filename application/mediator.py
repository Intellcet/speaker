class Mediator:
    EVENTS = {}  # типы событий
    events = {}  # списки событий
    TRIGGERS = {}  # типы триггеров
    triggers = {}  # список триггеров

    def __init__(self, types):
        self.EVENTS = types['EVENTS']
        self.TRIGGERS = types['TRIGGERS']
        for key in self.EVENTS.keys():
            self.events.update({self.EVENTS[key]: []})
        for key in self.TRIGGERS.keys():
            self.triggers.update({self.TRIGGERS[key]: lambda x=None: None})

    def __del__(self):
        self.events.clear()

    # подписка на события
    def subscribe(self, name, func):
        if name and func:
            self.events.get(name).append(func)

    def getEvents(self):
        return self.EVENTS

    # выозов события
    def call(self, name, data=None):
        if name:
            cbs = self.events.get(name)
            if cbs:
                for cb in cbs:
                    cb(data)

    def getTriggers(self):
        return self.TRIGGERS

    # Установить Триггер
    def set(self, name, func):
        if name and func:
            self.triggers[name] = func

    # Вызвать триггер
    def get(self, name, data=None):
        if name:
            return self.triggers.get(name)(data)
