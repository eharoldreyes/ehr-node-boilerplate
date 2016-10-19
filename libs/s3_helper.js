'use strict';
const StreamingS3 = require('streaming-s3');
const AWS = require('aws-sdk');
const Promise = require('promise');
const fs = require('fs');

/*
 const configSample = {
 accessKeyId: "",
 secretAccessKey: "",
 bucket: "",
 region: "",
 acl: ""
 };
 */

module.exports = config => {

    const baseUrl = "https://s3-" + config.region + ".amazonaws.com/" + config.bucket + "/";

    return {
        upload(file, key, callback){
            console.log(file);
            return new Promise((resolve, reject)=> {
                const filePath = file.path,
                    uploader = new StreamingS3(fs.createReadStream(filePath), {
                        accessKeyId: config.accessKeyId,
                        secretAccessKey: config.secretAccessKey
                    }, {
                        Key: key,
                        ContentType: file.mimetype,
                        Bucket: config.bucket,
                        ACL: config.acl
                    });

                uploader.on('finished', (res) => {
                    fs.unlink(filePath, (error) => {
                        if (error) {
                            reject(error);
                            if (callback) {
                                callback(error);
                            }
                        } else {
                            res.url = baseUrl + key;
                            res.original = file;
                            resolve(res);
                            if (callback) {
                                callback(null, res);
                            }
                        }
                    });
                });

                uploader.on('error', (error) => {
                    fs.unlinkSync(filePath);
                    reject(error);
                    if (callback) {
                        callback(error);
                    }
                });

                uploader.begin();

            });
        },

        update(file, key, callback){
            return this.del([key]).then((result) => {
                return this.upload(file, result.url);
            }).then(res => {
                if(callback) {
                    callback(undefined, res);
                }
                return res;
            }).catch(err => {
                if(callback) {
                    callback(err);
                }
                throw err;
            });
        },

        del(keys, callback) {
            return new Promise((resolve, reject) => {

                const AWS = require('aws-sdk'),
                    params = {
                        Bucket: config.bucket,
                        Delete: {
                            Objects: [],
                            Quiet: true
                        }
                    };

                AWS.config.update({
                    accessKeyId: config.accessKeyId,
                    secretAccessKey: config.secretAccessKey,
                    region: config.region
                });

                const s3 = new AWS.S3({params: {Bucket: config.bucket}});

                keys.forEach(key => {
                    params.Delete.Objects.push({Key: key.replace(baseUrl, "")});
                });

                s3.deleteObjects(params, (err, data) =>  {
                    if(err){
                        if(callback) {
                            callback(err);
                        }
                        reject(err);
                    } else {
                        if(callback) {
                            callback(undefined, data);
                        }
                        resolve(data);
                    }
                });
            });
        }
    }
};

