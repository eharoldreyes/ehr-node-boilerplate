/**
 * Created by haroldreyes on 8/23/15.
 */
'use strict';
const Qs            = require('qs');
const multer        = require("multer");
const mkdirp        = require('mkdirp');
const Log           = require(__dirname + "/../libs/Log");
const validator	    = require(__dirname + '/../helpers/validator');

var storage = multer.diskStorage({
        destination: (req, file, cb) =>  {
            let dir = "";
            if (validator.isImage(file)) {
                dir = __dirname + '/../tmp/uploads/images';
            } else if (validator.isVideo(file)) {
                dir = __dirname + '/../tmp/uploads/videos';
            } else if (validator.isAudio(file)) {
                dir = __dirname + '/../tmp/uploads/sounds';
            } else if (file.mimetype === 'application/java-archive' || file.mimetype === 'application/x-java-archive') {
                dir = __dirname + '/../tmp/uploads/builds';
            } else if(validator.isTextFile(file)) {
                dir = __dirname + '/../tmp/uploads/texts';
            } else if(validator.isApplication(file)) {
                dir = __dirname + '/../tmp/uploads/applications';
            } else {
                cb(new Error("Invalid file format."));
                return;
            }
            mkdirp(dir, (err) =>  {
                cb(err, dir);
            });
        }, filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + "." + file.originalname.substr(file.originalname.lastIndexOf('.') + 1));
        }
    }
);

module.exports = multer({
    storage: storage,
    fileFilter: (req, file, cb) =>  {
        if(validator.isTextFile(file) || validator.isImage(file) || validator.isVideo(file) || validator.isAudio(file)){
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});