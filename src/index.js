var checker = require('./lib/checker');
var compile = require('./lib/compile');
var validate = require('./lib/validate');
var { hashKey } = require('./lib/util');

class Rav {
    /**
     * compile openAPI spec
     * @param {Object} spec
     */
    constructor(spec) {
        this.rule = checker.rule;
        this.type = checker.type;
        this.format = checker.format;
        this.hashKey = hashKey;
        this.validations = compile(spec);
    }

    /**
     * validate request args
     * @param {string} key
     * @param {Object} value
     * @param {Object} [value.body]
     * @param {Object} [value.query]
     * @param {Object} [value.params]
     * @param {Object} [value.headers]
     */
    validate(key, value) {
        var validator;
        if (validator = this.validations[key]) {
            return validate(value, validator);
        }

        return null;
    }

    static get rule() {
        return checker.rule;
    }

    static get type() {
        return checker.type;
    }

    static get format() {
        return checker.format;
    }

    static get hashKey() {
        return hashKey;
    }
}

module.exports = Rav;