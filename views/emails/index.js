'use strict';

module.exports = {
  email: require('./email.js'),
  reply: require('./reply.js'),
  verifyEmail: require('./verify-cs-email.js'),
  passwordReset: require('./password-reset'),
  reminder: require('./reminder'),
  notRightNow: require('./notRightNow'),
  chaser1: require('./chaser1'),
  dormantWarning: require('./dormantWarning'),
  loginAttemptsMaxed: require('./loginAttemptsMaxed')
};
