'use strict';

const crypto = require('../../../helpers/crypto');
const chai = require("chai");

const expect = chai.expect;
const text = 'To be encrypted';

describe('The crypto library', () => {
  describe('encrypt function', () => {
    it('returns encrypted text using crypto library', () => {
      expect(crypto.encrypt(text)).to.equal('bcea540e1467a7262948b03ee24cc8');
    });
  });

  describe('decrypt function', () => {
    it('returns decrypted text using crypto library', () => {
      expect(crypto.decrypt('bcea540e1467a7262948b03ee24cc8')).to.equal(text);
    });
  });
});
