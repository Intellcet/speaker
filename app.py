from aiohttp import web
from settings import SETTINGS

from application.mediator import Mediator
from application.router.router import Router

mediator = Mediator(SETTINGS["MEDIATOR"])

app = web.Application()
Router(app, web, mediator)
web.run_app(app)
