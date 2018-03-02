var rule = require('../../src/lib/rule');
var assert = require('assert');

describe('Rule checker for number', function () {
    it('should against maximum and !exclusiveMaximum', function() {
        assert.ok(rule.isMax(3, 4));
        assert.ok(rule.isMax(4, 4));
        assert.ok(!rule.isMax(5, 4));
    });
    it('should against maximum and exclusiveMaximum', function() {
        assert.ok(rule.isSmaller(3, 4));
        assert.ok(!rule.isSmaller(4, 4));
        assert.ok(!rule.isSmaller(5, 4));
    });
    it('should against minimum and !exclusiveMinimum', function() {
        assert.ok(!rule.isMin(3, 4));
        assert.ok(rule.isMin(4, 4));
        assert.ok(rule.isMin(5, 4));
    });
    it('should against minimum and exclusiveMinimum', function() {
        assert.ok(!rule.isGreater(3, 4));
        assert.ok(!rule.isGreater(4, 4));
        assert.ok(rule.isGreater(5, 4));
    });
    it('should against multipleOf', function() {
        assert.ok(rule.isMultipleOf(12, 3));
        assert.ok(!rule.isMultipleOf(12, 5));
    });
});
