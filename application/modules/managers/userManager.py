from hashlib import md5
import random

from .baseManager import BaseManager
from ..struct.user import User
from ..struct.song import Song
from ..struct.playlist import Playlist


class UserManager(BaseManager):

    users = {}

    def __init__(self, options):
        super().__init__(options)
        self.mediator.set(self.TRIGGERS['LOGIN'], self.login)
        self.mediator.set(self.TRIGGERS['LOGOUT'], self.logout)
        self.mediator.set(self.TRIGGERS['REGISTER'], self.register)

    # Метод, проверяющий данные на валидность
    @staticmethod
    def __checkData(methodName, data):
        if methodName == "login":
            if "login" and "password" and "rnd" in data.keys():
                return True
        if methodName == "logout":
            if "token" in data.keys():
                return True
        if methodName == "register":
            if "login" and "password" in data.keys():
                return True
        return False

    def __getUserData(self, user):
        # Получить песни через медиатор
        songs = self.mediator.get(self.TRIGGERS['GET_USER_SONGS'], user)
        # Получить плейлисты через медиатор
        playlists = self.mediator.get(self.TRIGGERS['GET_USER_PLAYLISTS'], user)
        # Заполнить юзера
        user = User({ 'id': user['id'], 'login': user['login'], 'password': user['password'], 'token': user['token'],
                      'songs': songs, 'playlists': playlists })
        # Добавить юзера к активным юзерам
        self.users.update({ user.token: user })
        # Обнулить пароль, перед отправкой на клиент
        user.password = None
        return user.get()

    # Войти в систему
    # data = { login, password, rnd }
    def login(self, data):
        if self.__checkData("login", data):
            login = data['login']
            password = data['password']
            rnd = data['rnd']
            user = self.db.getUserByLogin(login)
            if user:
                hashPass = md5((user['password'] + str(rnd)).encode("utf-8")).hexdigest()
                if password == hashPass:
                    rnd = random.random()
                    token = md5((str(rnd) + user['login'] + user['password']).encode('utf-8')).hexdigest()
                    self.db.setToken(user['id'], token)
                    user.update({ 'token': token })
                    return self.__getUserData(user)
        return False

    # Выйти из системы
    # data = { token }
    def logout(self, data):
        if self.__checkData("logout", data):
            token = data['token']
            userId = self.db.getUserIdByToken(token)
            if userId:
                self.db.setToken(userId['id'], None)
                del self.users[token]
                return True
        return False

    # Зарегистрироваться в системе
    # data = { login, password }
    def register(self, data):
        if self.__checkData("register", data):
            login = data['login']
            password = data['password']
            return self.db.register(login, password)
        return False
