'use strict';

(function (auth) {

    let hasher = require('./hasher.js');
    let jwt = require('jsonwebtoken');
    let passport = require('passport');
    let JwtStrategy = require('passport-jwt').Strategy;
    let data = require('../data/index.js');
    let secret = 'secret1';
    let config = {
        secretOrKey: 'secret1'
    };

    auth.init = function (app) {
        app.set('secret', "secret1");
        app.use(passport.initialize());
    };

    function verifyUser(email, password, next) {

        data.getAccountByEmail(email, function (err, user) {
            if (!err && user) {
                var testHash = hasher.computeHash(user.password, user.salt);
                if (testHash === user.passwordHash) {
                    next(null, user);
                    return;
                }
            }
            next(null, false, { message: 'Invalid credentials ' });
        });
    };

    passport.use(new JwtStrategy(config, function (payload, next) {
      
        data.findAccountById(payload.id, function (err, user) {
            if (err) {
                return next(err, false);
            }
            if (user) {
                next(null, user);
            }

            else {
                next(null, false);
            }
        });
    }));

    auth.createToken = function (id) {
        return jwt.sign({id: id}, secret, {
            expiresIn: 86400 //24 hours
        });
    }

    auth.passport = passport;
    
})(module.exports);