var Rav = require('../src');
var assert = require('assert');

var method = 'patch';
var path = '/pets/{PetName}';
var spec = require('./spec');
var req = {
    header: {
        Authorization: "token 123"
    },
    body: {
        Name: 'Dog',
        Type: 'cat',
        Age: 5,
        Address: {
            Street: 'HundredFlowersStreet',
            City: 'OneNightRiver',
            State: 'LS',
            ZipCode: 10001
        },
        Vet: {
            Name: 'Dr Green',
            LastTime: Date(),
            Address: {
                Street: 'HundredFlowersStreet',
                City: 'OneNightRiver',
                State: 'LS',
                ZipCode: 10001
            }
        },
        Tags: ['Dog'],
        huntingSkill: 'adventurous',
    },
    params: {
        PetName: 'Dog'
    }
};

var rav = new Rav(spec);
var key = rav.hashKey(method, path);

var cost = 0;
var total = 10000;
for (let i = 0; i < total; i++) {
    let data = JSON.parse(JSON.stringify(req));
    let start = Date.now();
    rav.validate(key, data);
    cost += Date.now() - start;
}
console.log(`average cost: ${(cost / total).toFixed(3)}ms`);
