var Rav = require('../../src');
var assert = require('assert');

var method = 'patch';
var path = '/pets/{PetName}';
var spec = require('./spec');
var req = {
    header: {
        Authorization: "token 123"
    },
    body: {

    },
    params: {
        PetName: 'Dog'
    }
};

var rav = new Rav(spec);
var key = rav.hashKey(method, path);

describe('Validate [patch] [/pets/{PetName}]', function () {
    it('should against array type', function() {
        assert.ok(rav.validate(key, req));
    });
});