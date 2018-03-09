var Rav = require('../../src');
var assert = require('assert');

var method = 'get';
var path = '/pet';
var spec = require('./spec');
var req = {
    query: {
        Tags: 'dog,animal',
        'Vet.Address.City': 'OneNightRiver'
    }
};

var rav = new Rav(spec);
var key = rav.hashKey(method, path);

describe('Validate [get] [/pet]', function () {
    it('should validate true', function() {
        assert.deepEqual(rav.validate(key, req), true);
    });
});
