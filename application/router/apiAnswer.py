class ApiAnswer:

    errors = {
        1000: 'not enough parameters',
        2000: 'error with trying add to DB',
        2010: 'incorrect login/logout data',
        2020: 'registration error',

        3005: 'permission denied',
        3010: 'file is not an audio file',
        3020: 'song is not exists',
        3030: 'can not delete this song',
        3040: 'can not add song to playlist',
        3050: 'can not delete song from playlist',

        4010: 'can not get playlist',
        4020: 'playlist with this name already exists',
        4030: 'can not delete this playlist',

        5010: 'can not play this song',
        5020: 'can not pause this song',
        5030: 'can not resume this song',
        5040: 'can not stop this song',
        404: 'element not found',
        9000: 'unknown error'
    }

    @staticmethod
    def answer(data):
        return {
            'result': 'ok',
            'data': data
        }

    def error(self, code):
        error = self.errors[code] or self.errors[9000]
        return {
            'result': 'error',
            'error': error
        }
