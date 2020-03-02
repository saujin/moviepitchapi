'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Email = new Schema({
    email_address: String
    
}, { collection: 'emails'});

module.exports = mongoose.model('Email', Email);
