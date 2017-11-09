'use strict';

const model = require('../models');
const config = require('../config').config();
const transformData = require('../helpers/transformData');

const User = model.user;
const Professions = model.professions;
const SkillsList = model.skillsList;
const validation = require('../helpers/validation/saveProfileValidation');

module.exports = {
  getProfile: (req, res) => {
    let dormantUser = req.user.dormant === 1;

    req.session.completedProfile = {
      toDevelop: true,
      toOffer: true
    };

    let l;
    for (l = 1; l <= 6; l += 1) {
      if (req.user['toDevelop' + l]) {
        req.session.completedProfile.toDevelop = false;
      }
      if (req.user['toOffer' + l]) {
        req.session.completedProfile.toOffer = false;
      }
    }

    SkillsList.findAllUserSkills(req.user.id)
    .then((skills) => {
      let realMinGrade = transformData.convertGrade(req.user.minimumMentorGrade);
      let skillsListString = transformData.transformUserSkillsToString(skills.userSkills);
      let skillsListForProfile = transformData.transformUserSkillsToString(skills.userSkills).replace(/,/g, ', ');

      let errorMessage = '';
      if (req.query.valid === 'false') {
        errorMessage = 'Maximum emails sent this week. Please come back on Monday for a new allocation.';
      }

      res.render('profile', {
        title: config.title + ' - Profile',
        errorMessage: errorMessage,
        skillsList: config.skillsList,
        completedProfile: req.session.completedProfile,
        dormantUser: dormantUser,
        isAdmin: req.user.admin,
        realMinGrade: realMinGrade,
        skillsListString: skillsListString,
        skillsListForProfile: skillsListForProfile
      });
    });
  },
  editProfile: (req, res) => {
    let dormantUser = (req.user.dormant === 1);

    User.findOne(({ where: req.user.id }))
    .then(function (userData) {
      Professions.findAllProfessions()
      .then(function (professions) {
        SkillsList.findSkillColumns()
        .then((skillsColumns) => {
          SkillsList.findAllUserSkills(req.user.id)
          .then((skills) => {
            let errorMessage = '';
            let realMinGrade = transformData.convertGrade(req.user.minimumMentorGrade);
            let skillsListString = transformData.transformUserSkillsToString(skills.userSkills);
            let skillsListForProfile = transformData.transformUserSkillsToString(skills.userSkills).replace(/,/g, ', ');
            let fullSkillsList = transformData.transformUserSkillsToString(skillsColumns).replace(/,/g, ',');

            res.render('edit-profile', {
              title: config.title + ' - Profile',
              data: userData,
              skillsList: config.skillsList,
              dormantUser: dormantUser,
              professionArray: professions,
              realMinGrade: realMinGrade,
              skillsListString: skillsListString,
              skillsListForProfile: skillsListForProfile,
              skills: fullSkillsList,
              errorMessage: errorMessage,
              csrfToken: req.csrfToken() });
          });
        });
      });
    });
  },
  updateProfile: (req, res) => {
    delete req.body_csrf;

    Object.assign(req.body, transformData.setProfileReqBody(req.body));

    let tempSkills = req.body.yourSkills;
    delete req.body.yourSkills;

    User.update(req.body, { where: { id: req.user.id } });

    SkillsList.findSkillColumns()
    .then((skillsColNames) => {
      let userSkillsObject = {};
      if (tempSkills) {
        userSkillsObject = validation.validateSkills(tempSkills, skillsColNames);
      }
      // add new row if skills not already set, otherwise update
      delete userSkillsObject.skillTableId;
      SkillsList.findAllUserSkills(req.user.id)
      .then((data) => {
        console.log('!!! data.skillsRow', data.skillsRow);
        if (!data.skillsRow) {
          SkillsList.insertOrUpdate('insert', userSkillsObject, req.user.id)
          .then(() => {
            res.redirect('profile');
          });
        } else {
          SkillsList.insertOrUpdate('update', userSkillsObject, req.user.id)
          .then(() => {
            res.redirect('profile');
          });
        }
      });
    });
  }
};
