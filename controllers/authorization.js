/**
 * Created by eharoldreyes on 9/22/16.
 */
'use strict';
const crypto        = require(__dirname + '/../libs/cryptography');
const strings       = require(__dirname + '/../res/values/strings');
const config        = require(__dirname + '/../config/config');
const redis         = require(__dirname + '/../libs/redis-helper')(config.REDIS);
const jwt           = require("jsonwebtoken-promisified");
const Promise       = require('promise');

module.exports = {
    authorize,
    createToken,
    validateToken
};

function authorize(param) {
    return function (req, res, next) {
        const token = req.get("x-access-token") || req.headers["x-access-token"];
        validateToken(token).then(user => {
            const optns = { allowAll: false, allowed: []};
            if (Array.isArray(param))
                optns.allowed = param;
            else
                optns.allowAll = param.allowAll || false;
            if (optns.allowAll)
                optns.allowed = [strings.ADMIN, strings.PROGRAMMER];
            if (optns.allowAll && (optns.allowed === undefined || optns.allowed.length === 0))
                throw new Error("Missing allowed roles");
            if(!optns.allowed.contains(user.role))
                throw new Error("FORBIDDEN");
            req.session = {
                authorized: user !== undefined,
                user: user,
                token: token
            };
            next();
        }).catch(next);
    };
}

function createToken(user){
    return crypto.encrypt(user.dataValues || user).then(encrypted =>  {
        return jwt.signAsync(encrypted, config.HASH.SECRET, {
            algorithm: config.TOKEN.ALGO
            //, expiresIn: config.TOKEN.EXPIRATION
        }).then(token =>  {
            return redis.addSetMember(`jwt_${user.id}`, token).then(() => {
                return token;
            });
        });
    });
}

function validateToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verifyAsync(token, config.HASH.SECRET, {algorithms: [config.TOKEN.ALGO]}, (err, user) => {
            if (err)
                reject(err);
            else
                resolve(user);
        });
    }).then(function (user) {
        if (!user)
            throw new Error("FORBIDDEN");
        return crypto.decrypt(user);
    }).then((user) => {
        return redis.isSetMember(`jwt_${user.id}`, token).then(isMember => {
            if (!isMember)
                throw new Error("FORBIDDEN");
            return user;
        });
    });
}