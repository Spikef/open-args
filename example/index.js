var spec = require('./spec');
var Rav = require('../src');

var rav = new Rav(spec);
Object.keys(rav.validations).forEach(key => {
    let fn = rav.validations[key];
    console.log(`${key} - ${fn.name}:`);
    // if (fn.name === 'checkFindPets')
        console.log(fn.toString());
});
