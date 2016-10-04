'use strict';

module.exports = {
    isMissing,
    isUuid,
    isEmail,
    isImage,
    isVideo,
    isTextFile,
    isApplication,
    isAudio,
    isURL,
    isValidDate,
    isValidQuery,
    checkRequiredFields,
    checkArrayRequiredFields,
    containsMultipleValue,
    containsSpecialChar,
    getData
};

function isMissing(str) {
    return (!str || str.trim().length === 0);
}

function isUuid(str) {
    return str.match("[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}");
}

function isEmail(str) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
}

function isImage(file) {
    return file && /^image\/(jpe?g|png|gif)$/i.test(file.mimetype);
}

function isVideo(file) {
    return file && /^video\/(MP2T|x-flv|mp4|x-mpegURL|MP2T|3gpp|quicktime|x-msvideo|x-ms-wmv)$/i.test(file.mimetype);
}

function isAudio(file) {
    return /^audio\/(aac|mp4|mpeg|ogg|wav|webm|mp3)$/i.test(file.mimetype);
}

function isApplication(file) {
    return file && /^application\/(java-archive|x-java-archive)$/i.test(file.mimetype);
}

function isTextFile(file) {
    return file && /^text\/(csv|xls)$/i.test(file.mimetype);
}

function isURL(test) {
    return /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/.test(test);
}

function checkRequiredFields(json, keys) {
    const missing = [];
    if (!json) return keys;
    keys.forEach((key) =>  {
        if (json[key] === undefined) {
            missing.push(key);
        }
    });
    return missing;
}

function checkArrayRequiredFields(array, keys) {
    const missing = [];
    array.forEach(function (obj) {
        keys.forEach(function (key) {
            if (!(key in obj) || obj[key].length == 0) {
                if (!((key in missing)))
                    missing.push(key);
            }
        });
    });

    return missing;
}

function isValidDate(d) {
    if (Object.prototype.toString.call(d) !== "[object Date]")
        return false;
    return !isNaN(d.getTime());
}

function isValidQuery(query, arr) {
    return query && arr.indexOf(query) > -1;
}

function containsMultipleValue(objects, keyToCheck) {
    const rows = [];
    objects.forEach((object) =>  {
        if (('' + object[keyToCheck]).indexOf(rows) === -1) {
            rows.push('' + object[keyToCheck]);
        } else {
            return true;
        }
    });
    return false;
}

function containsSpecialChar(str) {
    const iChars = "~`!#$%^&*+=-[]\\\';,/{}|\":<>?_";
    for (let i = 0; i < str.length; i++) {
        if (iChars.indexOf(str.charAt(i)) != -1)
            return true;
    }
    return false;
}

function getData(source, sample, ref){
    return new Promise((resolve, reject) => {
        const final = {};
        let hasError = false,
            temp;
        if (typeof sample !== typeof source || (Array.isArray(sample) !== Array.isArray(source)))
            reject(new Error('Sample-Source type mismatch'));
        if (Array.isArray(sample)) {
            temp = source.map((a, index) => {
                const ret = _validatePrimitiveValues(sample, 0, source, index, ref + `[${index}]`);
                hasError = ret instanceof Error ? ret : false;
                return ret;
            });
            if(hasError)
                reject(hasError)
            else
                resolve(temp);
        }
        for (let prop in sample) {
            if (sample.hasOwnProperty(prop)) {
                let source_prop = prop,
                    data;
                if (prop[0] === '_')
                    source_prop = prop.slice(1);
                data = _validatePrimitiveValues(sample, prop, source, source_prop, (ref ? ref + '.' : '') + prop);
                if (data instanceof Error)
                    reject(data);
                if (typeof data !== 'undefined')
                    final[source_prop] = data;
            }
        }
        resolve(final);
    });
}

function _validatePrimitiveValues(sample, prop, source, source_prop, ref) {
    let source_type = typeof source[source_prop];
    const type = typeof sample[prop];

    if (type === 'string' && sample[prop]) {
        source_type = type;
        source[source_prop] = sample[prop];
    }

    if ((source_type === 'undefined' && prop[0] !== '_') || (source_type === 'string' && !source[source_prop])){
        let err = new Error("INC_DATA");
        err.desc = ref + ' is missing';
        return err;
    }
    if (source_type !== 'undefined' && source_type !== type) {
        let err = new Error("INV_DATA");
        err.desc = ref + ' invalid type';
        return err;
    }
    if (type === 'object')
        return getData(sample[prop], source[source_prop], ref);
    return source[source_prop];
}