var socket = io();
var label = $('#lblNuevoTicket') //Variable hace referencia por ID a un objeto HTML

//Establecer la conexión
socket.on('connect', function() {
    console.log('Conectado al servidor');
});
socket.on('disconnect', function() {
    console.log('Desconectado al servidor');
});
socket.on('estadoActual', function(resp) {
        // Obtiene lo que envía el servidor y llama al atributo actual
        label.text(resp.actual)
    })
    //Establecer un listener para un botón
$('button').on('click', function() {
    // El front end emite el evento siguiente Ticket
    socket.emit('siguienteTicket', null, function(siguienteTicket) {
        //Le digo al HTML que se ponga de texto lo que recibe del servidor
        label.text(siguienteTicket);
    });

});