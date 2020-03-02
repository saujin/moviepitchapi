'use strict';

(function (stripeGateway) {

  var stripe = require('stripe')(process.env.STRIPE_ACCESS_TOKEN);
  //test data...
  stripeGateway.testCustomer = {
    email: 'psymilan@yahoo.com',
    description: 'this is a test user',
    card: {
      name: 'test',
      number: '4111111111111111',
      exp_month: 10,
      exp_year: 2019
    }
  };

  stripeGateway.createCustomer = function (customer) {
    return new Promise(function (resolve, reject) {
      stripe.customers.create(customer, function (err, customer) {
        if (err) {
          reject(err)
        } else {
          resolve(customer);
        }
      });
    });
  };

  stripeGateway.createCharge = function (payload) {
    return new Promise(function (resolve, reject) {
      stripe.charges.create(payload, function (err, charge) {
        if (err) {
          reject(err)
        } else {
          resolve(charge);
        }
      });

    });
  }

})(module.exports)