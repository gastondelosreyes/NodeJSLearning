function saludar(nombre, apellido) {
    let msg = `Hola ${nombre}, ${apellido}`;

    return msg;
}

let saludo = saludar('Gastón', 'De los Reyes');

console.log(saludo);