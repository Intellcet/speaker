from hashlib import md5
import random
import os

from .baseManager import BaseManager
from ..struct.user import User
from ..struct.song import Song
from ..struct.playlist import Playlist


class UserManager(BaseManager):

    users = {}

    def __init__(self, options):
        super().__init__(options)
        self.mediator.set(self.TRIGGERS['GET_USERS'], self.getUsers)
        self.mediator.set(self.TRIGGERS['LOGIN'], self.login)
        self.mediator.set(self.TRIGGERS['LOGOUT'], self.logout)
        self.mediator.set(self.TRIGGERS['REGISTER'], self.register)
        self.mediator.set(self.TRIGGERS['GET_USER_DATA'], self.getUserData)

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

    def getUsers(self, data=None):
        return self.users

    def __getUserData(self, user):
        songs = self.mediator.get(self.TRIGGERS['GET_USER_SONGS'], user)
        playlists = self.mediator.get(self.TRIGGERS['GET_USER_PLAYLISTS'], user)
        user = User({ 'id': user['id'], 'login': user['login'], 'password': user['password'], 'token': user['token'],
                      'songs': songs, 'playlists': playlists })
        self.users.update({ user.token: user })
        user.password = None
        return user.get()

    # Получить данные пользователя
    # data = { token }
    def getUserData(self, data):
        token = data['token']
        if token in self.users.keys():
            user = self.users[token]
            return self.__getUserData(user.get())
        return None

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
            hashPass = md5((login + password).encode("utf-8")).hexdigest()
            result = self.db.register(login, hashPass)
            if result:
                os.mkdir(self.path + login)  # Создаем папку для песен нового пользователя
                return result
        return False
