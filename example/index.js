var spec = require('./spec');
var Rav = require('../src');

var rav = new Rav(spec);
Object.keys(rav.validations).forEach(key => {
    console.log(`${key}:`);
    console.log(rav.validations[key].toString());
});
