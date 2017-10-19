'use strict';
const middleware = require('../../../middleware');
const sinon = require('sinon');
const chai = require("chai");
const sinonChai = require("sinon-chai");
const expect = chai.expect;

chai.use(sinonChai);

describe('The middleware', function () {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      session: {
        destroy: sinon.spy()
      },
      user: {}
    };
    res = {
      redirect: sinon.spy()
    };
    next = sinon.spy();
  });

  describe('isAuthenticated', () => {
    it ('destroys the session and redirects if the user is not authenticated', () => {
      req.isAuthenticated = () => false;
      middleware.isAuthenticated(req, res, next);
      expect(req.session.destroy).to.have.been.calledOnce;
      expect(res.redirect).to.have.been.calledOnce;
      expect(next).to.not.have.been.called;
    });
    it ('calls next if the user is authenticated', () => {
      req.isAuthenticated = () => true;
      middleware.isAuthenticated(req, res, next);
      expect(req.session.destroy).to.not.have.been.called;
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('isAdmin', () => {
    it ('sets admin flag and adminLevel if user is an admin', () => {
      req.isAuthenticated = () => true;
      req.user.adminLevel = 1;
      middleware.isAdmin(req, res, next);
      expect(req.user.adminLevel1).to.equal(true);
      expect(req.user.admin).to.equal(true);
      expect(next).to.have.been.calledOnce;
    });

    it ('sets admin flag if the user is not an admin', () => {
      req.isAuthenticated = () => true;
      req.user.adminLevel = 0;
      middleware.isAdmin(req, res, next);
      expect(req.user.admin).to.equal(false);
      expect(next).to.have.been.called;
      expect(res.redirect).to.not.have.been.calledOnce;
    });

    it ('redirects if user is not authenticated', () => {
      req.isAuthenticated = () => false;
      middleware.isAdmin(req, res, next);
      expect(res.redirect).to.have.been.calledOnce;
      expect(next).to.not.have.been.called;
    });
  });

  describe('sendAuthedUserToProfile', () => {
    it ('redirects an authenticated user to the profile page', () => {
      req.isAuthenticated = () => true;
      middleware.sendAuthedUserToProfile(req, res, next);
      expect(res.redirect).to.have.been.calledOnce;
      expect(next).to.not.have.been.calledOnce;
    });
    it ('calls next if the user is not authenticated', () => {
      req.isAuthenticated = () => false;
      middleware.sendAuthedUserToProfile(req, res, next);
      expect(res.redirect).to.not.have.been.calledOnce;
      expect(next).to.have.been.calledOnce;
    });
  });
});
