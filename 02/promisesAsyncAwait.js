/**
 * Async Await
 */

/**
 * async devuelve una promesa con el resultado.
 */

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
let getEmployer = async(id) => {
    let empleadoBD = empleados.find(empleado => empleado.id === id);
    if (!empleadoBD) {
        throw new Error(`No existe un empleado con el ID ${id}`)
    } else {
        return (empleadoBD)
    }
}

let getSalary = async(empleado) => {
    let salarioBD = salarios.find(salario => salario.id === empleado.id);
    if (!salarioBD) {
        throw new Error(`El empleado ${empleado.name} no tiene salario`);
    } else {
        return {
            nombre: empleado.name,
            salario: salarioBD.salario
        }
    }
}


let getMsg = async(id) => {
    let empleado = await getEmployer(id);
    let result = await getSalary(empleado);

    return `${result.nombre} cobra ${result.salario}`
}

getMsg(10).then((msg) => {
    console.log(msg);
}).catch((err) => {
    console.log(err);
});