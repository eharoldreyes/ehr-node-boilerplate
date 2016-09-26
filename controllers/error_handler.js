/**
 * Created by eharoldreyes on 9/24/16.
 */
const ERROR_CODES = require(__dirname + '/../res/values/errors');

module.exports = (err, req, res, next) => {
    if(!err)
        return next();
    const ERROR = ERROR_CODES[err.message] || ERROR_CODES["INTERNAL_SERVER_ERROR"];

    if(ERROR.code === 500)
        Log.e("INTERNAL_SERVER_ERROR", err.message, err.stack);

    res.status(ERROR.code).send({
        error: true,
        message: ERROR.message || err.message,
        error_log: (process.env.NODE_ENV !== 'production' || ERROR.code === 500) ? err.stack : undefined
    });
};