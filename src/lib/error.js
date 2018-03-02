var error = {
    errorTypes: {
        REQUIRED: {
            code: 400600,
            message: '[${name}] is required'
        },
        INVALID_TYPE: {
            code: 400601,
            message: '[${name}] is not ${0:type}'
        },
        INVALID_FORMAT: {
            code: 400602,
            message: '[${name}] is not match format [${0:format}]'
        },
        MISMATCH_PATTERN: {
            code: 400603,
            message: '[${name}] should match [${0:pattern}]'
        },
        INVALID_LENGTH: {
            code: 400604,
            message: 'length of [${name}] should be ${1:compare} than ${0:range}'
        },
        OUT_OF_RANGE: {
            code: 400605,
            message: '[${name}] should be ${1:flag}${0:range}'
        },
        INVALID_MULTIPLE_OF: {
            code: 400606,
            message: '[${name}] should be multiple of [${0:factor}]'
        },
        INVALID_ITEMS_COUNT: {
            code: 400607,
            message: 'length of [${name}] should be ${1:compare} than ${0:range}'
        },
        NOT_UNIQUE_ITEMS: {
            code: 400608,
            message: 'items of [${name}] are repeated'
        },
        NOT_IN_ENUM: {
            code: 400609,
            message: '[${name}] can only be one of [${0:enum}]'
        },
        INVALID_PROPS_COUNT: {
            code: 400610,
            message: 'keys of [${name}] should be ${1:compare} than ${0:range}'
        },
    },
    makeError: function makeError(name, error, ...args) {
        var beautify = '';
        if (name === 'data') {
            beautify = 'data';
        } else {
            var parts = name.replace('data', '').replace(/(^\[['"])|(['"]]$)/g, '').split(/['"]]\[['"]/);
            parts.forEach((p, i) => {
                if (/^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(p)) {
                    if (i > 0) beautify += '.';
                    beautify += p;
                } else {
                    beautify += `['${p}']`;
                }
            });
        }
        return `{ code: ${error.code}, message: "Invalid: ${error.message.replace(/\${name}/g, beautify).replace(/\${(\d+)(:\w+)?}/g, ($0, $1) => args[$1])}" }`;
    }
};

module.exports = error;