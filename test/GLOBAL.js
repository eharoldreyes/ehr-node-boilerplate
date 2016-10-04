/**
 * Created by eharoldreyes on 8/11/16.
 */
const config          = require(__dirname + "/../config/config");
const logFolder       = __dirname + "/logs/";
const saveFilePath    = logFolder + process.env.NODE_ENV + "_log.json";
const fs              = require('fs');
const jsonfile        = require('jsonfile');
const host            = config.FRONTEND_URL;
const port            = config.PORT;

module.exports = (function () {
    var instance;

    function createInstance() {
        return {
            baseUrl:"http://" + host + ":" + port,
            config:config,
            port:port,
            timeout:50000
        };
    }

    return {
        getInstance: function () {
            if(!fs.existsSync(logFolder))
                fs.mkdirSync(logFolder);

            if(fs.existsSync(saveFilePath))
                instance = jsonfile.readFileSync(saveFilePath);

            if (!instance)
                instance = createInstance();

            return instance;
        },
        save: function () {
            if(instance){
                jsonfile.writeFileSync(saveFilePath, instance);
            }
        },
        clear: function () {
            if(fs.existsSync(saveFilePath))
                fs.unlinkSync(saveFilePath);
        }
    };
})();