var type = require('../../src/lib/type');
var assert = require('assert');

describe('Type checker for object', function () {
    it('should against object type', function() {
        assert.ok(type.isObject({}));
        assert.ok(!type.isObject([]));
        assert.ok(!type.isObject('1'));
    });
});
