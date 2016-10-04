'use strict';

const crypto = require('crypto');
const Promise = require('promise');
const config = require(__dirname + '/../config/config').HASH;

module.exports = {
    hash,
    encrypt,
    decrypt,
    encryptSync,
    decryptSync
};

function hash(string, hash, length, iterations) {
    return new Buffer(crypto.pbkdf2Sync(string, hash || 'sha1', iterations || 5000, length || 64), 'binary').toString('base64');
}

function encrypt(data, callback) {
    return new Promise(function (resolve, reject) {
        try {
            let encrypted = encryptSync(data);
            if (callback)
                callback(undefined, encrypted);
            resolve(encrypted)
        } catch (e) {
            reject(e);
            if (callback)
                callback(e);
        }
    });
}

function decrypt(data, callback) {
    return new Promise(function (resolve, reject) {
        try {
            let decrypted = decryptSync(data);
            if (callback)
                callback(undefined, decrypted);
            resolve(decrypted)
        } catch (e) {
            reject(e);
            if (callback)
                callback(e);
        }
    });

}

function encryptSync(data) {

    if (typeof data === 'object') {
        data = JSON.stringify(data);
    } else if (typeof data === 'number') {
        data = data.toString();
    } else if (typeof data !== 'string') {
        throw new TypeError('Data must be object or number');
    }

    const cipher = crypto.createCipher(config.ENCRYPT, config.SALT);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

function decryptSync(data) {

    const decipher = crypto.createDecipher(config.ENCRYPT, config.SALT);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    try {
        decrypted = JSON.parse(decrypted);
    } catch (e) {

        try {
            decrypted = parseInt(decrypted);
        } catch (e) {
            return decrypted;
        }

    }

    return decrypted;
}