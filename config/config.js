'use strict';

const _ = require('lodash');
const path = require('path');

const config = {
    APP_NAME: 'App name',

    FRONTEND_URL: 'localhost',

    PORT: 3000,

    CLUSTERED: process.env.NODE_CLUSTERED || false,

    HASH:{
        SALT: 'NaCl',
        SECRET: 'itss0m3th1ng',
        ENCRYPT: 'aes192'
    },

    TOKEN:{
        ALGO: 'HS256',
        EXPIRATION: 60 * 60 * 24 * 30 * 7
    },

    RESOURCES_DIR: path.normalize(__dirname + '/../res'),
    UPLOAD_DIR: path.normalize(__dirname + '/../tmp/uploads/'),
    LOGS_DIR: path.normalize(__dirname + '/../logs'),

    use: (env) => {
        _.assign(config, require(__dirname + '/env/' + env));
        return config;
    }

};

if (!process.env.NODE_ENV)
    process.env.NODE_ENV = 'development';

module.exports = config.use(process.env.NODE_ENV);