var util = require('./util');

const delimiters = {
    csv: ',',
    ssv: ' ',
    tsv: '\t',
    pipes: '|'
};
const formats = Object.keys(delimiters);

module.exports = function(data, format) {
    if (!util.isString(data)) return data;
    var d = delimiters[format];
    if (!d) throw new Error(`Unknown collection format, ${format}. It could only be ${String(formats)}`);
    return data.split(d);
};
