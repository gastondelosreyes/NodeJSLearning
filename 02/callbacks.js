// setTimeout(function() {
//     console.log('Función normal');
// }, 3000);

// setTimeout(() => {
//     console.log('Función en flecha');
// }, 3000);

let getUserById = (id, callback) => {
    let user = {
        name: 'Gastón',
        id
    }
    if (id === 20) {
        callback(`El usuario con id ${id}, no existe en la BD`);
    } else {
        callback(null, user);
    }
};

getUserById(20, (error, user) => {
    if (error) {
        return console.log(error);
    }
    console.log('Usuario de bd', user);
});