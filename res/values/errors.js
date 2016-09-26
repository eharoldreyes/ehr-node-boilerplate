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
        code: 403,
        message: 'String is too short or too long'
    },
    INV_CHAR: {
        code: 403,
        message: 'String contains invalid character'
    },
    INC_DATA: {
        code: 403,
        message: 'Incomplete request data'
    },
    INV_QUERY: {
        code: 403,
        message: 'Error in query'
    },
    INV_LOGIN: {
        code: 403,
        message: 'Login failed'
    },
    INV_EMAIL: {
        code: 403,
        message: 'Email is already in use'
    },
    NO_TOKEN: {
        code: 403,
        message: 'No token is provided'
    },
    NO_RECORD_FOUND: {
        code: 400,
        message: 'No record was found'
    },
    NO_RECORD_CREATED: {
        code: 403,
        message: 'No record was created'
    },
    NO_RECORD_UPDATED: {
        code: 403,
        message: 'No record was updated'
    },
    NO_RECORD_DELETED: {
        code: 403,
        message: 'No record was deleted'
    },
    ZERO_RES: {
        code: 403,
        message: 'Database returned no result'
    },
    DUP_ENTRY: {
        code: 403,
        message: 'Duplicate insert entry'
    },
    UNAUTH: {
        code: 403,
        message: 'Unauthorized access'
    }
};