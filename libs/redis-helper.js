/**
 * Created by eharoldreyes on 6/15/16.
 */
'use strict';
const Promise = require("promise");
const redis = require("redis");
let client;

module.exports = function (config) {
    client = redis.createClient(config);
    return {
        //Default
        set:set,
        get:get,

        //Hash
        createHash,
        getHash,

        //List
        createList,
        addList,
        pushListRight,
        pushListLeft,
        getListValues,
        getListRange,

        //Set
        createSet,
        addSetMember,
        addSetMembers,
        isSetMember,
        getSetMembers,
        removeSetMember,

        //Options
        expire,
        del
    };
};

function handleReply(resolve, reject, callback) {
    return (err, reply) => {
        if(err){
            reject(err);
            if(callback) callback(err);
        } else {
            resolve(reply);
            if(callback) callback(undefined, reply);
        }
    }
}

//Value Pair
function set(key, value, callback, overwrite) {
    return new Promise(function (resolve, reject) {
        exists(key).then(function (exists) {
            if(exists && !overwrite){
                reject({error:true, message: "Key already exists."});
            } else {
                client.set(key, value, handleReply(resolve, reject, callback));
            }
        });
    });
}

function get(key, callback) {
    return new Promise(function (resolve, reject) {
        client.get(key, handleReply(resolve, reject, callback));
    });
}

//Hash
function createHash(key, hash, callback) {
    return new Promise(function (resolve, reject) {
        client.hmset(key, hash, handleReply(resolve, reject, callback));
    });
}

function getHash(key, callback) {
    return new Promise(function (resolve, reject) {
        client.hgetall(key, handleReply(resolve, reject, callback));
    });
}

//List
function createList(key, array, callback) {
    return pushListRight(key, array, callback);
}

function addList(key, object, callback) {
    return pushListRight(key, [object], callback);
}

function pushListRight(key, array, callback) {
    return new Promise(function (resolve, reject) {
        array.splice(0, 0, key);
        client.rpush(array, handleReply(resolve, reject, callback));
    });
}

function pushListLeft(key, array, callback) {
    return new Promise(function (resolve, reject) {
        array.splice(0, 0, key);
        client.lpush(array, handleReply(resolve, reject, callback));
    });
}

function getListValues(key, callback) {
    return getListRange(key, 0, -1, callback);
}

function getListRange(key, from, to, callback) {
    return new Promise(function (resolve, reject) {
        client.lrange(key, from, to, handleReply(resolve, reject, callback));
    });
}

function createSet(key, member, callback) {
    return new Promise(function (resolve, reject) {
        member.splice(0, 0, key);
        client.sadd(member, handleReply(resolve, reject, callback));
    });
}

function addSetMember(key, member, callback) {
    return addSetMembers(key, [member], callback);
}

function isSetMember(key, member, callback){
    return new Promise((resolve, reject) =>{
        client.sismember(key, member, function(err, reply) {
            if(err){
                reject(err);
                if(callback) callback(err);
            } else {
                var bool = reply === 1;
                resolve(bool);
                if(callback) callback(undefined, bool);
            }
        });
    });
}

function addSetMembers(key, members, callback) {
    return getSetMembers(key).then(function (array) {
        if(!array) array = [];
        members.forEach(function (member) {
            if(!array.contains(member)) array.push(member);
        });
        return createSet(key, array, callback);
    });
}

function getSetMembers(key, callback) {
    return new Promise(function (resolve, reject) {
        client.smembers(key, handleReply(resolve, reject, callback));
    });
}

function removeSetMember(key, member, callback) {
    return new Promise(function (resolve, reject) {
        client.srem(key, member, handleReply(resolve, reject, callback));
    });
}

//Options
function expire(key, seconds, callback) {
    return new Promise(function (resolve, reject) {
        exists(key).then(function (exists) {
            if(exists){
                client.expire(key, seconds, handleReply(resolve, reject, callback));
            } else {
                reject({error:true, message: "Key doesn't exists."});
            }
        });
    });
}

//Check
function exists(key, callback) {
    return new Promise(function (resolve, reject) {
        client.exists(key, function(err, reply) {
            if(err){
                reject(err);
                if(callback) callback(err);
            } else {
                var bool = reply === 1;
                resolve(bool);
                if(callback) callback(undefined, bool);
            }
        });
    });
}

function del(key, callback) {
    return new Promise(function (resolve, reject) {
        client.del(key, handleReply(resolve, reject, callback));
    });
}
