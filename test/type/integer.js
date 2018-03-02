var type = require('../../src/lib/type');
var assert = require('assert');

describe('Type checker for integer', function () {
    it('should against integer type', function() {
        assert.ok(type.isInteger(1));
        assert.ok(!type.isInteger(1.111));
        assert.ok(!type.isInteger('1'));
    });
});
