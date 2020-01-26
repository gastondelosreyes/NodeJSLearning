const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();

io.on('connection', (client) => {
    // El back end escucha el evento siguiente Ticket
    client.on('siguienteTicket', (data, callback) => {
        let next = ticketControl.next();
        console.log(next);
        callback(next)
    });

    client.emit('estadoActual', {
        actual: ticketControl.getLastTicket(),
        last4: ticketControl.getLast4()
    });

    client.on('takeTicket', (data, callback) => {
        console.log(data);
        if (!data.desktop) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            })
        }

        let takeTicket = ticketControl.takeTicket(data.desktop);
        console.log(takeTicket);
        callback(takeTicket)
    })
    client.broadcast.emit('last4', {
        last4: ticketControl.getLast4()
    })
});