/**
 * Created by eharoldreyes on 9/22/16.
 */
'use strict';

const fs = require('fs');

/**
 Function load
 @description
 `require`s every module in the given array,
 return object where the required objects are attached
 @params     [] path     modules
 @params     {} attach   where the required files should be attached
 @return     {} Object
 */
exports.load = function (modules, attach) {
    var varname;
    attach = attach || {};
    if (!Array.isArray(modules)) {
        modules = [modules];
    }
    modules.forEach(function (a) {
        varname = a.split('|');
        if (varname.length > 2) {
            attach[varname[1] || a.split('/').pop()] = require(varname[0])();
            //console.log(attach[varname[1]]);
        }
        else {
            attach[varname[1] || a.split('/').pop()] = require(varname[0]);
        }
    });
    return attach;
};


/**
 Function dirload
 @description
 Requires every js file inside the given folder,
 fires callback with 2 arguments, error and the object
 where the required objects are attached
 @params     path        folder path
 @params     callback    gets 2 arguments, error and object
 @params     attach      where the required files should be attached
 @return     undefined
 */
exports.dirload = function (path, cb, attach) {
    var imports = attach || {},

        start = function () {
            path = path.replace(/\/$/, '');
            fs.readdir(path, require_all_js);
        },

        require_all_js = function (err, files) {
            if (err) {
                return cb(err);
            }

            files.forEach(function (file) {
                if (file.slice(-3) !== '.js') {
                    return;
                }

                file = file.slice(0, -3);
                imports[file] = require(path + '/' + file);
            });

            cb(null, imports);
        };

    start();
};


/**
 Function dirloadSync
 @description
 Requires every js file inside the given folder,
 return object where the required objects are attached
 @params     path        folder path
 @params     attach      where the required files should be attached
 @return     Object {}
 */
exports.dirloadSync = function (path, attach) {
    var start = function (_path, imports) {
        var files = fs.readdirSync(_path),
            len = files.length,
            file;


        while (len--) {
            file = files[len];

            if (file.slice(-3) !== '.js') {
                if (fs.statSync(_path + '/' + file).isDirectory()) {
                    imports[file] = {};
                    start(_path + '/' + file, imports[file]);
                }

                continue;
            }

            file = file.slice(0, -3);
            imports[file] = require(_path + '/' + file);
        }

        return imports;
    };

    return start(path.replace(/\/$/, ''), attach || {});
};
