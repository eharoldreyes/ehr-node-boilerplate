/**
 * Created by eharoldreyes on 9/22/16.
 */
'use strict';
const redis         = require(__dirname + '/../libs/redis-helper');
const _strings      = require(__dirname + '/../res/values/strings');
const config        = require(__dirname + '/../config/config');
const jwt           = require('jsonwebtoken');
const Promise       = require('promise');

module.exports = {
    authorize,
    createToken,
    validateToken
};

function authorize(param) {
    return function (req, res, next) {
        validateToken(req.get("x-access-token") || req.headers["x-access-token"]).then(user => {
            const optns = { allowAll: false, allowed: []};
            if (Array.isArray(param))
                optns.allowed = param;
            else
                optns.allowAll = param.allowAll || false;
            if (optns.allowAll)
                optns.allowed = [_strings.ADMIN, _strings.PROGRAMMER];
            if (optns.allowAll && (optns.allowed === undefined || optns.allowed.length === 0))
                throw new Error("Missing allowed roles");

            req.session = {
                authorized: user !== undefined,
                user: user
            };
            if(optns.allowed.contains(user.role))
                next();
            else
                throw new Error("FORBIDDEN");
        }).catch(next);
    };
}

function createToken(user){
    return crypto.encrypt(user.dataValues || user).then(encrypted =>  {
        return jwt.sign(encrypted, config.SECRET, {
            algorithm: config.TOKEN.ALGO,
            expiresIn: config.TOKEN.EXPIRATION
        }).then(token =>  {
            return redis.set(`jwt_${user.id}`, token).then(() => {
                return token;
            });
        });
    });
}

function validateToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.SECRET, {algorithms : [config.TOKEN.ALGO]}, (err, user) => {
            if (err)
                reject(err);
            else
                resolve(user);
        });
    }).then(user => {
        if (!user)
            throw new Error("FORBIDDEN");
        return redis.isSetMember(`jwt_${user.id}`, token).then(isMember => {
            if(!isMember)
                throw new Error("FORBIDDEN");
            return user;
        });
    });
}