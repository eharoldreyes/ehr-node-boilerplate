/**
 * Created by eharoldreyes on 9/22/16.
 */
'use strict';
const winston = require('winston');
const fs = require('fs');
const path = __dirname + '/../logs/';
const Console = winston.transports.Console;

winston.addColors({
    debug: 'white',
    verbose: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red'
});

const logger = new winston.Logger({
    transports: [
        new Console({
            name:"warn-console",
            handleExceptions: true,
            colorize: true,
            level: 'warn'
        }),
        new Console({
            name:"error-console",
            handleExceptions: true,
            colorize: true,
            level: 'error'
        })
    ]
});

if(process.env.NODE_ENV !== "production"){
    logger.add(Console, { name:"debug-console", colorize: true, level: 'debug'});
    logger.add(Console, { name:"verbose-console", colorize: true,level: 'verbose' });
    logger.add(Console, { name:"info-console", colorize: true,level: 'info' });
} else {
    logger.add(winston.transports.File, {filename: path + process.env.NODE_ENV + '-error.log', level: 'error' });
}

module.exports = global.Log = {
    v, d, i, w, e,
    verbose: v, debug:d, info:i, warn:w, error:e
};

/**
 * Send a {@link #VERBOSE} log message and log the exception.
 * @param tag Used to identify the source of a log message.  It usually identifies
 *        the class or activity where the log call occurs.
 * @param msg The message you would like logged.
 * @param tr An exception to log
 */
function v(tag, msg, tr){
    return logger.verbose(tag, msg || "", tr || {});
}

/**
 * Send a {@link #DEBUG} log message and log the exception.
 * @param tag Used to identify the source of a log message.  It usually identifies
 *        the class or activity where the log call occurs.
 * @param msg The message you would like logged.
 * @param tr An exception to log
 */
function d(tag, msg, tr){
    return logger.debug(tag, msg || "", tr || {});
}

/**
 * Send a {@link #INFO} log message and log the exception.
 * @param tag Used to identify the source of a log message.  It usually identifies
 *        the class or activity where the log call occurs.
 * @param msg The message you would like logged.
 * @param tr An exception to log
 */
function i(tag, msg, tr){
    return logger.info(tag, msg || "", tr || {});
}

/**
 * Send a {@link #WARN} log message and log the exception.
 * @param tag Used to identify the source of a log message.  It usually identifies
 *        the class or activity where the log call occurs.
 * @param msg The message you would like logged.
 * @param tr An exception to log
 */
function w(tag, msg, tr){
    return logger.warn(tag, msg || "", tr || {});
}

/**
 * Send a {@link #ERROR} log message and log the exception.
 * @param tag Used to identify the source of a log message.  It usually identifies
 *        the class or activity where the log call occurs.
 * @param msg The message you would like logged.
 * @param tr An exception to log
 */
function e(tag, msg, tr){
    return logger.error(tag, msg || "", tr || {});
}


/*file : extras/logs.sql
 CREATE TABLE `logtest`.`sys_logs_default` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `level` VARCHAR(16) NOT NULL,
 `message` VARCHAR(512) NOT NULL,
 `meta` VARCHAR(1024) NOT NULL,
 `timestamp` DATETIME NOT NULL,
 PRIMARY KEY (`id`));
 );
 */