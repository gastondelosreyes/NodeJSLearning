let Superman = {
    name: 'Clark',
    sureName: 'Kent',
    power: 'Homosexuality',
    getName: function() {
        return `${this.name} ${this.sureName} got ${this.power}`;
    }
};

//console.log(Superman.getName());

let { name: SuperName, sureName, power } = Superman;
console.log(SuperName, sureName, power);