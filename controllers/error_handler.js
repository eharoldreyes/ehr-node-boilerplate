/**
 * Created by eharoldreyes on 9/24/16.
 */
const ERROR_CODES = require(__dirname + '/../res/values/errors');

module.exports = (error, req, res, next) => {
    if(!error)
        return next();

    const err = error.toJSON();
    const ERROR = ERROR_CODES[err.name || err.message] || ERROR_CODES["INTERNAL_SERVER_ERROR"];


    //TODO know if client error or system error(database, program)

    if(ERROR.code === 500)
        Log.e("INTERNAL_SERVER_ERROR", err.message, err.stack);

    res.status(ERROR.code).send({
        error: true,
        message: ERROR.message || err.message,
        error_desc: err.desc,
        error_log: err.errors, //process.env.NODE_ENV !== 'production' ||
        error_stack: (ERROR.code === 500 || process.env.NODE_ENV !== 'production') ? err.stack : undefined
    });
};