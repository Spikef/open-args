var rule = require('../../src/lib/rule');
var assert = require('assert');

describe('Rule checker for enum', function () {
    var array = [1, 'a', true, null];
    it('should against value in enum', function() {
        assert.ok(rule.isInEnum(1, array));
        assert.ok(rule.isInEnum('a', array));
        assert.ok(rule.isInEnum(true, array));
        assert.ok(rule.isInEnum(null, array));
        assert.ok(!rule.isInEnum('1', array));
        assert.ok(!rule.isInEnum('true', array));
        assert.ok(!rule.isInEnum('null', array));
    });
});