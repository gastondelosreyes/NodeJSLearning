var socket = io();

var lblTicket1 = $('#lblTicket1');
var lblTicket2 = $('#lblTicket2');
var lblTicket3 = $('#lblTicket3');
var lblTicket4 = $('#lblTicket4');

var lblDesktop1 = $('#lblEscritorio1');
var lblDesktop2 = $('#lblEscritorio2');
var lblDesktop3 = $('#lblEscritorio3');
var lblDesktop4 = $('#lblEscritorio4');

var lblTickets = [lblTicket1, lblTicket2, lblTicket3, lblTicket4]
var lblDesktop = [lblDesktop1, lblDesktop2, lblDesktop3, lblDesktop4]

//Actualiza los ultimos 4
socket.on('last4', function(data) {
    var audio = new Audio('audio/new-ticket.mp3');
    audio.play();
    refreshHTML(data.last4);
});

socket.on('estadoActual', function(data) {
    refreshHTML(data.last4);
});

function refreshHTML(last4) {
    for (var i = 0; i <= last4.length - 1; i++) {
        lblTickets[i].text('Ticket ' + last4[i].number);
        lblDesktop[i].text('Desktop ' + last4[i].desktop);
    }
}