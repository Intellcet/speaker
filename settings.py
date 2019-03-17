"""
  В бд были использованы следующие триггеры, касательно таблицы songs_in_playlists:
    1. check_playlist - Проверка существования плейлиста с переданным id в таблице playlists при добавлении новой записи
    2. check_playlist_update - Проверка существования плейлиста с переданным id в таблице playlists при изменении записи
    3. check_songs - Проверка существования песни с переданным id в таблице songs при добавлении новой записи
    4. check_songs_update - Проверка существования песни с переданным id в таблице songs при изменении записи
"""

SETTINGS = {

    "DB": {
        'PATH': 'application/modules/db/projectDB.db'
    },

    "MEDIATOR": {
        "TRIGGERS": {
            "LOGIN": "LOGIN",
            "LOGOUT": "LOGOUT",
            "REGISTER": "REGISTER",
            "GET_USER_SONGS": "GET_USER_SONGS",
            "GET_USER_PLAYLISTS": "GET_USER_PLAYLISTS"
        },
        "EVENTS": {}
    }

}
