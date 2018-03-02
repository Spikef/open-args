var crypto = require('crypto');

exports.hasProp = function hasProp(obj, key) {
    return obj.hasOwnProperty(key);
};

exports.getName = function getName(name) {
    return `is${name[0].toUpperCase()}${name.slice(1)}`;
};

exports.hashKey = function hashKey(method, path) {
    var hash = crypto.createHmac('sha256', 'open-api-method-path-key');
    return hash.update(`${method.toUpperCase()}@${path.toLowerCase()}`).digest('hex');
};

exports.getCheckName = function fnName(id, method, path) {
    var cake = path.split('/').slice(-1)[0].replace(/[^\w]/g, '');
    var name = id || `${method}${this.upperFirst(cake)}`;
    return `check${this.upperFirst(name)}`;
};

exports.upperFirst = function upperFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.makeRegex = function makeRegex(pattern) {
    if (pattern instanceof RegExp) {
        return pattern.toString();
    } else if (typeof pattern === 'string') {
        if (!pattern.startsWith('/')) pattern = '/' + pattern;
        if (!pattern.endsWith('/')) pattern = pattern + '/';
        return pattern;
    }
};

exports.isNumber = function isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
};

exports.isInteger = function isInteger(val) {
    return typeof val === 'number' && /^[+\-]?\d+\.?$/.test(String(val));
};

exports.isBoolean = function isBoolean(val) {
    return typeof val === 'boolean';
};

exports.isString = function isString(val) {
    return typeof val === 'string';
};

exports.isArray = function isArray(val) {
    return Array.isArray(val);
};

exports.isObject = function isObject(val) {
    return val && Object.prototype.toString.call(val) === '[object Object]';
};

exports.isFunction = function isFunction(val) {
    return typeof val === 'function';
};

/**
 * 枚举对象, 所有可能的数据类型
 */
exports.dataTypes = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    NULL: 'null',
    UNDEFINED: 'undefined',
    ARRAY: 'array',
    DATE: 'date',
    ERROR: 'error',
    FUNCTION: 'function',
    ASYNCFUNCTION: 'asyncfunction',
    MATH: 'math',
    OBJECT: 'object',
    REGEXP: 'regexp',
    PROMISE: 'promise',
    SYMBOL: 'symbol',
    BUFFER: 'buffer',
};

/**
 * 获取对象类型
 * @param obj
 * @returns {string}
 */
exports.getType = function getType(obj) {
    var type = obj === null ? 'null' : typeof obj;
    if (type === 'object') {
        if (Buffer.isBuffer(obj)) {
            type = 'buffer';
        } else {
            type = Object.prototype.toString.call(obj); // [object Array];
            type = type.replace(/(\[object )|]/g, '').toLowerCase();
        }
    }

    return type;
};

exports.isType = function isType(obj, type) {
    return this.getType(obj) === type;
};

// JSON
const flag = '__REGEXP__';

function replacer(key, value) {
    if (value instanceof RegExp) {
        return (flag + value.toString());
    } else {
        return value;
    }
}

function reviver(key, value) {
    if (value.toString().indexOf(flag) == 0) {
        var m = value.slice(flag.length).match(/^\/(.*)\/(.*)?$/);
        return new RegExp(m[1], m[2] || '');
    } else {
        return value;
    }
}

exports.stringify = function stringify(json) {
    return JSON.stringify(json, replacer, 2);
};

exports.parse = function parse(str) {
    return JSON.parse(str, reviver);
};

exports.copyJSON = function copyJSON(json) {
    return this.parse(this.stringify(json));
};