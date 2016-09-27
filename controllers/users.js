/**
 * Created by eharoldreyes on 9/26/16.
 */
'use strict';
const Auth          = require(__dirname + '/../controllers/authorization');
const models        = require(__dirname + '/../models');
const User          = models.user;

module.exports = {
    login
    //logout,
    //register,
    //forgotPassword,
    //changePassword,
    //updateAccount
};

function login(req, res, next) {
    //filter body sanitize
    let query = {
        where:{
            email:req.body.email,
            password:req.body.password
        }
    };
    return User.findOne(query).then(user => {
        if(!user)
            throw new Error("LOGIN_FAILED");

        return Auth.createToken(user).then(token => {
            delete user.password;
            res.set('x-access-token', token);
            res.status(200).send(user);
        });
    }).catch(next);
}

