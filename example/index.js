var petstore = require('./petstore');
var Compile = require('../src');

var compile = new Compile(petstore);
console.log(compile.validations);