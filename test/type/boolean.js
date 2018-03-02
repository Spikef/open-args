var type = require('../../src/lib/type');
var assert = require('assert');

describe('Type checker for boolean', function () {
    it('should against boolean type', function() {
        assert.ok(type.isBoolean(true));
        assert.ok(type.isBoolean(false));
        assert.ok(!type.isBoolean(1));
        assert.ok(!type.isBoolean(0));
        assert.ok(!type.isBoolean('true'));
        assert.ok(!type.isBoolean('false'));
    });
});
