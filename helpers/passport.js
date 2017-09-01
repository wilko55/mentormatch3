'use strict';

const bCrypt = require('bcrypt-nodejs');
const config = require('../config').config();
const LinkedInStrategy = require('passport-linkedin').Strategy;

module.exports = function (passport, user) {
  let User = user;
  let LocalStrategy = require('passport-local').Strategy;

  passport.use('local-signup', new LocalStrategy(
    {
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => {
      let generateHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };
      User.findOne({
        where: {
          email: email
        }
      }).then((user) => {
        if (user) {
          console.log('email already taken');
          return done(null, false, {
            message: 'That email is already taken'
          });
        } else {
          let userPassword = generateHash(password);
          let data =
            {
              email: email,
              password: userPassword,
              firstname: req.body.firstname,
              lastname: req.body.lastname
            };
          User.create(data).then((newUser) => {
            if (!newUser) {
              return done(null, false);
            }
            if (newUser) {
              return done(null, newUser);
            }
          });
        }
      });
    }
  ));

  passport.use('local-signin', new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => {
      let User = user;
      let isValidPassword = (userpass, password) => {
        return bCrypt.compareSync(password, userpass);
      };

      User.findOne({
        where: {
          email: email
        }
      }).then((user) => {
        if (!user) {
          return done(null, false, {
            message: 'Invalid username or password'
          });
        }

        if (!isValidPassword(user.password, password)) {
          return done(null, false, {
            message: 'Invalid username or password'
          });
        }
        let userinfo = user.get();
        return done(null, userinfo);
      }).catch((err) => {
        console.log("Error:", err);
        return done(null, false, {
          message: 'Something went wrong with your Signin'
        });
      });
    }
  ));

  passport.use(new LinkedInStrategy({
    consumerKey: config.linkedInAuth.consumerKey,
    consumerSecret: config.linkedInAuth.consumerSecret,
    callbackURL: config.linkedInAuth.callbackURL,
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline', 'picture-urls::(original)', 'picture-url']
  },
    function (token, tokenSecret, profile, done) {
      process.nextTick(function () {
        User.findOne({
          where: {
            linkedInId: profile.id
          }
        }).then((user) => {
          if (!user) {
            return done(null, false, {
              message: 'User profile not found.'
            });
          }
          let userinfo = user.get();
          return done(null, userinfo);
        }).catch((err) => {
          console.log("Error:", err);
          return done(null, false, {
            message: 'Something went wrong with your Signin'
          });
        });
      });
    }
  ));

  // serialize
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // deserialize
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });
};
