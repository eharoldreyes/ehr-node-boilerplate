'use strict';

module.exports = {
    ENV: 'development',

    CORS: {
        allowed_headers: 'Content-Type, Accept, x-access-token',
        allowed_origins: 'http://www.website.com',
        allowed_methods: 'GET, POST, PUT, OPTIONS, DELETE'
    },

    /*
    WARNING:
    Do not save production configuration variables here
     */

    MYSQL: {
        "use_env_variable":false,
        "logging": console.log, // or false
        "sync": false,
        "dialect": "mysql",
        "database": "iheartcdi",

        //Single
        "host": "127.0.0.1",
        "port": 3306,
        "username": "root",
        "password": "root"

        //Replica
        //"replication": {
        //    "write": {
        //        "host": "",
        //        "port":,
        //        "username": "",
        //        "password": ""
        //    },"read": [
        //        {
        //            "host": "",
        //            "port":,
        //            "username": "",
        //            "password": ""
        //        }
        //    ]
        //}
    },

    REDIS: {
        host: '127.0.0.1',
        port: 6379,
        password:"c0d3m4gnu5",
        enable_offline_queue:true,
        socket_keepalive:true
    },

    AWS: {
        "s3": {
            "region": "ap-southeast-1",
            "bucket": "somebucketname",
            "acl": "public-read",
            "access_key_id": "x",
            "secret_access_key": "xx"
        },
        "ses":{
            "host":"email-smtp.us-west-2.amazonaws.com",
            "port":465,
            "auth":{
                "user":"x",
                "pass":"xx"
            },
            "from": "Sender <email@domain.com>"
        }
    },

    GOOGLE: {
        "apiKey" : "x"
    },

    "CHIKKA":{
        "shortcode": "123123",
        "client_id" : "x",
        "secret_key" : "xx"
    }
};