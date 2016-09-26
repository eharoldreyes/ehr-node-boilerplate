'use strict';

const loremIpsum = require('lorem-ipsum');
const crypto = require('crypto');
const fs = require('fs');
const polyline = require('polyline');
const geolib = require('geolib');
const fsRotator = require('file-stream-rotator');
const moment = require('moment');

module.exports = {
    //GEO
    encodePolyline,
    decodePolyline,
    distanceBetweenPoints,

    //RANDOM
    randomString,
    randomHash,
    randomInt,
    randomFloat,

    //STRING
    toTitleCase,
    capsFirst,
    toBase64,
    generateWord,
    generateWords,
    generateSentence,

    //DATE
    dateToUTC,
    currentDate,
    toDay,

    //FILE
    rmDir,
    rmFile,
    getQuery,

    //OBJECT
    clone,
    deleteAttributes,
    getObjectByKeyValue,
    getLogStream

};

function getLogStream(dir){
    return fsRotator.getStream({
        filename: dir + '/access-%DATE%.' + process.env.cpu_number || 0 + '.log',
        frequency: 'daily',
        verbose: false,
        date_format: 'YYYY-MM-DD'
    });
}

function encodePolyline(latLngPairs) {
    return polyline.encode(latLngPairs);
}

function decodePolyline(latLngPairs) {
    return polyline.decode(latLngPairs);
}

function distanceBetweenPoints(latLngPair1, latLngPair2) { //returns value in meters
    return geolib.getDistance({latitude: latLngPair1[0], longitude: latLngPair1[1]}, {
        latitude: latLngPair2[0],
        longitude: latLngPair2[1]
    });
}

function toTitleCase(str) {
    return str ? str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : '';
}

function capsFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function currentDate() {
    const d = new Date();
    return [d.getFullYear(), this.pad(d.getMonth() + 1), this.pad(d.getDate())].join('-');
}

function toDay(str) {
    return str.replace("Mon", "M")
        .replace(/Tue(s?)/g, "T")
        .replace("Wed", "W")
        .replace(/Thurs|Th/g, "H")
        .replace("Fri", "F")
        .replace("Sat", "S");
}

function toBase64(string) {
    return new Buffer(string).toString('base64');
}

function randomString(l) {
    const length = parseInt(l) || 5;
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function randomHash() {
    var seed = crypto.randomBytes(20);
    return crypto.createHash('sha1').update(seed).digest('hex');
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function randomFloat(low, high) {
    return Math.random() * (high - low) + low;
}

function dateToUTC() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

function rmDir(dirPath) {
    try {
        const files = fs.readdirSync(dirPath);
        if (files.length > 0)
            for (let i = 0; i < files.length; i++) {
                let filePath = dirPath + '/' + files[i];
                if (fs.statSync(filePath).isFile())
                    fs.unlinkSync(filePath);
                else
                    rmDir(filePath);
            }
        return fs.rmdirSync(dirPath);
    } catch (e) {
        Log.e("rmDir", "Failed", e);
        return null;
    }
}

function rmFile(newPath) {
    try {
        fs.unlinkSync(newPath);
    } catch (e) {
        Log.e("rmFile", "Failed", e);
        return null;
    }
}

function getQuery(query) {
    if (query && Array.isArray(query)) {
        return query[0];
    } else {
        return query;
    }
}

function generateWord() {
    return loremIpsum({
        count: 1,
        units: 'sentences',
        sentenceLowerBound: 1,
        sentenceUpperBound: 1,
        format: 'plain',
        random: Math.random
    }).replace(".", "");
}

function generateWords(count) {
    return loremIpsum({
        count: count,
        units: 'words',
        sentenceLowerBound: 1,
        sentenceUpperBound: count || exports.randomInt(1, 15),
        format: 'plain',
        random: Math.random
    });
}

function generateSentence(count) {
    return loremIpsum({
        count: exports.randomInt(1, 7),
        units: 'sentences',
        sentenceLowerBound: 5,
        sentenceUpperBound: count || exports.randomInt(1, 15),
        format: 'plain',
        random: Math.random
    });
}

function deleteAttributes(obj, attrs) {
    attrs.forEach((attr) =>  {
        delete obj[attr];
    });
    return obj;
}

function getObjectByKeyValue(object, keyToFind, valueToMatch) {
    for (let rawObject in object) {
        if (object.hasOwnProperty(rawObject) && object[rawObject][keyToFind] === valueToMatch) return rawObject;
    }
}