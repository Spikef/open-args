var type = require('../../src/lib/type');
var assert = require('assert');

describe('Type checker for string', function () {
    it('should against string type', function() {
        assert.ok(!type.isString(1));
        assert.ok(!type.isString(1.111));
        assert.ok(type.isString('1'));
    });
});
