'use strict';

(function (paymentController) {

  let stripe = require('../services/stripe.js');

  paymentController.init = function (app) {

    app.post('/stripe/create_customer', function (req, res) {

      let payload = {
        email: req.body.email,
        desciption: req.body.description,
        card: req.body.card
      }

      stripe.createCustomer(payload)
        .then(function (result) { res.json(result) })
        .catch(function (error) { res.status(400).json(error) });
    });

    app.post('/stripe/create_charge', function (req, res) {

      let payload = {
        amount: req.body.amount,
        currency: req.body.currency,
        source: req.body.source,
        description: req.body.description
      }

      stripe.createCharge(payload)
        .then(function (result) {
          res.json(result);
        })
        .catch(function (error) {
          res.status(400).json(error);
        });
    });
  }

})(module.exports);


