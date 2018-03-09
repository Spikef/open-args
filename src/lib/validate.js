var debug = require('debug')('validate');
var rule = require('./rule');
var type = require('./type');
var format = require('./format');
var collect = require('./collect');

module.exports = function(data, validator) {
    debug(validator.toString());
    var result = validator(data, type, rule, format, collect);
    debug(data);
    debug(result);
    return result === undefined ? true : result;
};
