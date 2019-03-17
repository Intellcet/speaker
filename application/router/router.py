from .apiAnswer import ApiAnswer


class Router:

    web = None
    api = None

    def __init__(self, app, web, mediator):
        self.web = web
        self.api = ApiAnswer()
        self.mediator = mediator
        self.TYPES = mediator.getEvents()
        self.TRIGGERS = mediator.getTriggers()
        routes = [
            ('*', '/', self.staticHandler)
        ]
        app.router.add_static('/css/', path=str('./public/css/'))
        app.router.add_static('/js/', path=str('./public/js/'))
        for route in routes:
            app.router.add_route(route[0], route[1], route[2])

    def staticHandler(self, request):
        return self.web.FileResponse('./public/index.html')
