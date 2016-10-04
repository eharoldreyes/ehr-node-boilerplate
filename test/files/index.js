/**
 * Created by eharoldreyes on 8/11/16.
 */

var fs = require('fs');
var path = require('path');
var basename = path.basename(module.filename);
var files = {};

fs.readdirSync(__dirname).filter(function (file) {
    return fs.lstatSync(path.join(__dirname, file)).isDirectory();
}).forEach(function (folder) {
    var folderPath = path.join(__dirname, folder);
    fs.readdirSync(folderPath).filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename)
            && ((file.slice(-5) === '.jpeg')
            || (file.slice(-4) === '.jpg')
            || (file.slice(-4) === '.png')
            || (file.slice(-4) === '.gif')
            || (file.slice(-4) === '.bmp'));
    }).forEach(function (file) {
        if(!files[folder])
            files[folder] = [];

        files[folder].push({
            path: path.join(folderPath, file),
            fileName: file
        });
    });
});

module.exports = {
    getCollection:function () {
        return files;
    },
    getRandomPhoto: function (folder) {
        return files[folder][getRandomInt(0, files[folder].length)];
    },
    getPhoto: function (folder, index) {
        return files[folder][index];
    }
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}