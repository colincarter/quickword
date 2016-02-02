'use strict';

const fs = require('fs');

module.exports.exists = function(path) {
    try {
        fs.accessSync(path, fs.F_OK);
        return true;
    } catch(err) {
        return false;
    }
};

module.exports.readFile = function(filename) {
    return new Promise((resolve, reject) => {
        let data = fs.readFileSync(filename, 'utf8');
        if(data) {
            resolve(data);
        } else {
            reject('error reading data');
        }
    });
}
