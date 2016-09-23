/**
 * Created by eharoldreyes on 6/29/16.
 */
'use strict';
const self = function () {
    if(!String.prototype.sanitize){
        String.prototype.sanitize = function () {
            return this.replace(/[^A-Za-z0-9,_-]/g, '');
        }
    }
    if (!Number.prototype.trim) {
        Number.prototype.trim = function () {
            return this;
        };
    }
    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) === 0;
        };
    }
    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }
    if(!Array.prototype.contains){
        Array.prototype.contains = function(element){
            return this.indexOf(element) > -1;
        };
    }
    if(!Array.prototype.containsAll){
        Array.prototype.containsAll = function(haystack){
            var needles = this;
            for(var i = 0 , len = needles.length; i < len; i++){
                if(!haystack.contains(needles[i])) return false;
            }
            return true;
        };
    }
    if (!Array.prototype.containsAny) {
        Array.prototype.containsAny = function (allowedRoles) {
            var result = this.filter(function (item) {
                return allowedRoles.indexOf(item) > -1;
            });
            return (result.length > 0);
        }
    }
    if(!String.prototype.getBytes){
        String.prototype.getBytes = function () {
            var bytes = [];
            for (var i = 0; i < this.length; ++i) {
                bytes.push(this.charCodeAt(i));
            }
            return bytes;
        };
    }
    if(!String.prototype.replaceAll){
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.split(search).join(replacement);
        };
    }
    if(!Date.prototype.toMysqlFormat){
        Date.prototype.toMysqlFormat = function() {
            return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
        };
    }
};

module.exports = self();

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}