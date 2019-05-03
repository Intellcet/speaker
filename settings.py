SETTINGS = {

    "DB": {
        'PATH': 'application/modules/db/projectDB.db'
    },

    "MEDIATOR": {
        "TRIGGERS": {
            "GET_USERS": "GET_USERS",
            "LOGIN": "LOGIN",
            "LOGOUT": "LOGOUT",
            "REGISTER": "REGISTER",
            "GET_USER_DATA": "GET_USER_DATA",
            "GET_SONGS": "GET_SONGS",
            "GET_SONG": "GET_SONG",
            "PLAY_SONG": "PLAY_SONG",
            "PAUSE_SONG": "PAUSE_SONG",
            "RESUME_SONG": "RESUME_SONG",
            "STOP_SONG": "STOP_SONG",
            "SET_NEW_SONG_POSITION": "SET_NEW_SONG_POSITION",
            "SET_VOLUME": "SET_VOLUME",
            "GET_USER_SONGS": "GET_USER_SONGS",
            "GET_USER_PLAYLISTS": "GET_USER_PLAYLISTS",
            "UPLOAD_SONG": "UPLOAD_SONG",
            "DOWNLOAD_SONG": "DOWNLOAD_SONG",
            "DELETE_SONG": "DELETE_SONG",
            "ADD_SONG_TO_PLAYLIST": "ADD_SONG_TO_PLAYLIST",
            "REMOVE_SONG_FROM_PLAYLIST": "REMOVE_SONG_FROM_PLAYLIST",
            "GET_PLAYLIST": "GET_PLAYLIST",
            "ADD_PLAYLIST": "ADD_PLAYLIST",
            "DELETE_PLAYLIST": "DELETE_PLAYLIST",
            "GET_RADIO_SONG": "GET_RADIO_SONG",
            "GET_ALL_SONGS": "GET_ALL_SONGS",
            "GET_RADIO_HISTORY": "GET_RADIO_HISTORY",
        },
        "EVENTS": {
            "THREAD_IS_FINISHED": "THREAD_IS_FINISHED",
        }
    },

    "PATH_TO_MUSIC": "public/music/"

}
"""
  В бд были использованы следующие триггеры, касательно таблицы songs_in_playlists:
    1. check_playlist - Проверка существования плейлиста с переданным id в таблице music при добавлении новой записи
    2. check_playlist_update - Проверка существования плейлиста с переданным id в таблице music при изменении записи
    3. check_songs - Проверка существования песни с переданным id в таблице songs при добавлении новой записи
    4. check_songs_update - Проверка существования песни с переданным id в таблице songs при изменении записи
"""

