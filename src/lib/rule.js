// for numbers

// maximum && !exclusiveMaximum
exports.isMax = function isMax(val, max) {
    return val <= max;
};

// minimum && !exclusiveMinimum
exports.isMin = function isMin(val, min) {
    return val >= min;
};

// maximum && exclusiveMaximum
exports.isSmaller = function isSmaller(val, max) {
    return val < max;
};

// minimum && exclusiveMinimum
exports.isGreater = function isGreater(val, min) {
    return val > min;
};

// multipleOf
exports.isMultipleOf = function isMultipleOf(val, expect) {
    return val % expect === 0;
};

// for strings

// maxLength
exports.isMaxLength = function isMaxLength(val, max) {
    return val.length <= max;
};

// minLength
exports.isMinLength = function isMinLength(val, min) {
    return val.length >= min;
};

// for arrays

// maxItems
exports.isMaxItems = function isMaxItems(val, max) {
    return val.length <= max;
};

// minItems
exports.isMinItems = function isMinItems(val, min) {
    return val.length >= min;
};

// uniqueItems
exports.isUniqueItems = function isUniqueItems(val) {
    var c = 0;
    for (let i = 0; i < val.length; i++) {
        let v = val[i];
        if (Object.is(NaN, v)) {
            c++;
        } else if (val.lastIndexOf(val[i]) !== i) {
            return false;
        }
    }
    return c <= 1;
};

// for objects

// maxProperties
exports.isMaxProps = function(val, max) {
    return Object.keys(val).length <= max;
};

// minProperties
exports.isMinProps = function(val, min) {
    return Object.keys(val).length >= min;
};

// for enums

// enum
exports.isInEnum = function isInEnum(val, list) {
    return !!~list.indexOf(val);
};