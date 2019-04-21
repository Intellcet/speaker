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
     * Метод отправки запроса login на сервер
     * @param data данные с которыми нужно отправить запрос
     * @returns {Promise<any>} результат запроса
     */
    login(data = {}) {
        data.url = `user/login/${data.login}/${data.password}/${data.rnd}`;
        return this.executeGet(data);
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