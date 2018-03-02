var util = require('./util');

exports.isNumber = util.isNumber;

exports.isInteger = util.isInteger;

exports.isBoolean = util.isBoolean;

exports.isString = util.isString;

exports.isArray = util.isArray;

exports.isObject = util.isObject;

exports.isFile = function isFile(val) {
    return !!val;
};