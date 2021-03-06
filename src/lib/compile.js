var debug = require('debug')('compile');
var util = require('./util');
var { errorTypes, makeError } = require('./error');

const TAB = '   ';

class Compile {
    constructor(spec) {
        if (spec && spec.swagger === '2.0' && spec.definitions && spec.paths) {
            var definitions = {};
            for (let name in spec.definitions) {
                if (!spec.definitions.hasOwnProperty(name)) continue;
                let defer = this.defer(spec.definitions, name);
                if (defer) definitions[name] = util.parse(defer);
            }
            this.spec = util.copyJSON(spec);
            this.spec.definitions = definitions;

            this.validations = this.create();
        } else {
            throw new Error('Invalid specification.');
        }
    }

    // 对于$ref嵌套$ref的情况, 可能会造成递归嵌套, 所以需要处理
    // 因为需要递归调用, 所以最终返回字符串格式
    defer(definitions, key, stack = {}) {
        let ref = definitions[key];
        if (!ref) return null;
        stack = Object.assign({ [key]: true }, stack);
        ref = util.stringify(ref);
        ref = ref.replace(/"\$ref":"#\/definitions\/([^"]+)"(,?)/g, ($0, $1) => {
            if (stack[$1]) {
                return util.stringify({
                    $ref: {
                        path: `#/definitions/${$1}`,
                        nested: true
                    }
                }).replace(/^{|}$/g, '');
            } else {
                let ref = this.defer(definitions, $1, stack);
                if (ref) {
                    return `"$ref":${ref}`;
                } else {
                    return '';
                }
            }
        });
        ref = ref.replace(/",(?!([\s]*?)")/g, '"');
        return ref;
    }

    create() {
        var result = {};
        var spec = this.spec;
        Object.keys(spec.paths).forEach(path => {
            let operations = spec.paths[path];

            if (operations.$ref) {
                let schema = this.getRef(operations.$ref);
                if (schema) {
                    spec.paths[path] = schema;
                    operations = schema;
                } else {
                    console.log(`Unknown path: ${path}`);
                    delete spec.paths[path];
                    return;
                }
            }

            // method can be: get, post, put, delete, patch, head, options
            Object.keys(operations).forEach(method => {
                let isUnknown = !/^get|delete|head|options|post|put|patch$/.test(method);
                if (isUnknown) return;

                let operation = operations[method];
                let parameters = operation.parameters || [];
                if (operations.parameters) parameters = parameters.concat(operations.parameters);

                if (util.isObject(parameters)) {
                    let params = [];
                    for (let name in parameters) {
                        if (!parameters.hasOwnProperty(name)) continue;
                        params.push(Object.assign({ name }, parameters[name]));
                    }
                    parameters = params;
                }

                let name = util.getCheckName(operation.operationId, method, path);
                let uKey = util.hashKey(method, path);
                let codes = [];
                codes.indent = 1;
                codes.indexes = 'ijkopqrstuvwxyzabcdefghmnl'.split('');
                if (util.isArray(parameters)) {
                    let param = {
                        name: 'data',
                        required: true,
                        properties: {}
                    };
                    for (let i = 0; i < parameters.length; i++) {
                        let p = parameters[i];
                        switch (p.in) {
                            case 'header':
                            case 'query':
                            case 'path':
                                let name = p.in === 'path' ? 'params' : p.in;
                                param.properties[name] = param.properties[name] || {
                                    name: name,
                                    required: false,
                                    properties: {}
                                };
                                if (p.required) param.properties[name].required = true;
                                param.properties[name].properties[p.name] = p;
                                break;
                            case 'body':
                            case 'form':
                                param.properties[p.in] = Object.assign(p, { name: 'body' });
                                break;
                        }
                    }

                    this.define(codes, param);
                }

                if (codes.length) result[uKey] = this.generate(name, codes);
            });
        });
        return result;
    }

    /**
     * define codes
     * @param {Array} codes
     * @param {Number} codes.indent
     * @param {Array} codes.indexes
     * @param {Object} param
     * @param {String} [param.name]
     * @param {String} [param.type]
     * @param {String} [param.format]
     * @param {Boolean} [param.required]
     * @param {String} [param.pattern]
     * @param {Number} [param.minLength]
     * @param {Number} [param.maxLength]
     * @param {Number} [param.multipleOf]
     * @param {Number} [param.maximum]
     * @param {Number} [param.minimum]
     * @param {Boolean} [param.exclusiveMaximum]
     * @param {Boolean} [param.exclusiveMinimum]
     * @param {String} [param.collectionFormat]
     * @param {Object} [param.schema]
     * @param {String} [param.$ref]
     * @param {Array} [param.allOf]
     * @param {Object|*} [param.items]
     * @param {Number} [param.minItems]
     * @param {Boolean} [param.uniqueItems]
     * @param {Number} [param.maxItems]
     * @param {Object} [param.properties]
     * @param {Number} [param.minProperties]
     * @param {Number} [param.maxProperties]
     * @param {Array} [param.enum]
     * @param {String} [parent]
     * @param {Boolean} [isItem=false]
     */
    define(codes, param, parent = '', isItem) {
        var key = isItem ? `${param.name}` : `'${param.name}'`;
        var name = parent ? `${parent}[${key}]` : param.name;
        if (!util.isObject(param)) {
            console.log(`Unknown ${name}: `, param);
            return null;
        }

        // schema
        if (param.schema) {
            param = Object.assign(param.schema, param);
            delete param.schema;
        }

        // $ref
        if (param.$ref) {
            if (param.$ref.nested) return;
            let $ref = this.getRef(param.$ref);
            if (!$ref) throw new Error(`Unknown $ref: ${param.$ref}`);

            param = Object.assign(param, $ref);
            delete param.$ref;
        }

        // allOf
        if (param.allOf) {
            let schema = {
                required: [],
                properties: {}
            };

            param.allOf.forEach(item => {
                if (item.$ref) {
                    if (item.$ref.nested) return;
                    let $ref = this.getRef(item.$ref);
                    if (!$ref) throw new Error(`Unknown $ref: ${item.$ref}`);

                    item = $ref;
                }

                for (let i in item) {
                    if (!item.hasOwnProperty(i)) continue;
                    switch (i) {
                        case 'required':
                            schema.required = schema.required.concat(item[i]);
                            break;
                        case 'properties':
                            Object.assign(schema.properties, item[i]);
                            break;
                        default:
                            schema[i] = item[i];
                    }
                }
            });

            if (!schema.required.length) delete schema.required;

            param = Object.assign(param, schema);
            delete param.allOf;
        }

        // fill type
        if (param.items) {
            param.type = 'array';
            param.items.name = codes.indexes.shift();
            param.items.required = false;
            if (param.hasOwnProperty('minItems')) {
                param.required = true;
            }
        } else if (param.properties) {
            param.type = 'object';
            var required = Array.isArray(param.required) ? param.required : [];
            for (let name in param.properties) {
                if (!param.properties.hasOwnProperty(name)) continue;
                let prop = Object.assign(param.properties[name], { name });
                if (~required.indexOf(name)) prop.required = true;
                if (prop.required) param.required = true;
            }
        }

        // indent
        codes.push(codes.indent);

        if (param.type === 'file') {
            // No checking for file
        } else if (param.type === 'object' || param.type === 'array') {
            // start required
            if (!isItem) {
                if (param.required) {
                    if (parent) {
                        codes.push(`if (${parent}['${param.name}'] === undefined) {`);
                    } else {
                        codes.push(`if (!${param.name}) {`);
                    }
                    codes.push(`${TAB}return ${makeError(name, errorTypes.REQUIRED)};`);
                    codes.push(`} else {`);
                } else {
                    codes.push(`if (${parent}['${param.name}'] !== undefined) {`);
                }
                codes.push(++codes.indent);
            }

            if (param.type === 'object') {
                // check type
                codes.push(`if (!type.isObject(${name})) return ${makeError(name, errorTypes.INVALID_TYPE, 'object')};`);

                // minProperties, maxProperties
                if (param.hasOwnProperty('minProperties')) {
                    codes.push(`if (!rule.isMinProps(${name}, ${param.minProperties})) return ${makeError(name, errorTypes.INVALID_PROPS_COUNT, param.minProperties, 'greater')};`);
                }
                if (param.hasOwnProperty('maxProperties')) {
                    codes.push(`if (!rule.isMaxProps(${name}, ${param.minProperties})) return ${makeError(name, errorTypes.INVALID_PROPS_COUNT, param.maxProperties, 'less')};`);
                }

                for (let i in param.properties) {
                    if (!param.properties.hasOwnProperty(i)) continue;
                    let prop = param.properties[i];
                    this.define(codes, prop, name);
                }
            } else {
                // collectionFormat
                if (param.collectionFormat) {
                    codes.push(`${name} = collect(${name}, ${JSON.stringify(param.collectionFormat)});`);
                }

                // check type
                codes.push(`if (!type.isArray(${name})) return ${makeError(name, errorTypes.INVALID_TYPE, 'array')};`);

                // minItems, maxItems
                if (param.hasOwnProperty('minItems')) {
                    codes.push(`if (!rule.isMinItems(${name}, ${param.minItems})) return ${makeError(name, errorTypes.INVALID_ITEMS_COUNT, param.minItems, 'greater')};`);
                }
                if (param.hasOwnProperty('maxItems')) {
                    codes.push(`if (!rule.isMaxItems(${name}, ${param.maxItems})) return ${makeError(name, errorTypes.INVALID_ITEMS_COUNT, param.maxItems, 'less')};`);
                }
                // uniqueItems
                if (param.hasOwnProperty('uniqueItems')) {
                    codes.push(`if (!rule.isUniqueItems(${name})) return ${makeError(name, errorTypes.NOT_UNIQUE_ITEMS)};`);
                }

                let i = param.items.name;
                codes.push(`for (let ${i} = 0; ${i} < ${name}.length; ${i}++) {`);
                codes.push(++codes.indent);
                this.define(codes, param.items, name, true);
                codes.push(--codes.indent);
                codes.push(`}`);
            }

            // end required
            if (!isItem) {
                codes.push(--codes.indent);
                codes.push(`}`);
            }
        } else  {
            // default
            if (!param.hasOwnProperty('default')) {
                switch (param.type) {
                    case 'string':
                        param.default = '';
                        break;
                    case 'boolean':
                        param.default = false;
                        break;
                    case 'integer':
                    case 'number':
                        param.default = 0;
                        break;
                    default:
                        param.default = null;
                }
            }

            // start required
            if (!isItem) {
                codes.push(`if (${parent}['${param.name}'] === undefined) {`);
                if (param.required) {
                    codes.push(`${TAB}return ${makeError(name, errorTypes.REQUIRED)};`);
                } else {
                    codes.push(`${TAB}${name} = ${JSON.stringify(param.default)};`);
                }
                codes.push(`} else {`);
                codes.push(++codes.indent);
            }

            // type
            if (param.type === 'string') {
                codes.push(`if (!type.isString(${name})) return ${makeError(name, errorTypes.INVALID_TYPE, 'string')};`);
                // minLength, maxLength
                if (param.hasOwnProperty('minLength')) {
                    codes.push(`if (!rule.isMinLength(${name}, ${param.minLength})) return ${makeError(name, errorTypes.INVALID_LENGTH, param.minLength, 'greater')};`);
                }
                if (param.hasOwnProperty('maxLength')) {
                    codes.push(`if (!rule.isMaxLength(${name}, ${param.maxLength})) return ${makeError(name, errorTypes.INVALID_LENGTH, param.maxLength, 'less')};`);
                }
            } else if (param.type === 'boolean') {
                codes.push(`if (typeof ${name} !== 'boolean') {`);
                codes.push(++codes.indent);
                codes.push(`if (${name} === 'false' || ${name} === '0' || ${name} === 0) {`);
                codes.push(`${TAB}${name} = false;`);
                codes.push(`} else {`);
                codes.push(`${TAB}${name} = true;`);
                codes.push(`}`);
                codes.push(--codes.indent);
                codes.push(`}`);
            } else {
                let checker, converter;
                if (param.type === 'integer') {
                    checker = 'isInteger';
                    converter = 'parseInt';
                } else {
                    checker = 'isNumber';
                    converter = 'Number';
                }
                codes.push(`if (!type.${checker}(${name})) {`);
                codes.push(++codes.indent);
                codes.push(`${name} = ${converter}(${name});`);
                codes.push(`if (isNaN(${name})) ${name} = ${JSON.stringify(param.default)};`);
                codes.push(--codes.indent);
                codes.push(`}`);
                // minimum, maximum
                if (param.hasOwnProperty('minimum')) {
                    let flag = param.exclusiveMinimum ? '>' : '>=';
                    let checker = param.exclusiveMinimum ? 'isGreater' : 'isMin';
                    codes.push(`if (!rule.${checker}(${name}, ${param.minimum})) return ${makeError(name, errorTypes.OUT_OF_RANGE, param.minimum, flag)};`);
                }
                if (param.hasOwnProperty('maximum')) {
                    let flag = param.exclusiveMaximum ? '<' : '<=';
                    let checker = param.exclusiveMaximum ? 'isSmaller' : 'isMax';
                    codes.push(`if (!rule.${checker}(${name}, ${param.maximum})) return ${makeError(name, errorTypes.OUT_OF_RANGE, param.maximum, flag)};`);
                }
                // multipleOf
                if (param.hasOwnProperty('multipleOf')) {
                    codes.push(`if (!rule.isMultipleOf(${name}, ${param.multipleOf})) return ${makeError(name, errorTypes.INVALID_MULTIPLE_OF, param.multipleOf)};`);
                }
            }

            // pattern
            if (param.hasOwnProperty('pattern')) {
                let pattern = util.makeRegex(param.pattern);
                if (pattern) codes.push(`if (!${pattern}.test(${name})) return ${makeError(name, errorTypes.MISMATCH_PATTERN, pattern.toString())};`);
            }

            // enum
            if (param.hasOwnProperty('enum')) {
                codes.push(`if (!rule.isInEnum(${name}, ${JSON.stringify(param.enum)})) return ${makeError(name, errorTypes.NOT_IN_ENUM, String(param.enum))};`);
            }

            // format
            if (param.hasOwnProperty('format')) {
                let checker = util.getName(param.format);
                if (checker) {
                    if (/^isDate/.test(checker)) {
                        codes.push(`${name} = format.${checker}(${name});`);
                        codes.push(`if (${name} === null) return ${makeError(name, errorTypes.INVALID_FORMAT, param.format)};`);
                    } else {
                        codes.push(`if (!format.${checker}(${name})) return ${makeError(name, errorTypes.INVALID_FORMAT, param.format)};`);
                    }
                } else {
                    throw new Error(`Unknown format: ${param.format}`);
                }
            }

            // end required
            if (!isItem) {
                codes.push(--codes.indent);
                codes.push(`}`);
            }
        }
    }

    getRef(ref) {
        if (!ref) return ref;
        if (!util.isString(ref)) return util.copyJSON(ref);

        let refs = ref.split('/');
        try {
            let ref = this.spec[refs[1]][refs[2]];
            return util.copyJSON(ref);
        } catch(e) {
            return null;
        }
    }

    generate(name, codes) {
        var _codes = [], indent = 0;
        codes.forEach(code => {
            if (typeof code === 'number') {
                indent = code;
            } else {
                _codes.push(`${TAB.repeat(indent)}${code}`);
            }
        });

        var fn = `function ${name}(data, type, rule, format, collect){\n${_codes.join('\n')}\n}`;
        debug(`${fn}\n\n`);
        return new Function(`return ${fn}`)();
    }
}

module.exports = function(spec) {
    var compile = new Compile(spec);
    return compile.validations;
};
