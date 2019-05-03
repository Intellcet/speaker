/**
 * Компонент для отправки запросов на сервер и получения ответов
 */
class Server {

    /**
     * Функция-конструктор компонента
     * @param options начальные параметры, с которыми вызывается конструктор
     */
    constructor(options) {
        this.options = options instanceof Object ? options : {};
        this.url = options.URL;
        this.token = null;
    }

    /**
     * Метод, выполняющий любой GET-запрос на сервер
     * @param data данные, с которыми нужно выполнить этот запрос
     * @returns {Promise<any>} результат выполнения запроса
     */
    executeGet(data) {
        return new Promise(resolve => {
            $.ajax({
                url: this.url + data.url,
                data,
                method: 'GET',
                dataType: 'json',
                success: data => resolve(data)
            })
        });
    }

    /**
     * Метод, выполняющий любой POST-запрос на сервер
     * @param data данные, с которыми нужно выполнить этот запрос
     * @returns {Promise<any>} результат выполнения запроса
     */
    executePost(data) {
        const url = this.url + data.url;
        delete data.url;
        return new Promise(resolve => {
            return $.ajax({
                url: url,
                type: 'POST',
                data: data,
                processData: false, // tell jQuery not to process the data
                contentType: false, // tell jQuery not to set contentType
                success: data => resolve(data)
            });
        });
    }

    /**
     * Метод, выполняющий любой DELETE-запрос на сервер
     * @param data данные, с которыми нужно выполнить этот запрос
     * @returns {Promise<any>} результат выполнения запроса
     */
    executeDelete(data) {
        return new Promise(resolve => {
            $.ajax({
                url: this.url + data.url,
                data,
                method: 'DELETE',
                dataType: 'json',
                success: data => resolve(data)
            })
        });
    }

    /**
     * Метод отправки запроса login на сервер
     * @param data данные с которыми нужно отправить запрос
     * @returns {Promise<any>} результат запроса
     */
    login(data = {}) {
        data.url = `user/login/${data.login}/${data.password}/${data.rnd}`;
        return this.executeGet(data);
    }

    /**
     * Метод для отправки запроса logout на сервер
     * @param data = null
     * @returns {Promise<any>}
     */
    logout(data = {}) {
        data.url = `user/logout/${this.token}`;
        return this.executeGet(data);
    }

    /**
     * Метод для отправки запроса регистрации на сервер
     * @param data = {login, password}
     * @returns {Promise<any>}
     */
    register(data = {}) {
        data.url = `user`;
        return this.executePost(data);
    }

    /**
     * Метод для получения обновленных данных пользователя с сервера
     * @param data = {}
     * @returns {Promise<any>}
     */
    getUser(data = {}) {
        data.url = `user/${this.token}`;
        return this.executeGet(data);
    }

    /**
     * Метод для добавления песни в плейлист
     * @param data
     * @returns {Promise<any>}
     */
    addSongToPlaylist(data = {}) {
        data.url = `song/playlist/${this.token}/${data.songId}/${data.playlistId}`;
        return this.executeGet(data);
    }

    /**
     * Метод для добавления нового плейлиста
     * @param data = {name}
     * @returns {Promise<any>}
     */
    addNewPlaylist(data = {}) {
        data.url = `playlist/add/${this.token}/${data.name}`;
        return this.executeGet(data);
    }

    /**
     * Метод для удаления плейлиста
     * @param data = {id}
     * @returns {Promise<any>}
     */
    deletePlaylist(data = {}) {
        data.url = `playlist/${this.token}/${data.id}`;
        return this.executeDelete(data);
    }

    /**
     * Метод для удаления песни из плейлиста
     * @param data = {songId, playlistId}
     * @returns {Promise<any>}
     */
    deleteSongFromPlaylist(data = {}) {
        data.url = `song/playlist/${this.token}/${data.songId}/${data.playlistId}`;
        return this.executeDelete(data);
    }

    /**
     * Выигрузить песню на сервер
     * @param data
     * @returns {Promise<any>}
     */
    uploadSong(data = {}) {
        data.url = `song/${this.token}`;
        return this.executePost(data)
    }

    getSongs(data = {}) {
        data.url = `song/get/${this.token}`;
        return this.executeGet(data);
    }

    playSong(data = {}) {
        data.url = `song/${this.token}/${data.id}`;
        return this.executeGet(data);
    }

    stopSong(data = {}) {
        data.url = `song/stop/${this.token}/${data.id}`;
        return this.executeGet(data);
    }

}