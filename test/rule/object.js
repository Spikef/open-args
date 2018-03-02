var rule = require('../../src/lib/rule');
var assert = require('assert');

describe('Rule checker for object', function () {
    var obj = {a: 0, b: 1, c: 2};
    it('should against max properties', function() {
        assert.ok(rule.isMaxProps(obj, 3));
        assert.ok(!rule.isMaxProps(obj, 2));
    });
    it('should against min properties', function() {
        assert.ok(rule.isMinProps(obj, 3));
        assert.ok(!rule.isMinProps(obj, 4));
    });
});
