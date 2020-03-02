var app = require('../../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var mongoose = require("mongoose");
var nock = require('nock');
var sendgrid = require('sendgrid')(process.env['SENDGRID_USERNAME'], process.env['SENDGRID_PASSWORD']);

var Email = require("../../data/models/Email");

chai.use(chaiHttp);

describe('POST /contact', function() {
  Email.collection.drop();

  beforeEach(function(done){
    var newEmail = new Email({
      email_address: 'bat@mailer.email'
    });
    newEmail.save().then(function(err) {
      done();
    });

  });

  afterEach(function(done){
    Email.collection.drop();
    done();
  });

  describe('with valid args', function() {
    beforeEach(function(done){
      contactData = {
        email: 'abc@email.mail',
        name: 'abc name',
        message: 'abc message',
        subject: 'General'
      }
      var mock_sg = nock('https://api.sendgrid.com')
        .post('/api/mail.send.json')
        .reply(200, {
          message: 'success'
        });
      done();
    });

    it('should respond valid args', function(done) {
      chai.request(app)
      .post('/contact')
      .send(contactData)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        done();
      });
    });

    it('should respond valid json', function(done) {
      chai.request(app)
      .post('/contact')
      .send(contactData)
      .end(function(err, res) {
        expect(res.body).to.deep.equal({ success: true, message: 'Email successfully send' });
        done();
      });
    });


  });

  describe('with invalid args', function() {
    beforeEach(function(done){
      contactData = {
        email: 'aabc',
        name: 'abc name',
        message: 'abc message',
        subject: 'General'
      }
      var mock_sg = nock('https://api.sendgrid.com')
        .post('/api/mail.send.json')
        .reply(400, {
          message: 'error'
        });
      done();
    });

    it('should respond valid args', function(done) {
      chai.request(app)
      .post('/contact')
      .send(contactData)
      .end(function(err, res) {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        done();
      });
    });

    it('should respond valid json', function(done) {
      chai.request(app)
      .post('/contact')
      .send(contactData)
      .end(function(err, res) {
        expect(res.body).to.deep.equal({ success: false, message: 'sendgrid error' });
        done();
      });
    });


  });


});
