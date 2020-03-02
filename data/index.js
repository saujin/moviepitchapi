'use strict';

(function (data) {

  let db = require('./database.js').getDb();
  let Promise = require('bluebird');

  data.getPitches = function (query, page, limit) {
    if (!limit) {
      limit = 50
    }
    if (!page) {
      page = 1
    }
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    return new Promise(function (resolve, reject) {
      db.pitches.paginate(query, { page: page, limit: limit }, function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };

  data.findPitchById = function (id) {
    return new Promise(function (resolve, reject) {
      db.pitches.findById(id).exec(function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };

  data.insertPitch = function (pitch) {
    return new Promise(function (resolve, reject) {
      db.pitches.create(pitch, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  data.updatePitch = function (query, updateDoc) {

    return new Promise(function (resolve, reject) {
      db.pitches.findOneAndUpdate(query, updateDoc, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    })

  };

  data.createAdminAccount = function (adminAccount) {
    return new Promise(function (resolve, reject) {
      db.accounts.create(adminAccount, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  data.accountExists = function (email) {

    return new Promise(function (resolve, reject) {

      db.accounts.count({ email: email }, function (err, count) {
        if (err || count > 0) {
          reject(new Error("Account with that email already exists"));
        } else {
          resolve();
        }
      });
    });
  }

  data.getAccountByEmail = function (email) {
    return new Promise(function (resolve, reject) {
      db.accounts.findOne({ email: email }, function (err, user) {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  };

  data.findAccountById = function (id, next) {
    db.accounts.findById(id, function (err, user) {
      if (err) {
        next(err, null);
      } else {
        next(null, user);
      }
    });
  }

  data.findAllAccounts = function () {
    return new Promise(function (resolve, reject) {
      db.accounts.find({}).exec(function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  data.getDestinationEmails = function () {
    return new Promise(function (resolve, reject) {
      db.emails.find({}).exec(function (err, results) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }

  data.insertEmail = function (email) {
    return new Promise(function (resolve, reject) {

      db.emails.count({ email_address: email.email_address }, function (err, count) {
        if (err || count > 0) {
          reject(new Error('Email already exists'))
        } else {
          db.emails.create(email, function (err, result) {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        }
      })
    })
  }

  data.removeEmail = function (email) {
    return new Promise(function (resolve, reject) {
      db.emails.findOneAndRemove({ email_address: email }, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  data.deleteAdminAccount = function (id, next) {
    return new Promise(function (resolve, reject) {

      db.accounts.remove({ _id: id }, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

})(module.exports);