/**
 * Created by eharoldreyes on 2/16/16.
 */
'use strict';

const logRequest    = require(__dirname + '/../helpers/request_logger');
const __            = require(__dirname + '/../controllers');
const upload        = require(__dirname + '/../libs/multer');
const strings       = require(__dirname + '/../res/values/strings');
const $             = __.authorization.authorize;

module.exports = (router) => {
    router.all(		"*"								        , logRequest);

    router.post(    "/register"					            , __.users.register);
    router.post(    "/login"					            , __.users.login);
    router.post(    "/logout"						        , $({allowAll:true}), __.users.logout);
    router.put(     "/change/password"				        , $({allowAll:true}), __.users.changePassword);

    router.get(     "/users"				                , $({allowAll:true}), __.users.retrieveAllUsers);
    router.get(     "/user/:id"				                , $({allowAll:true}), __.users.retrieveUserById);
    router.put(     "/user/:id"				                , $({allowAll:true}), __.users.updateUser);
    router.del(     "/user/:id"				                , $([strings.ADMIN]), __.users.deleteUser);

    router.get("/test", (req, res) =>{
        res.status(200).send({error: false, message:"test"});
    });

    router.get("/kill", (req, res) =>{
        res.status(200).send({error: false, message:"Killed"});
        process.exit(0);
    });

    router.all("*", (req, res, next) =>  {
        return next(new Error("PAGE_NOT_FOUND"));
    });

    return router;
};
