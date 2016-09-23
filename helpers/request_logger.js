/**
 * Created by eharoldreyes on 6/29/16.
 */
'use strict';
module.exports = (req, res, next) => {
    Log.d("Agent", req.get("User-Agent"));
    Log.d("Address", req.headers["x-forwarded-for"] || req.connection["remoteAddress"]);
    Log.d("Method", req.method);
    Log.d("Params", req.params);
    Log.d("Query", req.query);
    Log.d("Body", req.body);
    next();
};