/**
 * Created by Harold Reyes on 8/23/15.
 * Email: eharoldreyes@gmail.com
 * Phone: +639234353163
 * Skype: eharoldreyes
 */
var config    		= require(__dirname + '/../config/config').AWS.s3;
var utils    		= require(__dirname + '/../helpers/utils');
var Upload          = require('s3-uploader');
var streamingS3     = require('streaming-s3');
var fs              = require('fs');
var Promise         = require('promise');

exports.s3UploadImage = function (file, folder, callback) {
    return new Promise(function (resolve, reject) {
        var client = new Upload(config.bucket, {
            aws: {
                path: 'images/' + folder + "/",
                region: config.region,
                accessKeyId: config.access_key_id,
                secretAccessKey: config.secret_access_key,
                acl: 'public-read',
                httpOptions: {
                    timeout:60000
                },
                maxRetries:3
            },
            cleanup: {
                versions: true,
                original: false
            },
            versions: [{
                maxHeight: 720,
                maxWidth: 720,
                suffix: '-large'
            },{
                maxHeight: 100,
                aspect: '1:1',
                suffix: '-thumb'
            }]
        });
        client.upload(file.path, {}, (err, uploads, meta) =>  {
            fs.unlink(file.path, function () {
                if (err) {
                    err.from = "image.js:client.upload()";
                    reject(err);
                    if (callback)
                        callback(err);
                } else {
                    var uploaded = {
                        urlLarge: uploads[0].url,
                        urlThumb: uploads[1].url
                    };
                    resolve(uploaded);
                    if (callback)
                        callback(undefined, uploaded);
                }
            });
        });
    });
};

exports.s3StreamFile = function (file, callback) {
    return new Promise(function (resolve, reject) {
        var filePath = file.path;
        var fStream = fs.createReadStream(filePath);
        var cgf = {
            accessKeyId: config.access_key_id,
            secretAccessKey: config.secret_access_key
        };
        var options = {
            Bucket: config.bucket,
            Key: "builds/" + file.filename,
            ContentType: file.mimetype,
            ACL: "public-read"
        };
        var uploader = new streamingS3(fStream, cgf, options);
        uploader.on('finished', function (res, stats) {
            fs.unlink(filePath, function (error) {
                if(error) {
                    reject(error);
                    if(callback) callback(error);
                } else {
                    var s = {url:"https://" + config.bucket + ".s3.amazonaws.com/" + res.Key, mimetype: file.mimetype};
                    resolve(s);
                    if(callback) callback(undefined, s);
                }
            });
        });
        uploader.on('error', function (error) {
            fs.unlink(filePath, function () {
                error.from = "image.js:s3StreamVideo()";
                reject(error);
                if(callback) callback(error);
            });
        });
        uploader.begin();
    });
};