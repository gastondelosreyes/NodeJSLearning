const fs = require('fs');

let listadoPorHacer = [];

const guardarDB = () => {
    let data = JSON.stringify(listadoPorHacer);

    fs.writeFile(`db/data.json`, data, (err) => {
        if (err) throw new Error('No se pudo grabar', err);
    });
}

const cargarDB = () => {
    //Trabajar con excepciones
    try {
        listadoPorHacer = require('../db/data.json');
    } catch (error) {
        listadoPorHacer = []
    }
    return listadoPorHacer
}

const crear = (descripcion) => {
    cargarDB();
    let porHacer = {
        descripcion,
        completado: false
    };

    listadoPorHacer.push(porHacer);

    guardarDB();

    return porHacer;

}

const getListado = () => {
    return cargarDB();
}

const actualizar = (descripcion, completado = true) => {
    cargarDB();
    // Busca el indice que coincida con la descripción del elemento
    let index = listadoPorHacer.findIndex(tarea => {
        return tarea.descripcion === descripcion;
    })
    if (index >= 0) {
        listadoPorHacer[index].completado = completado;
        guardarDB();
        return true;
    } else {
        return false;
    }
}
const borrar = (descripcion) => {
    // shift() borra el primer elemento
    // pop() borra el ultimo elemento
    cargarDB();
    let index = listadoPorHacer.findIndex(tarea => {
        return tarea.descripcion === descripcion;
    })
    if (index >= 0) {
        listadoPorHacer.splice(index, 1)
        guardarDB();
        console.log('Tarea eliminada con exito');
        return true;
    } else {
        console.log('No existe dicha tarea');
        return false;
    }
}
module.exports = {
    crear,
    getListado,
    actualizar,
    borrar
}