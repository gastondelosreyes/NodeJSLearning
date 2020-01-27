var params = new URLSearchParams(window.location.search);

//Referencias de JQUERY
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
// Funciones para renderizar usuarios

function renderizarUsuarios(personas) {
    console.log(personas);
    var html = '';
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + ' </span></a>';
    html += '</li>';
    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        // Los atributos personalizados se estandariza en poner data-"atributo"
        html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    divUsuarios.html(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

function renderizarMensajes(data, yo) {
    var html = '';
    var fecha = new Date(data.fecha);
    var hora = fecha.getHours() + ' : ' + fecha.getMinutes();

    var adminClass = 'info';
    if (data.nombre === 'Administrador') {
        adminClass = 'danger';
    }
    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + data.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + data.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li>';
        if (data.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>' + data.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + data.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    divChatbox.append(html);
}

divUsuarios.on('click', 'a', function() {
    // Se utiliza el id del atributo personalizado.
    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }
});

formEnviar.on('submit', function(event) {
    event.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        //Si está vacio, no devuelve nada
        return;
    }
    socket.emit('crearMensaje', {
        nombre: params.get('nombre'),
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        //Si manda el true quiere decir que es uno el que manda el mensaje
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
});