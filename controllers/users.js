/**
 * Created by eharoldreyes on 9/26/16.
 */
'use strict';
const Auth          = require(__dirname + '/../controllers/authorization');
const validator     = require(__dirname + '/../helpers/validator');
const redis         = require(__dirname + '/../libs/redis-helper');
const crypt         = require(__dirname + '/../libs/cryptography');
const models        = require(__dirname + '/../models');
const Promise       = require("promise");
const User          = models.user;

module.exports = {
    login,
    logout,
    register
    //changePassword,
    //updateAccount
};

function login(req, res, next) {
    validator.validateFields(req.body, ["email", "password"]).then(()=> {
        return User.findOne({
            where: {
                email: req.body.email,
                password: crypt.hash(req.body.password)
            }
        });
    }).then(user => {
        if (!user)
            throw new Error("LOGIN_FAILED");

        return Auth.createToken(user).then(token => {
            delete user.password;
            res.set('x-access-token', token);
            res.status(200).send({error: false, message: "Logged in", user: user});
        });
    }).catch(next);
}

function logout(req, res, next){
    redis.removeSetMember(`jwt_${req.session.user.id}`, req.session.token).then(() => {
        res.status(200).send({error:false, message: "Logged out"});
    }).catch(next);
}

function register(req, res, next){
    validator.validateFields(req.body, ["email", "password", "firstName", "lastName", "phone"]).then(() => {
        let newUser = req.body;
        newUser.password = crypt.hash(newUser.password);
        return User.create(newUser);
    }).then(user => {
        res.status(200).send({error: false, message: "Registered", user: user});
    }).catch(next);
}