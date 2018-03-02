var type = require('../../src/lib/type');
var assert = require('assert');

describe('Type checker for number', function () {
    it('should against number type', function() {
        assert.ok(type.isNumber(1));
        assert.ok(type.isNumber(1.111));
        assert.ok(!type.isNumber('1'));
    });
});
