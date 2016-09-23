/**
 * Created by eharoldreyes on 6/15/16.
 */
var Promise = require("promise");
var redis = require("redis");

var helper = function (config) {
    var client = redis.createClient(config);

    var self = {};

    function handleReply(resolve, reject, callback) {
        return function(err, reply) {
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
    self.set = function (key, value, callback, overwrite) {
        return new Promise(function (resolve, reject) {
            self.exists(key).then(function (exists) {
                if(exists && !overwrite){
                    reject({error:true, message: "Key already exists."});
                } else {
                    client.set(key, value, handleReply(resolve, reject, callback));
                }
            });
        });
    };

    self.get = function (key, callback) {
        return new Promise(function (resolve, reject) {
            client.get(key, handleReply(resolve, reject, callback));
        });
    };


    //Hash
    self.createHash = function (key, hash, callback) {
        return new Promise(function (resolve, reject) {
            client.hmset(key, hash, handleReply(resolve, reject, callback));
        });
    };

    self.getHash = function (key, callback) {
        return new Promise(function (resolve, reject) {
            client.hgetall(key, handleReply(resolve, reject, callback));
        });
    };


    //List
    self.createList = function (key, array, callback) {
        return self.pushListRight(key, array, callback);
    };

    self.addList = function (key, object, callback) {
        return self.pushListRight(key, [object], callback);
    };

    self.pushListRight = function (key, array, callback) {
        return new Promise(function (resolve, reject) {
            array.splice(0, 0, key);
            client.rpush(array, handleReply(resolve, reject, callback));
        });
    };

    self.pushListLeft = function (key, array, callback) {
        return new Promise(function (resolve, reject) {
            array.splice(0, 0, key);
            client.lpush(array, handleReply(resolve, reject, callback));
        });
    };

    self.getListValues = function (key, callback) {
        return self.getListRange(key, 0, -1, callback);
    };

    self.getListRange = function (key, from, to, callback) {
        return new Promise(function (resolve, reject) {
            client.lrange(key, from, to, handleReply(resolve, reject, callback));
        });
    };

    //Set
    self.createSet = function (key, member, callback) {
        return new Promise(function (resolve, reject) {
            member.splice(0, 0, key);
            client.sadd(member, handleReply(resolve, reject, callback));
        });
    };

    self.addSetMember = function (key, member, callback) {
        return self.addSetMembers(key, [member], callback);
    };

    self.addSetMembers = function (key, members, callback) {
        return self.getSetMembers(key).then(function (array) {
            if(!array) array = [];
            members.forEach(function (member) {
                if(!array.contains(member)) array.push(member);
            });
            return self.createSet(key, array, callback);
        });
    };

    self.getSetMembers = function (key, callback) {
        return new Promise(function (resolve, reject) {
            client.smembers(key, handleReply(resolve, reject, callback));
        });
    };

    self.removeSetMember = function (key, member, callback) {
        return new Promise(function (resolve, reject) {
            client.srem(key, member, handleReply(resolve, reject, callback));
        });
    };

    //Options
    self.expire = function (key, seconds, callback) {
        return new Promise(function (resolve, reject) {
            self.exists(key).then(function (exists) {
                if(exists){
                    client.expire(key, seconds, handleReply(resolve, reject, callback));
                } else {
                    reject({error:true, message: "Key doesn't exists."});
                }
            });
        });
    };

    self.update = function (key, value, callback) {
        return new Promise(function (resolve, reject) {
            self.exists(key).then(function (exists) {
                if(exists){
                    client.get(key, handleReply(resolve, reject, callback));
                } else {
                    reject({error:true, message: "Key doesn't exists."});
                }
            });
        });
    };

    //Check
    self.exists = function (key, callback) {
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
    };

    //Delete
    self.delete = function (key, callback) {
        return new Promise(function (resolve, reject) {
            client.del(key, handleReply(resolve, reject, callback));
        });
    };

    return self;
};


module.exports = helper;