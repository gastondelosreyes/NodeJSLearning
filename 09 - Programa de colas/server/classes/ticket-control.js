const fs = require('fs');
// Al usar new nombreClase se ejecuta el constructor
class Ticket {
    constructor(number, desktop) {
        this.number = number;
        this.desktop = desktop;
    }
}
class TicketControl {
    constructor() {
        this.ultimo = 0;
        this.date = new Date().getDate();
        this.tickets = [];
        this.last4 = [];
        let data = require('../data/data.json');

        if (data.date === this.date) {
            //Si es el mismo día que el constructor, entonces leo los tickets
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.last4 = data.last4;
        } else {
            this.resetCount();
        }
    }

    getLastTicket() {
        return `Ticket ${this.ultimo}`;
    }

    getLast4() {
        return this.last4;
    }

    takeTicket(desktop) {
        if (this.tickets.length === 0) {
            return 'No hay Ticket pendientes';
        }
        let numberTicket = this.tickets[0].number;
        this.tickets.shift();

        let takeTicket = new Ticket(numberTicket, desktop)
        this.last4.unshift(takeTicket);
        if (this.last4.length > 4) {
            //Borra el ultimo elemento
            this.last4.splice(-1, 1);
        }
        this.saveFile();
        return takeTicket;
    }
    next() {
        this.ultimo += 1;
        let ticket = new Ticket(this.ultimo, null); //Null porque no se sabe quien lo va a atender
        this.tickets.push(ticket);
        this.saveFile();
        return `Ticket ${this.ultimo}`;
    }
    resetCount() {
        this.ultimo = 0
        this.tickets = [];
        this.last4 = [];
        console.log('Se inicia el sistema de tickets');

    }

    saveFile() {
        let jsonData = {
            ultimo: this.ultimo,
            date: this.date,
            tickets: this.tickets,
            last4: this.last4
        }
        let jsonDataString = JSON.stringify(jsonData);
        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }
}

module.exports = {
    TicketControl
}