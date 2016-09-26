/**
 * Created by eharoldreyes on 9/22/16.
 */
'use strict';
const models = require(__dirname + '/../models');
const _strings = require(__dirname + '/../res/values/strings');

module.exports = {
    authorize,
    authenticate
};

function authorize(param) {
    var optns = { allowAll: false, allowed: []};
    if (Array.isArray(param))
        optns.allowed = param;
    else
        optns.allowAll = param.allowAll || false;
    if (optns.allowAll)
        optns.allowed = [_strings.ADMIN, _strings.PROGRAMMER];
    if (optns.allowAll && (optns.allowed === undefined || optns.allowed.length === 0))
        throw new Error("Missing allowed roles");

    return function (req, res, next) {
        authenticate(req.get("Access-Token") || req.headers["Access-Token"]).then(function (user) {
            req.session = {
                authorized: user !== undefined,
                user: user
            };
            if(optns.allowed.contains(user.role))
                next();
            else
                throw new Error("PAGE_NOT_FOUND");
        }).catch(next);
    };
}

function authenticate(accessToken) {
    return models.Users.findOne({where: {$or: [{token: accessToken}, {web_token: accessToken}]}}).then(function (user) {
        if (!user)
            throw new Error("NO_RECORD_FOUND");
        return user;
    });
}