/**
 * Created by eharoldreyes on 6/29/16.
 */
'use strict';
module.exports = (req, res, next) => {
    let remoteIp = req.headers["x-forwarded-for"] || req.connection["remoteAddress"];
    if(remoteIp.startsWith("::ffff:")) remoteIp = remoteIp.slice(7);
    const request = {
        url: req.params["0"],
        method:req.method,
        agent:req.get("User-Agent"),
        address:remoteIp
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