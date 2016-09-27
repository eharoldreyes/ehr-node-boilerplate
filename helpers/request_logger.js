/**
 * Created by eharoldreyes on 6/29/16.
 */
'use strict';
module.exports = (req, res, next) => {
    const request = {
        url: req.params["0"],
        method:req.method,
        agent:req.get("User-Agent"),
        address:req.headers["x-forwarded-for"] || req.connection["remoteAddress"]
    };
    if(Object.keys(req.params).length > 0)
        request.params = req.params;
    if(Object.keys(req.query).length > 0)
        request.query = req.query;
    if(req.method !== "GET")
        request.body = req.body;

    Log.i("Request Logger", request);
    next();
};