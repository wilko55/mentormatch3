'use strict';

const profileController = require('../controllers/profile');
const middleware = require('../middleware');
const model = require('../models');
const csurf = require('csurf');
const config = require('../config').config();

const csrfProtection = csurf({ cookie: true });
const User = model.user;

module.exports = function (app) {
  app.get('/profile', middleware.isAuthenticated, profileController.getProfile);

  app.get('/edit-profile', middleware.isAuthenticated, middleware.liOrLocal, csrfProtection, function (req, res) {
    req.session.completedProfile = {};
    req.session.completedProfile.toDevelop = true;
    req.session.completedProfile.toOffer = true;

    let i;
    for (i = 1; i <= 6; i += 1) {
      if (req.user['toDevelop' + i]) {
        req.session.completedProfile.toDevelop = false;
      }
      if (req.user['toOffer' + i]) {
        req.session.completedProfile.toOffer = false;
      }
    }

    let dormantUser = (req.user.dormant === 1);

    User.findOne(({ where: req.user.liOrLocal }))
    .then(function (userData) {
      // if user clicks logon with linkedin without havind signed up
      if (userData === null) {
        if (req.isAuthenticated()) {
          req.session.destroy();
          res.redirect('/');
        }
      }

      // DB.knex.raw("select profession from professions order by profession asc")
      // .then(function (professions) {
      //   // get users skills
      //   new ProfSkills.SkillsList({ userId: req.user.id }).fetch()
      //   .then(function (userSkills) {
      //     let skillsArray = [];
      //     if (userSkills != null) {
      //       let prop;
      //       for (prop in userSkills.attributes) {
      //         if (userSkills.get(prop) === 1) {
      //           skillsArray.push(prop);
      //         }
      //       }
      //     }
      //
      //     let professionArray = [];
      //     let i;
      //     for (i = 0; i < professions[0].length; i++) {
      //       professionArray.push(professions[0][i].profession);
      //     }
      //
      //     // catch if they login with LI and don't complete their profile
      //     let errorMessage = '';
      //
      //     let realMinGrade = transformData.convertGrade(model.get('minimumMentorGrade'));
      //     let skillsListString = transformData.transformUserSkillsToString(skillsArray);
      //     let skillsListForProfile = transformData.transformUserSkillsToString(skillsArray).replace(/,/g, ', ');
      //
      //     DB.knex.raw("select column_name from information_schema.columns where table_name='skillsList' and column_name != 'skillTableId' and column_name != 'userId' and column_name != 'profession'")
      //     .then(function (skillsColNames) {
      //       let skills = [];
      //       skillsColNames[0].forEach(function (element) {
      //         let newElement = element.column_name.charAt(0).toUpperCase() + element.column_name.replace(/([A-Z])/g, ' $1').toLowerCase().substring(1, element.length);
      //         skills.push(newElement);
      //       });
      console.log('>>>>>>>', model)
            res.render('edit-profile', { title: config.title + ' - Profile', data: userData, skillsList: config.skillsList, completedProfile: req.session.completedProfile, dormantUser: dormantUser, csrfToken: req.csrfToken() });
          });
    //     });
    //   });
    // });
  });
};
