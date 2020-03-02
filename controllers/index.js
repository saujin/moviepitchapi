'use strict';

(function (controllers) {

  let pitchController = require('./pitchController.js');
  let adminController = require('./adminController.js');
  let paymentController = require('./paymentController.js');
  let contactController = require('./contactController.js');

  controllers.init = function (app) {

    pitchController.init(app);
    adminController.init(app);
    paymentController.init(app);
    contactController.init(app);
  };

})(module.exports);