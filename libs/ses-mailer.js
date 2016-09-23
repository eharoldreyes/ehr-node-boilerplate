/**
 * Created by eharoldreyes on 9/22/15.
 */
var smtpTransport = require('nodemailer-smtp-transport');
var sesTransport = require('nodemailer-ses-transport');
var emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');
var Promise = require('promise');
var templatesDir = require('path').join(__dirname, '/../templates');
var config = require(__dirname + '/../config/config');

//var transporter     = nodemailer.createTransport(smtpTransport(config.ses));

var transporter = nodemailer.createTransport(sesTransport({
    AWSAccessKeyID: config.ses.temp_access_key_id,
    AWSSecretKey: config.ses.temp_secret_access_key
}));


exports.mail = function (template, from, to, subject, data, callback) {

    return new Promise(function (resolve, reject) {
        emailTemplates(templatesDir, function (err, tmp) {
            if (err) {
                console.log("Error loading templates", err);
                if (callback) callback(err);
                reject(err);
            } else {
                tmp(template, data, function (err, html, text) {
                    if (err) {
                        console.log("Error loading data to template", err);
                        if (callback) callback(err);
                        reject(err);
                    } else {
                        transporter.sendMail({
                            from: from || config.ses.from,
                            to: to,
                            subject: subject,
                            html: html
                        }, function (err, res) {
                            if (err) {
                                console.log("Error sending mail", err);
                                if (callback) callback(err);
                                reject(err)
                            } else {
                                resolve(res);
                            }
                        });
                    }
                });
            }
        });
    });

};
