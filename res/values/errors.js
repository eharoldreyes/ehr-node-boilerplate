/**
 * Created by eharoldreyes on 9/26/16.
 */

module.exports = {
    INTERNAL_SERVER_ERROR: {
        code: 500
    },
    PAGE_NOT_FOUND: {
        code: 404,
        message: 'Page not found'
    },
    INV_SLEN: {
        code: 400,
        message: 'String is too short or too long'
    },
    INV_CHAR: {
        code: 400,
        message: 'String contains invalid character'
    },
    INC_DATA: {
        code: 400,
        message: 'Incomplete request data'
    },
    INV_QUERY: {
        code: 400,
        message: 'Error in query'
    },
    INV_LOGIN: {
        code: 400,
        message: 'Login failed'
    },
    INV_EMAIL: {
        code: 409,
        message: 'Email is already in use'
    },
    NO_TOKEN: {
        code: 401,
        message: 'No token is provided'
    },
    NO_RECORD_CREATED: {
        code: 204,
        message: 'No record was created'
    },
    NO_RECORD_UPDATED: {
        code: 204,
        message: 'No record was updated'
    },
    NO_RECORD_DELETED: {
        code: 204,
        message: 'No record was deleted'
    },
    NO_RECORD_FOUND: {
        code: 204,
        message: 'No record was found'
    },
    LOGIN_FAILED: {
        code: 204,
        message: 'Unable to login.'
    },
    DUP_ENTRY: {
        code: 409,
        message: 'Duplicate insert entry'
    },
    FORBIDDEN: {
        code: 403,
        message: 'Forbidden'
    }
};