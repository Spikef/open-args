var rule = require('../../src/lib/rule');
var assert = require('assert');

describe('Rule checker for string', function () {
    it('should against max length', function() {
        assert.ok(rule.isMaxLength('abcd', 4));
        assert.ok(!rule.isMaxLength('abcde', 4));
    });
    it('should against min length', function() {
        assert.ok(rule.isMinLength('abcd', 4));
        assert.ok(!rule.isMinLength('abc', 4));
    });
});
