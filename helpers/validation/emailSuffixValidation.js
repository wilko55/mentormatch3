const models = require('../../models');

const ValidEmailSuffixes = models.validEmailSuffixes;
// let emailSuffix = 'gov.uk';

module.exports = {
  emailAddress: (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  emailSuffix: (email) => {
    let suffix = email.split('@')[1];
    return ValidEmailSuffixes.findOne({
      where: {
        emailSuffix: suffix
      }
    }).then((data) => {
      return !!data;
    });
  }
};
