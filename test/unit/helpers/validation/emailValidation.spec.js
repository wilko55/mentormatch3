'use strict';

const validation = require('../../../../helpers/validation/emailValidation');
const proxyquire = require('proxyquire');
const assert = require('assert');
const should = require('should');

describe('The validate emailAddress function', function () {
  it('should return a false when an invalid email is entered', function () {
    let expectedResult = false;
    let result = validation.emailAddress('not-an-email');

    assert.equal(result, expectedResult);
  });

  it('should return true when a valid email is entered', function () {
    let expectedResult = true;
    let result = validation.emailAddress('test@email.com');

    assert.equal(result, expectedResult);
  });
});

describe('The validate emailSuffix function', () => {
  it('should return false when an invalid suffix is found', function (done) {
    let mockedEmailSuffixes = proxyquire('../../../../helpers/validation/emailValidation', { '../../models':
    {
      validEmailSuffixes: {
        findOne: function () {
          return Promise.resolve({ id: 1 });
        }
      }
    } });

    mockedEmailSuffixes.emailSuffix('test')
    .then((emailSuffixIsValid) => {
      emailSuffixIsValid.should.equal(true);
      done();
    });
  });

  it('should return false when an invalid suffix is found', function (done) {
    let mockedEmailSuffixes = proxyquire('../../../../helpers/validation/emailValidation', { '../../models':
    {
      validEmailSuffixes: {
        findOne: function () {
          return Promise.resolve(null);
        }
      }
    } });

    mockedEmailSuffixes.emailSuffix('test')
    .then((emailSuffixIsValid) => {
      emailSuffixIsValid.should.equal(false);
      done();
    });
  });
});
