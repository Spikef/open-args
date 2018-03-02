var rule = require('./rule');
var type = require('./type');
var format = require('./format');

module.exports = function(data, validator) {
    var result = validator(data, type, rule, format);
    return result === undefined ? true : result;
};