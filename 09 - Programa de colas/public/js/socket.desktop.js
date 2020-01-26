//Establecer la conexión
var socket = io();

//Sirve para obtener parametros del URL
var searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es necesario')
}

var desktop = searchParams.get('escritorio');
var label = $('small');
$('h1').text('Escritorio ' + desktop);
$('button').on('click', function() {
    socket.emit('takeTicket', { desktop: desktop }, function(resp) {
        if (resp.msg === 'No hay Ticket pendientes') {
            label.text(resp.msg);
            alert(resp.msg);
            return;
        }
        label.text('Ticket numero ' + resp.number);
    });
});