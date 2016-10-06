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
    /**
     * @api {post} /login Login User
     * @apiDescription
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @apiHeader {String} x-access-token Authentication Token
     *
     * @apiSuccess {String} email       Email of user
     * @apiSuccess {String} password    Password of user
     *
     * @apiSuccessExample Sample-Response:
     * http/1.1 200 OK
     * {
     *      "message":"Success",
     *      "user": {
     *
     *      },
     *      "error": false
     * }
     **/
    login,
    logout,
    register,
    changePassword
    //updateAccount
    //retrieveById
    //retrieveAll
};


function login(req, res, next) {

    /* Validates the required fields of req.body */
    validator.validateFields(req.body, ["email", "password"]).then((body)=> {

        /* Find the user instance */
        return User.findOne({
            where: {
                email: body.email,
                password: crypt.hash(body.password)
            }
        });
    }).then(user => {

        /* Throws a new error if no user was found be passed to next() handled by error_handler.js */
        if (!user)
            throw new Error("LOGIN_FAILED");

        return Auth.createToken(user).then(token => {
            delete user.password;

            /* Sends Response */
            res.set('x-access-token', token);
            res.status(200).send({error: false, message: "Logged in", user: user});
        });
    }).catch(next);
}

function logout(req, res, next){

    /* Clears the token from redis member */
    redis.removeSetMember(`jwt_${req.session.user.id}`, req.session.token).then(() => {

        /* Sends Response */
        res.status(200).send({error:false, message: "Logged out"});
    }).catch(next);
}

function register(req, res, next){

    /* Validates the required fields of req.body */
    validator.validateFields(req.body, ["email", "password", "firstName", "lastName", "phone"]).then((newUser) => {

        /* Converts password to hash value */
        newUser.password = crypt.hash(newUser.password);

        /* Inserts a persistent user instance to database */
        return User.create(newUser);
    }).then(user => {

        /* Sends Response */
        res.status(200).send({error: false, message: "Registered", user: user});
    }).catch(next);
}

function changePassword(req, res, next){
    const user = req.session.user;

    /* Validates the required fields of req.body */
    validator.validateFields(req.body, ["oldPassword", "newPassword", "confirmPassword"]).then((body) => {

        /* Throws a new PASSWORD_MISMATCH error if old password doesn't match the old password */
        if(body.confirmPassword !== body.newPassword || user.password !== body.oldPassword)
            throw new Error(new Error("PASSWORD_MISMATCH"));

        /* Clears the token from redis member */
        return redis.removeSetMember(`jwt_${user.id}`, req.session.token);
    }).then(function () {

        /* Updates the user instance password value to new password */
        return user.update({password:body.newPassword});
    }).then(function () {

        /* Sends Response */
        res.status(200).send({error: false, message: "Updated"});
    }).catch(next);
}