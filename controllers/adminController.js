'use strict';

(function (adminController) {

  let data = require('../data/index.js');
  let hasher = require('../auth/hasher.js');
  let helper = require('../helpers/index.js');
  let auth = require('../auth/index.js');

  adminController.init = function (app) {

    app.post('/admin/register',
      auth.passport.authenticate('jwt', { session: false }),
      function (req, res) {

        var errors = helper.validateBody(req);
        if (errors) {
          res.status(400).json(errors);
          return;
        }

        let salt = hasher.createSalt();

        let account = {
          name: req.body.name,
          email: req.body.email,
          passwordHash: hasher.computeHash(req.body.password, salt),
          salt: salt
        };

        data.accountExists(account.email).then(function () {
          return data.createAdminAccount(account);
        }).then(function () {
          res.json({
            success: true,
            message: 'account created'
          });
        }).catch(function (error) {
          res.status(400).json({
            success: false,
            message: error.message
          });
        });
      });

    app.post('/admin/login', function (req, res) {

      let email = req.body.email;
      let password = req.body.password;

      data.getAccountByEmail(email).then(function (user) {
        if (user) {
          var testHash = hasher.computeHash(password, user.salt);
          if (testHash === user.passwordHash) {
            // success
            let token = auth.createToken(user.id);

            res.json({
              success: true,
              message: 'Token created',
              token: token
            });
          } else {
            res.status(400).json({ message: "Invalid credentials" });
          }
        } else {
          res.status(400).json({ message: "Something bad happened" });
        }
      }).catch(function (error) {
        res.status(400).json(error);
      });
    });

    app.get('/admin/destination_emails',
      auth.passport.authenticate('jwt', { session: false }),
      function (req, res) {
        data.getDestinationEmails().then(function (results) {
          res.json(results)
        }).catch(function (error) {
          res.status(400).json(error)
        })
      })

    app.post('/admin/add_destination_email',
      auth.passport.authenticate('jwt', { session: false }),
      function (req, res) {

        if (!req.body.email_address) {
          res.status(400).json({
            message: "Email is not optional",
            success: false
          })
        }

        const email = {
          email_address: req.body.email_address
        }

        data.insertEmail(email).then(function (result) {
          res.json({
            message: "email address added successfully",
            success: true
          })
        }).catch(function (error) {
          res.status(400).json({
            message: error.message,
            success: false
          })
        })
      })

    app.get('/admin/remove_email/:email',
      auth.passport.authenticate('jwt', { session: false }),
      function (req, res) {

        const email = req.params.email

        data.removeEmail(email).then(function (result) {
          res.json({
            message: "Removed email from db",
            success: true
          })
        }).catch(function (error) {
          res.status(400).json({
            message: "Could not remove email from db",
            success: false
          })
        })
      })

    app.get('/admin/users',
      auth.passport.authenticate('jwt', { session: false }),
      function (req, res) {
        data.findAllAccounts().then(function (results) {
          res.json(results);
        }).catch(function (err) {
          res.status(400).json({
            message: "Something went wrong",
            success: false
          })
        })
      })


    app.get('/admin/delete/:id',
      auth.passport.authenticate('jwt', { session: false }),
      function (req, res) {
        if (!req.params.id) {
          return res.status(400).json({
            message: "Id cannot be empty",
            success: false
          })
        }
        let id = req.params.id;

        data.deleteAdminAccount(id).then(function (result) {

          res.json({
            message: 'Account removed',
            success: true
          })

        }).catch(function (err) {
          res.status(400).json({
            message: err,
            success: false
          })
        })
      })

    app.get('/admin/check_auth',
      auth.passport.authenticate('jwt', { session: false }),
      function (req, res) {
        res.json({
          message: 'if you see this, its ok',
          success: true
        });
      })
  };


})(module.exports);