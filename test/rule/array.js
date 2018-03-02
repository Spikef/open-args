var rule = require('../../src/lib/rule');
var assert = require('assert');

describe('Rule checker for array', function () {
    var arr = [1, 2, 3];
    it('should against max items', function() {
        assert.ok(rule.isMaxItems(arr, 3));
        assert.ok(!rule.isMaxItems(arr, 2));
    });
    it('should against min items', function() {
        assert.ok(rule.isMinItems(arr, 3));
        assert.ok(!rule.isMinItems(arr, 4));
    });
    it('should against uniqueItems', function() {
        assert.ok(rule.isUniqueItems(arr));
    });
});
