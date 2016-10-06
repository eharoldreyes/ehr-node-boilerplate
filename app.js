'use strict';

const config        = require(__dirname + '/config/config');
const utils         = require(__dirname + '/helpers/utils');
const override      = require(__dirname + "/helpers/override");
const cors          = require(__dirname + "/libs/cors");
const Log           = require(__dirname + "/libs/Log");
const routes        = require(__dirname + "/routers/main");
const models        = require(__dirname + "/models");
const express       = require("express");
const cluster       = require('cluster');
const bodyParser    = require("body-parser");

const spawnServer   = () => {
    const app = express();

    app.set('case sensitive routing', true);
    app.set('x-powered-by', false);
    app.set('trust proxy', 1);

    app.use(cors(config.CORS));
    app.use(require("morgan")('combined', {stream: utils.getLogStream(config.LOGS_DIR)}));
    app.use(require("response-time")());
    app.use(require("helmet")());
    app.use(require("method-override")());
    app.use(bodyParser.urlencoded({extended: false, defer: true}));
    app.use(bodyParser.json());
    app.use(require('compression')());

    app.use('/documentation', express.static(__dirname + '/documentation'));
    app.use(routes(express.Router()));
    app.use(require(__dirname + "/helpers/error_handler"));
    app.listen(config.PORT, () => {
        Log.i('Starting', `${config.APP_NAME} at Environment ${config.ENV}`);
    });

    return app;
};

module.exports = models.sequelize.sync({force: models.config.sync}).then(() => {
    Log.i('Initializing', `${config.APP_NAME} at port ${config.PORT}`);

    if(!config.CLUSTERED)
        return spawnServer();

    if (cluster.isMaster) {
        for (let i = 0; i < require('os').cpus().length; i++) {
            cluster.fork({cpu_number: i});
        }

        Object.keys(cluster.workers).forEach(function (id) {
            let worker = cluster.workers[id];
            worker.cpu_number = --id;
        });

    } else {
        return spawnServer();
    }

    cluster.on('exit', function(worker, code, signal) {
        let cpu = worker.cpu_number;
        Log.e("Cluster Died", worker.process.pid, {cpu:cpu, code:code, signal:signal});
        Log.i("Starting a new cluster", {cpu:cpu});
        cluster.fork({cpu_number: cpu}).on('online', () => {
            let workers = cluster.workers,
                keys = Object.keys(workers);
            workers[keys[ keys.length - 1 ] ].cpu_number = cpu;
        });
    });

}).catch((err) => {
    Log.e("Database sync failed", err);
});