import threading
from time import sleep
from mutagen.mp3 import MP3

from application.modules.managers.baseManager import BaseManager


class RadioManager(BaseManager):

    playlist = None
    historyPlaylist = list()
    currentSong = None

    def __init__(self, options):
        super().__init__(options)
        self.mediator.set(self.TRIGGERS['GET_RADIO_SONG'], self.getRadioSong)
        self.mediator.set(self.TRIGGERS['GET_RADIO_HISTORY'], self.getRadioHistory)
        self.mediator.subscribe(self.EVENTS['THREAD_IS_FINISHED'], self.threadIsFinished)
        self.threadIsFinished()

    # Само "радио"
    def radio(self):
        for song in self.playlist:
            self.currentSong = song
            audio = MP3(song.url)
            sleep(int(audio.info.length))
            self.historyPlaylist.append(song)
        self.mediator.call(self.EVENTS['THREAD_IS_FINISHED'])
        self.historyPlaylist.clear()

    # Запуск второго потока
    def setThread(self):
        thread = threading.Thread(target=self.radio)
        thread.start()

    # Сигнал о том, что радио закончилось
    def threadIsFinished(self, data=None):
        self.playlist = self.mediator.get(self.TRIGGERS['GET_ALL_SONGS'])
        self.setThread()

    # Получить текущую песню на радио
    def getRadioSong(self, data=None):
        return self.currentSong

    # Получить историю песен на радио
    def getRadioHistory(self, data=None):
        answer = list()
        for song in self.historyPlaylist:
            answer.append(song.get())
        return answer
