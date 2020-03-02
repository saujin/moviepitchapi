'use strict';

(function (helper) {

    helper.validateBody = function (req) {

        req.checkBody('name', 'Name cannot be empty').notEmpty();
        req.checkBody('email', 'Email cannot be empty').notEmpty();
        req.checkBody('password', 'password cannot be empty').notEmpty();
        
        return req.validationErrors();
    }


})(module.exports);