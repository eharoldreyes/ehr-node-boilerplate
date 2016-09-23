/**
 * Created by eharoldreyes on 2/9/16.
 */
'use strict';
const queryString     = require('querystring');
const request         = require('superagent');
const Promise         = require('promise');
const config    		= require(__dirname + '/../config/config').CHIKKA;
const utils           = require(__dirname + "/../helpers/utils");

exports.send = (mobile_number, message, callback) => {
    const p = mobile_number.trim().replaceAll(" ", "");
    const phone = p.substring(p.length - 10);
    const body = {
        message_type: "SEND",
        mobile_number: "63" + phone,
        shortcode: config.shortcode,
        message_id: utils.random_string(16),
        message: message,
        client_id: config.client_id,
        secret_key: config.secret_key
    };
    return new Promise((resolve, reject) =>  {
        request.post("https://post.chikka.com/smsapi/request")
            .send(queryString.stringify(body))
            .set('Content-Type', 'text/html; charset=UTF-8')
            .end((err, result) =>  {
                if(err !== null && err !== undefined){
                    const error = JSON.parse(err.response.text);
                    error.statusCode = error.status;
                    error.from = "Chikka send";
                    delete error.status;
                    reject(error);
                    if(callback)
                        callback(error);
                } else {
                    const resp = JSON.parse(result.request.res.text);
                    if(resp.status !== 200){
                        resp.statusCode = resp.status;
                        resolve(resp);
                        if(callback)
                            callback(undefined, resp);
                    } else {
                        var tmp = {chikka:resp, body:body};
                        resolve(tmp);
                        if(callback)
                            callback(undefined, tmp);
                    }
                }
            });
    });
};