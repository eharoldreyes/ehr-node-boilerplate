/**
 * Created by eharoldreyes on 9/28/16.
 */

const GLOBAL            = require(__dirname + "/GLOBAL");
const HttpRequest       = require(__dirname + "/../libs/httpRequest");
const utils             = require(__dirname + "/../helpers/utils");
const User              = require(__dirname + "/objects/user");
const $                 = GLOBAL.getInstance();
const expect            = require("expect.js");
const Promise           = require("promise");

describe("Super Admin", function () {
    it("should register new user", function () {
        let user = User();
        this.timeout($.timeout);
        return HttpRequest.POST($.baseUrl + "/register", {
            headers:{
                Accept: 'application/json'
            },
            body: user
        }).then(function (result) {
            if(result.body.error){
                console.log("result.body", result.body);
            } else {
                expect(result.body.error).to.eql(false);
                if(!$.users) $.users = [];
                result.body.user.password = user.password;
                $.users.push(result.body.user);
                GLOBAL.save();
            }
        });
    });
    it("should login new user", function () {
        this.timeout($.timeout);
        var user = $.users[$.users.length - 1];
        return HttpRequest.POST($.baseUrl + "/login", {
            headers:{
                Accept: 'application/json'
            },
            body: user
        }).then(function (result) {
            if (result.body.error){
                console.log("result.body", result.body);
            } else {
                user.access_token = result.body.user.access_token;
                GLOBAL.save();
            }

            console.log(result);

            expect(result.body.error).to.eql(false);
            expect(err).to.eql(null);
        });
    });
});