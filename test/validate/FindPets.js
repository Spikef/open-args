var Rav = require('../../src');
var assert = require('assert');

var method = 'get';
var path = '/pet';
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
        familyAddress: [
            {
                Street: 'HundredFlowersStreet',
                City: 'OneNightRiver',
                State: 'LS',
                ZipCode: 10001
            },
            {
                Street: 'HundredFlowersStreet',
                City: 'OneNightRiver',
                State: 'LS',
                ZipCode: 10001
            }
        ],
    },
    params: {
        PetName: 'Dog'
    }
};

var rav = new Rav(spec);
var key = rav.hashKey(method, path);

describe('Validate [get] [/pet]', function () {
    it('should validate true', function() {
        assert.deepEqual(rav.validate(key, req), true);
    });
});
