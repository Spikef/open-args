var util = require('./util');

exports.isInt16 = function isInt16(val) {
    return -32768 <= val && val <= 32767;
};

exports.isInt32 = function isInt32(val) {
    return -2147483648 <= val && val <= 2147483647;
};

exports.isInt64 = function isInt64(val) {
    return -9223372036854775808 <= val && val <= 9223372036854775807;
};

exports.isDate = function isDate(val) {
    var date = new Date(val);
    return date.toString() === 'Invalid Date' ? null : date.toISOString().slice(0, 10);
};

exports.isDateTime = function isDateTime(val) {
    var date = new Date(val);
    return date.toString() === 'Invalid Date' ? null : date.toISOString();
};

exports.isDateStamp = function isDateStamp(val) {
    var date = Date.parse(val);
    return isNaN(date) ? null : date;
};

exports.isUsername = function isUsername(val) {
    return /^[a-zA-Z]\w{1,15}$/.test(val);
};

exports.isPassword = function isPassword(val) {
    return /^.{6,}$/.test(val);
};

exports.isUrl = function isUrl(val) {
    return /^((https?:)?\/\/(\w+:?\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?$/.test(val);
};

exports.isQQ = function isQQ(val) {
    return /^[1-9]\d{5, 11}$/.test(val);
};

exports.isEmail = function isEmail(val) {
    return /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])$/i.test(val);
};

exports.isMobile = function isMobile(val) {
    return /(\+\d+)?1[3458]\d{9}$/.test(val);
};

exports.isPhone = function isPhone(val) {
    return /(\+\d+)?(\d{3,4}-?)?\d{7,8}$/.test(val);
};

exports.isIdCardNo = function isIdCardNo(val) {
    return /[1-9]\d{16}[a-zA-Z0-9]/.test(val);
};

exports.isUUID = function isUUID(val) {
    return /[0-9a-z]{8}(-[0-9a-z]{4}){3}-[0-9a-z]{12}/i.test(val);
};

exports.isIPV4 = function(val) {
    return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(val);
};

exports.isIPV6 = function(val) {
    return /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/.test(val);
};

// extend custom format validator
exports.extendFormat = function extendFormat(format, validator) {
    this[util.getName(format)] = validator;
};