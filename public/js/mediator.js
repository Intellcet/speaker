class Mediator {
    EVENTS = {}; // типы событий
    events = {}; // сами события
    TRIGGERS = {}; // типы триггеров
    triggers = {}; // сами триггеры


    constructor(options) {
        options = options instanceof Object ? options : {};
        this.EVENTS = options.EVENTS;
        this.TRIGGERS = options.TRIGGERS;
        Object.keys(this.EVENTS  ).forEach(key => this.events[this.EVENTS[key]] = []);
        Object.keys(this.TRIGGERS).forEach(key => this.triggers[this.TRIGGERS[key]] = () => null);
    }

    // Подписка на событие
    subscribe(name, func) {
        if (this.events[name] && func instanceof Function) {
            this.events[name].push(func);
        }
    }

    // Вызов события
    call(name, data = null) {
        if (this.events[name]) {
            this.events[name].forEach(event => {
                if (event instanceof Function) {
                    event(data);
                }
            });
        }
    }

    // Вызов триггера
    get(name, data = null) {
        if (this.triggers[name] && this.triggers[name] instanceof Function) {
            return this.triggers[name](data);
        }
        return null;
    }

    // Подписка на триггер
    set(name, func) {
        if (name && func instanceof Function) {
            this.triggers[name] = func;
        }
    }
}