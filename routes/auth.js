const authController = require('../controllers/auth.js');
const middleware = require('../middleware');
const csurf = require('csurf');

const csrfProtection = csurf({ cookie: true });

module.exports = function (app, passport) {
  app.get('/logout', authController.logout);

  app.get('/login', middleware.sendAuthedUserToProfile, csrfProtection, authController.login);

  app.post('/login', csrfProtection, authController.localLogin);

  app.get('/auth/linkedin',
    passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));

  app.get('/auth/linkedin/callback', csrfProtection, authController.linkedInLogin);
};
