'use strict';

const crypto = require('crypto');
const config = require(__dirname + '/../config/config');

module.exports = {
    hash,
    encrypt,
    decrypt,
    encryptSync,
    decryptSync
};

function hash(string, length, iterations) {
    return new Buffer(crypto.pbkdf2Sync(string, config.SALT, iterations || 5000, length || 64), 'binary').toString('base64');
}

function encrypt(data, callback) => {
    const cipher = crypto.createCipher(config.ENCRYPT, config.SALT);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    callback(encrypted);
}

function decrypt(data, callback) => {
    const decipher = crypto.createDecipher(config.ENCRYPT, config.SALT);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    decrypted = JSON.parse(decrypted);
    callback(decrypted);
}

function encryptSync(data) => {

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

function decryptSync(data) => {

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