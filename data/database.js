'use strict';

(function (database) {

  const mongoose = require('mongoose');
  const Pitch = require('./models/Pitch.js');
  const Account = require('./models/Account.js');
  const Email = require('./models/Email.js');

  mongoose.connect(process.env.MONGOLAB_URI);

  database.getDb = function () {
    return {
      mongoose: mongoose,
      pitches: Pitch,
      accounts: Account,
      emails: Email
    };
  }
})(module.exports);