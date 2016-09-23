/**
 * Created by eharoldreyes on 8/22/16.
 */
'use strict';
const Promise = require("promise");
const superagent = require("superagent");

module.exports = {
    POST: function (url, optns, callback) {
        return new Promise(function (resolve, reject) {
            var agent = superagent.post(url);
            if(optns.headers && typeof optns.body === 'object')
                agent.set(optns.headers);
            if(optns.files && Array.isArray(optns.files)){
                if(optns.body)
                    Object.keys(optns.body).forEach(function (key) {
                        if(typeof optns.body[key] !== 'object')
                            i.field(key, optns.body[key]);
                    });
                optns.files.forEach(function (file) {
                    agent.attach(file[0], file[1]);
                });
            } else {
                if(optns.body && typeof optns.body === 'object')
                    agent.send(optns.body);
            }
            agent.end(function (err, result) {
                if(callback)
                    callback(err, result);
                if(err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    },
    GET: function (url, optns, callback) {
        return new Promise(function (resolve, reject) {
            var agent = superagent.get(url);
            if(optns.headers && typeof optns.body === 'object')
                agent.set(optns.headers);
            if(optns.queries && typeof optns.queries === 'object')
                agent.query(optns.queries);
            agent.end(function (err, result) {
                if(callback) callback(err, result);
                if(err) reject(err);
                else resolve(result);
            });
        });
    },
    PUT: function (url, optns, callback) {
        return new Promise(function (resolve, reject) {
            var agent = superagent.put(url);
            if(optns.headers && Array.isArray(optns.headers))
                optns.headers.forEach(function (header) {
                    agent.set(header[0], header[1]);
                });
            if(optns.files && Array.isArray(optns.files)){
                if(optns.body)
                    Object.keys(optns.body).forEach(function (key) {
                        if(typeof optns.body[key] !== 'object')
                            i.field(key, optns.body[key]);
                    });
                optns.files.forEach(function (file) {
                    agent.attach(file[0], file[1]);
                });
            } else {
                if(optns.body && typeof optns.body === 'object')
                    agent.send(optns.body);
            }
            agent.end(function (err, result) {
                if(callback) callback(err, result);
                if(err) reject(err);
                else resolve(result);
            });
        });
    },
    DELETE: function (url, optns, callback) {
        return new Promise(function (resolve, reject) {
            var agent = superagent.delete(url);
            if(optns.headers && Array.isArray(optns.headers))
                optns.headers.forEach(function (header) {
                    agent.set(header[0], header[1]);
                });
            if(optns.queries && Array.isArray(optns.queries))
                optns.queries.forEach(function (query) {
                    var q = {};
                    q[query[0]] = query[1];
                    agent.query(q);
                });
            agent.end(function (err, result) {
                if(callback) callback(err, result);
                if(err) reject(err);
                else resolve(result);
            });
        });
    }
};