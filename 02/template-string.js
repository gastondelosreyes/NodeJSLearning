let nombre = 'Superman';
let real = 'Clark Kent';

//console.log(`${nombre} es realmente ${real}`);

//let nombreCompleto = nombre + ' ' + real;
//let nombreTemplate = `${nombre} ${real}`;

//console.log(nombreCompleto === nombreTemplate);

function getName() {
    return `${nombre} ${real}`;
}

console.log(`El nombre de: ${getName()}`);