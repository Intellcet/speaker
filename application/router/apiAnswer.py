class ApiAnswer:

    errors = {
        1000: 'not enough parameters',
        2000: 'error with trying add to DB',
        2010: 'incorrect login/logout data',
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
