'use strict';

const EmailSender = require('../../../helpers/emailSender');
const chai = require("chai");
const mailgun = require('mailgun-js');
const models = require('../../../models');

const User = models.user;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const emailLogger = require('../../../helpers/emailLogger');

const expect = chai.expect;
chai.use(sinonChai);

describe('The emailSender class', () => {
  let emailData;
  let sandbox = sinon.sandbox.create();

  beforeEach(() => {
    emailData = {
      id: 1,
      commsEmail: 1,
      email: 'andyjwilko@gmail.com',
      name: 'Andy Wilko'
    };
    sinon.stub(emailLogger, 'log').returns(Promise.resolve());
    sandbox.stub(mailgun({ apiKey: 'foo', domain: 'bar' }).Mailgun.prototype, 'messages')
    .returns({
      send: (data, cb) => cb()
    });
    sinon.stub(EmailSender, 'getUserData').returns(Promise.resolve(emailData));
  })

  afterEach(() => {
    sandbox.restore();
    emailLogger.log.restore();
    EmailSender.getUserData.restore();
  })

  describe('sendToSelf method', () => {
    beforeEach(() => {
      sinon.stub(EmailSender, 'getCorrectEmail').returns(Promise.resolve({id: 1}));
      sinon.stub(EmailSender, 'getEmailBody');
    })

    afterEach(() => {
      EmailSender.getCorrectEmail.restore();
      EmailSender.getEmailBody.restore();
    })

    it('sends an email from one user to another', () => {
      let emailSender = new EmailSender(1, 'reply', 1, undefined, emailData);
      emailSender.sendEmail();
      setTimeout(() => {
        expect(EmailSender.getUserData).to.have.been.calledTwice;
        expect(EmailSender.getEmailBody).to.have.been.calledOnce;
        expect(mailgun({ apiKey: 'foo', domain: 'bar' }).Mailgun.prototype.messages).to.have.been.calledOnce;
        expect(emailLogger.log).to.have.been.calledWith(1, 1, 'Send to self', 'passwordReset');
        done();
      }, 20);
    });

  });

  describe('sendToSelf method', () => {
    it('sends and logs an email to that user', (done) => {
      let emailSender = new EmailSender(1, 'passwordReset', {}, 'Reset your Mentor Match password', emailData.email);
      emailSender.sendToSelf(emailData);
      setTimeout(() => {
        expect(mailgun({ apiKey: 'foo', domain: 'bar' }).Mailgun.prototype.messages).to.have.been.calledOnce;
        expect(emailLogger.log).to.have.been.calledWith(1, 1, 'Send to self', 'passwordReset');
        done();
      }, 10);
    });

  });

  describe('sendToAnonUser method', () => {
    afterEach(() => {
      User.findByEmail.restore();
    });

    it('sends and logs an email if a user is not found', (done) => {
      sinon.stub(User, 'findByEmail').returns(Promise.resolve());

      let emailSender = new EmailSender(1, 'verifyEmail', 2, 'Please verify your email address', emailData);
      emailSender.sendToAnonUser(emailData);
      setTimeout(() => {
        expect(User.findByEmail).to.have.been.calledOnce;
        expect(mailgun({ apiKey: 'foo', domain: 'bar' }).Mailgun.prototype.messages).to.have.been.calledOnce;
        expect(emailLogger.log).to.have.been.calledWith(0, undefined, 'Send to anon - no user found', 'verifyEmail');
        done();
      }, 10);
    });

    it('sends and logs an email if a user is found', (done) => {
      sinon.stub(User, 'findByEmail').returns(Promise.resolve({ id: 1 }));

      let emailSender = new EmailSender(1, 'verifyEmail', 2, 'Please verify your email address', emailData);
      emailSender.sendToAnonUser(emailData);
      setTimeout(() => {
        expect(User.findByEmail).to.have.been.calledOnce;
        expect(mailgun({ apiKey: 'foo', domain: 'bar' }).Mailgun.prototype.messages).to.have.been.calledOnce;
        expect(emailLogger.log).to.have.been.calledWith(0, undefined, 'Send to anon - sending to user 1', 'verifyEmail');
        done();
      }, 10);
    });
  });
});
