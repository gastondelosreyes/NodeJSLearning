let empleados = [{
    id: 1,
    name: 'Fernando'
}, {
    id: 2,
    name: 'Gastón'
}, {
    id: 3,
    name: 'Facundo'
}];

let salarios = [{
    id: 1,
    salario: 1000
}, {
    id: 2,
    salario: 2000
}];

let getEmployer = (id, callback) => {
    let empleadoBD = empleados.find(empleado => empleado.id === id);
    if (!empleadoBD) {
        callback(`No existe un empleado con ese id`)
    } else {
        callback(null, empleadoBD)
    }
    return empleadoBD
}

let getSalary = (empleado, callback) => {
    let salarioBD = salarios.find(salario => salario.id === empleado)
    if (!salarioBD) {
        callback(`Este empleado no tiene un salario asignado`)
    } else {
        callback(null, {
            nombre: empleado.name,
        })
    }
}

let empleado = getEmployer(1, (err, empleado) => {
    if (err) {
        console.log(err)
    }
    console.log(empleado);
});
getSalary(empleado.id, (err, salario) => {
    if (err) {
        console.log(err)
    }
    console.log('El empleado ' + empleado.name + ' cobra ' + salario.salario)
});

// getSalary(getEmployer(1,(err, empleado){
//     if(err){
//         console.log(err);
//     }
//     console.log(empleado);
// }), (err, salario){
//     if (err) {
//         console.log(err)
//     }
//     console.log('El empleado ' + empleado.name + ' cobra ' + salario.salario)
// });