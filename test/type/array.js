var type = require('../../src/lib/type');
var assert = require('assert');

describe('Type checker for array', function () {
    it('should against array type', function() {
        assert.ok(type.isArray([]));
        assert.ok(type.isArray([1, 2, 3]));
        assert.ok(!type.isArray(1));
        assert.ok(!type.isArray('1'));
    });
});
