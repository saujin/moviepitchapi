'use strict';

(function(hasher) {

    let crypto = require('crypto');

    hasher.createSalt = function() {
        let len = 8;
        return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').substring(0, len);
    };

    hasher.computeHash = function(source, salt) {
        
        let hmac = crypto.createHmac('sha1', salt);
        let hash = hmac.update(source);
        return hash.digest('hex');
    };

})(module.exports);