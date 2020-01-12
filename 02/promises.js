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

//Promises instead of callback
let getEmployer = (id) => {
    return new Promise((resolve, reject) => {
        let empleadoBD = empleados.find(empleado => empleado.id === id);
        if (!empleadoBD) {
            reject(`No existe un empleado con ese id`)
        } else {
            resolve(empleadoBD)
        }
    });
}

let getSalary = (empleado) => {
    return new Promise((resolve, reject) => {
        let salarioBD = salarios.find(salario => salario.id === empleado.id);
        if (!salarioBD) {
            reject(`El empleado ${empleado.name} no tiene salario`)
        } else {
            resolve({
                nombre: empleado.name,
                salario: salarioBD.salario
            })
        }
    });
}

getEmployer(3).then(empleado => {
    console.log('Empleado de la BD:', empleado)
    getSalary(empleado).then(resultado => {
        console.log(`El empleado ${resultado.name} cobra ${resultado.salario}`);
    }, (err) => {
        console.log(err);
    });
}, (err) => {
    console.log(err);
});