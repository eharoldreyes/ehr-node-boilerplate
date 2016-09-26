/**
 * Created by eharoldreyes on 6/29/16.
 */
'use strict';
module.exports = (req, res, next) => {
    Log.d(req.params["0"], {
        method:req.method,
        agent:req.get("User-Agent"),
        address:req.headers["x-forwarded-for"] || req.connection["remoteAddress"]
    });
    if(Object.keys(req.params).length > 0)
        Log.d("Params", req.params);
    if(Object.keys(req.query).length > 0)
        Log.d("Query", req.query);
    if(req.method !== "GET")
        Log.d("Body", req.body);

    next();
};