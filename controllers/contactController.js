'use strict';

(function (contactController) {

  const email = require('../services/email.js')
  const db = require('../data/database.js').getDb()
  contactController.init = function (app) {

    app.post('/contact/', function (req, res) {

      db.emails.find({}, function (err, results) {

        if (err) {
          return res.status(400).json(err)
        }
        let emails = results.map(function (i) { return i.email_address })
        const payload = {
          fromname: req.body.name,
          from: "contactus@moviepitch.com",
          subject: "from: " + req.body.email + " Subject: " + req.body.subject,
          text: req.body.message,
          to: emails
        }

        email.send(payload).then(function (result) {
          res.json({
            message: "Email successfully send",
            success: true
          })
        }).catch(function (error) {
          res.status(400).json({
            message: error.message,
            success: false
          })
        })
      })
    })
  }
})(module.exports);


