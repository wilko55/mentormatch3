'use strict';

const algorithm = 'aes-256-ctr';
const crypto = require('crypto');
const config = require('../config').config();

const password = config.cryptoPassword;

function encrypt(text) {
  let cipher = crypto.createCipher(algorithm, password);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  let decipher = crypto.createDecipher(algorithm, password);
  try {
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  } catch (err) {
    console.log('Crypto failed', err);
    return false;
  }
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
};
