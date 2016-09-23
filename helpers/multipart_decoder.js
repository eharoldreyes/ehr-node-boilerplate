/**
 * Created by eharoldreyes on 6/29/16.
 */
'use strict';
const Qs = require('qs');
const Log = require(__dirname + "/../libs/Log");

module.exports = (req, res, next) =>  {
    if (req.get('Content-Type') && req.get('Content-Type').indexOf('multipart/form-data') == 0) {
        Object.keys(req.body).forEach( (key) => {
            req.body[key] = Qs.parse(key + "=" + req.body[key])[key];
        });
    }
    Log.v("Multipart-Form", req.body);
    next();
};