from aiohttp import web
from settings import SETTINGS

from application.mediator import Mediator
from application.modules.db.db import DB
from application.router.router import Router
from application.modules.managers.songManager import SongManager
from application.modules.managers.playlistManager import PlaylistManager
from application.modules.managers.userManager import UserManager


mediator = Mediator(SETTINGS["MEDIATOR"])
db = DB(SETTINGS["DB"])

SongManager({ "mediator": mediator, "db": db, "pathToMusic": SETTINGS['PATH_TO_MUSIC'] })
PlaylistManager({ "mediator": mediator, "db": db, "pathToMusic": SETTINGS['PATH_TO_MUSIC'] })
UserManager({ "mediator": mediator, "db": db, "pathToMusic": SETTINGS['PATH_TO_MUSIC'] })

# test users:
# vasya <=> 123
# petya <=> 321
# ivan <=> 213
# ilya <=> 123

app = web.Application()
Router(app, web, mediator)
web.run_app(app)
