/**
 * Created by eharoldreyes on 9/22/15.
 */
const smtpTransport = require('nodemailer-smtp-transport');
const sesTransport = require('nodemailer-ses-transport');
const emailTemplates = require('email-templates');
const nodemailer = require('nodemailer');
const Promise = require('promise');
const templatesDir = require('path').join(__dirname, '/../templates');
const config = require(__dirname + '/../config/config').ses;

//var transporter     = nodemailer.createTransport(smtpTransport(config));

const transporter = nodemailer.createTransport(sesTransport({
    AWSAccessKeyID: config.temp_access_key_id,
    AWSSecretKey: config.temp_secret_access_key
}));

exports.mail = function (template, from, to, subject, data, callback) {
    return new Promise((resolve, reject) =>  {
        emailTemplates(templatesDir, (err, tmp) =>  {
            if (err) {
                console.log("Error loading templates", err);
                if (callback) callback(err);
                reject(err);
            } else {
                tmp(template, data, (err, html, text) =>  {
                    if (err) {
                        console.log("Error loading data to template", err);
                        if (callback) callback(err);
                        reject(err);
                    } else {
                        transporter.sendMail({
                            from: from || config.from,
                            to: to,
                            subject: subject,
                            html: html
                        }, (err, res) =>  {
                            if (err) {
                                Log.e("Error sending mail", err);
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
