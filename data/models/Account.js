'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Account = new Schema({
    name: String,
    email: String,
    passwordHash: String,
    salt: String
    
}, { collection: 'accounts'});

module.exports = mongoose.model('Account', Account);
