/**
 * Created by eharoldreyes on 2/16/16.
 */
'use strict';

const logRequest    = require(__dirname + '/../helpers/request_logger');
const __            = require(__dirname + '/../libs/importer').dirloadSync(__dirname + '/../controllers');
const upload        = require(__dirname + '/../libs/multer');
const $             = __.authorization.authorize;

module.exports = (router) => {
    router.all(		"*"								        , logRequest);

    //router.post(    "/login"					            , __.users.login);
    //router.get(     "/verify/:token"				        , __.users.verify);
    //router.post(    "/logout"						        , $({allowAll:true}), __.users.logout);
    //router.post(    "/forgot"						        , __.users.forgotPassword);
    //router.put(     "/password/:token"				        , __.users.resetPassword);
    //router.put(     "/change/password"				        , $({allowAll:true}), __.users.updatePassword);

    router.get("/test", (req, res) =>{
        res.status(200).send({message:"Killed"});
    });

    router.get("/kill", (req, res) =>{
        res.status(200).send({message:"Killed"});
        process.exit(0);
    });

    router.all(		"*", (req, res) =>  {
        res.status(404).send({error: true, message : "Page not found."});
    });

    return router;
};
