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
     * @api {post} /login Login
     * @apiDescription Login route for users
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @apiSuccess {String} email       Email of user
     * @apiSuccess {String} password    Password of user
     *
     * @apiSuccessExample Sample-Response:
     * http/1.1 200 OK
     * {
     *      "message":"Logged in",
     *      "user": {
     *
     *      },
     *      "error": false
     * }
     **/
    login,

    /**
     * @api {post} /logout Logout
     * @apiDescription Clears session from server
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @apiHeader {String} x-access-token Authentication Token
     *
     * @apiSuccessExample Sample-Response:
     * http/1.1 200 OK
     * {
     *      "message":"Logged out",
     *      "error": false
     * }
     **/
    logout,

    /**
     * @api {post} /register Register User
     * @apiDescription Registers new user
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @apiSuccess {String} email           Email of user
     * @apiSuccess {String} password        Password of user
     * @apiSuccess {String} firstName       First Name of user
     * @apiSuccess {String} [middleName]    Middle Name of user
     * @apiSuccess {String} lastName        Last Name of user
     * @apiSuccess {String} phone           Phone Number of user
     * @apiSuccess {String} [sss]           Social Security System Number
     * @apiSuccess {String} [birthday]      Date of birth
     * @apiSuccess {String} [hiredAt=NOW()] Date hired
     *
     * @apiSuccessExample Sample-Response:
     * http/1.1 200 OK
     * {
     *      "message":"Registered",
     *      "error": false
     * }
     **/
    register,

    /**
     * @api {post} /change/password Change Password
     * @apiDescription Updates user password
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @apiSuccess {String} oldPassword         Old password of user
     * @apiSuccess {String} newPassword         New password of user
     * @apiSuccess {String} confirmPassword     Confirm password of user
     *
     * @apiSuccessExample Sample-Response:
     * http/1.1 200 OK
     * {
     *      "message":"Updated",
     *      "error": false
     * }
     **/
    changePassword,
    updateUser,
    retrieveUserById,
    retrieveAllUsers,
    deleteUser
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

    /* Validates the required fields of req.body. Fields starting with _ are optional */
    validator.validateFields(req.body, [
        "email",
        "password",
        "firstName",
        "_middleName",
        "lastName",
        "phone",
        "_sss",
        "_birthday",
        "_hiredAt"
    ]).then((newUser) => {

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
    validator.validateFields(req.body, [
        "oldPassword",
        "newPassword",
        "confirmPassword"
    ]).then((body) => {

        /* Throws a new PASSWORD_MISMATCH error if old password doesn't match the old password */
        if(body.confirmPassword !== body.newPassword || user.password !== body.oldPassword)
            throw new Error("PASSWORD_MISMATCH");

        /* Updates the user instance password value to new password */
        return user.update({password:body.newPassword});
    }).then(function () {

        /* Clears the token from redis member */
        return redis.removeSetMember(`jwt_${user.id}`, req.session.token);
    }).then(function () {

        /* Sends Response */
        res.status(200).send({error: false, message: "Updated"});
    }).catch(next);
}

function updateUser(req, res, next) {
    /* Validates the required fields of req.body. Fields starting with _ are optional */
    validator.validateFields(req.body, [
        "_email",
        "_firstName",
        "_middleName",
        "_lastName",
        "_phone",
        "_sss",
        "_birthday",
        "_hiredAt"
    ]).then((newUser) => {

        /* Inserts a persistent user instance to database */
        return req.session.user.update(newUser);
    }).then(user => {

        /* Sends Response */
        res.status(200).send({error: false, message: "Updated", user: user});
    }).catch(next);
}

function retrieveUserById(req, res, next) {

}

function retrieveAllUsers(req, res, next) {

}

function deleteUser(req, res, next) {

}
