'use strict';

const config = require('../config').config();
const queryBuilder = require('../helpers/queryBuilder.js').queryBuilder;
const model = require('../models');
const transformData = require('../helpers/transformData');
const base64url = require('base64url');
const logger = require('../helpers/logger');
const _ = require('underscore');
const validation = require('../helpers/validation/saveProfileValidation');

const User = model.user;
const Email = model.email;
const Professions = model.professions;
const SkillsList = model.skillsList;

module.exports = {
  getMatches: (req, res) => {
    req.session.completedProfile.toDevelop = true;
    req.session.completedProfile.toOffer = true;
    let i;
    for (i = 1; i <= 6; i += 1) {
      if (req.user['toDevelop' + i]) {
        req.session.completedProfile.toDevelop = false;
      }
    }
    for (i = 1; i <= 6; i += 1) {
      if (req.user['toOffer' + i]) {
        req.session.completedProfile.toOffer = false;
      }
    }
    if (req.session.completedProfile.toDevelop === true || req.session.completedProfile.toOffer === true) {
      res.redirect('profile');
    }

    if (req.user.csVerified === 1) {
      let mentorQuery = queryBuilder(req.user, true);
      let menteeQuery = queryBuilder(req.user, false);

      User.findMatches(req.user.id, mentorQuery)
      .then((mentors) => {
        User.findMatches(req.user.id, menteeQuery)
        .then((mentees) => {
          for (i = 0; i < mentors.length; i += 1) {
            mentors[i].grade = transformData.convertGrade(mentors[i].grade);
            mentors[i].yourSkills = (mentors[i].yourSkills) ? mentors[i].yourSkills.replace(/,/g, ', ') : '';
            mentors[i].profession = (mentors[i].profession) ? mentors[i].profession.replace(/,/g, ', ') : '';
            mentors[i].idHash = base64url.encode('id=' + mentors[i].id);
          }
          for (i = 0; i < mentees.length; i += 1) {
            mentees[i].grade = transformData.convertGrade(mentees[i].grade);
            mentees[i].yourSkills = (mentees[i].yourSkills) ? mentees[i].yourSkills.replace(/,/g, ', ') : '';
            mentees[i].profession = (mentees[i].profession) ? mentees[i].profession.replace(/,/g, ', ') : '';
            mentees[i].idHash = base64url.encode('id=' + mentees[i].id);
          }

          Professions.findAllProfessions()
          .then(function (professions) {
            SkillsList.findSkillColumns()
            .then((skillsColumns) => {
              Email.contactedMentors()
              .then((recepientIds) => {
                let mentorsMessaged = transformData.markAsMessaged(mentors, recepientIds);
                let menteesMessaged = transformData.markAsMessaged(mentees, recepientIds);
                let fullSkillsList = transformData.transformUserSkillsToString(skillsColumns).replace(/,/g, ',');

                res.render('matches', {
                  title: config.title + ' - Matches',
                  mentors: mentorsMessaged,
                  mentees: menteesMessaged,
                  emailCount: req.user.mentorEmailsSent,
                  professionArray: professions,
                  skills: fullSkillsList,
                  csrfToken: req.csrfToken()
                });
              });
            });
          });
        });
      });
    }
  },
  postMatches: (req, res) => {
    let profToFilter = req.body.profession;
    let skillsToFilter = req.body.yourSkills.split(',');
    let validProf = false;

    // sanitise
    Professions.findAllProfessions()
    .then(function (professions) {
      // check for valid prof
      if (profToFilter) {
        professions.forEach(function (e) {
          if (e === profToFilter) {
            validProf = true;
          }
        });
      }

      // get advanced filters to send to query builder and pass on to template
      let advancedFiltersToApply = {};
      advancedFiltersToApply.experience = [];
      advancedFiltersToApply.location = '';
      let allAdvancedFilters = ['bame', 'gender', 'partTime', 'disability', 'dependents', 'lgbtq', 'longLeave'];
      allAdvancedFilters.forEach(function (e, i) {
        if (req.body[allAdvancedFilters[i]] && req.body[allAdvancedFilters[i]] === '1') {
          advancedFiltersToApply.experience.push(e);
        }
      });
      let allLocations = ['London', 'East of England', 'Midlands', 'North East', 'North West', 'South West', 'South East', 'Yorkshire and Humber', 'Northern Ireland', 'Scotland', 'Wales', 'Overseas'];
      allLocations.forEach(function (e, i) {
        if (req.body.location === allLocations[i]) {
          advancedFiltersToApply.location = allLocations[i];
        }
      });

      SkillsList.findSkillColumns()
      .then((skillsColumns) => {
        let tempSkills = req.body.yourSkills;
        let userSkillsObject = {};

        // check skills are valid
        if (tempSkills) {
          userSkillsObject = validation.validateSkills(tempSkills, skillsColumns);
        }
        if (!userSkillsObject || (profToFilter && validProf === false)) {
          res.render('matches', { title: config.title,
            emailCount: req.user.mentorEmailsSent,
            professionArray: professions,
            matchProf: profToFilter,
            skillsToFilter: skillsToFilter,
            validationError: 'Invalid match filters set - please try again.',
            csrfToken: req.csrfToken() });
        }

        // build up skills array to filter by
        let skillsArray = [];
        _.each(userSkillsObject, (val, key) => {
          if (userSkillsObject[key] === 1) {
            skillsArray.push(key);
          }
        });

        // get all other info to pass to page template
        let mentorQuery = queryBuilder(req.user, true, skillsArray, profToFilter, advancedFiltersToApply);
        let menteeQuery = queryBuilder(req.user, false, skillsArray, profToFilter, advancedFiltersToApply);

        User.findFilteredMatches(req.user.id, mentorQuery).then((mentors) => {
          User.findFilteredMatches(req.user.id, menteeQuery).then((mentees) => {
            for (let i = 0; i < mentees.length; i += 1) {
              mentees[i].grade = transformData.convertGrade(mentees[i].grade);
              mentees[i].yourSkills = (mentees[i].yourSkills) ? mentees[i].yourSkills.replace(/,/g, ', ') : '';
              mentees[i].idHash = base64url.encode('id=' + mentees[i].id);
            }
            for (let i = 0; i < mentors.length; i += 1) {
              mentors[i].grade = transformData.convertGrade(mentors[i].grade);
              mentors[i].yourSkills = (mentors[i].yourSkills) ? mentors[i].yourSkills.replace(/,/g, ', ') : '';
              mentors[i].idHash = base64url.encode('id=' + mentors[i].id);
            }

            Email.contactedMentors()
            .then((recepientIds) => {
              // to test
              let mentorsMessaged = transformData.markAsMessaged(mentors, recepientIds);
              let menteesMessaged = transformData.markAsMessaged(mentees, recepientIds);
              // select `recepientId` from `emailLog` inner join `mentors` on `mentors`.`id` = `emailLog`.`senderId` where `emailLog`.`senderId` = 260

              // un-camelCase skillsToFilter and stringify (to generate skill labels)
              // skillsToFilter = transformData.transformUserSkillsToString(skillsToFilter);

              let errorMessageMentors = (mentors.length === 0);
              let errorMessageMentees = (mentees.length === 0);

              let skills = [];
              skillsColumns.forEach(function (element) {
                let newElement = element.charAt(0).toUpperCase() + element.replace(/([A-Z])/g, ' $1').toLowerCase().substring(1, element.length + 1);
                skills.push(newElement);
              });
              res.render('matches', { title: config.title, mentors: mentorsMessaged, mentees: menteesMessaged, emailCount: req.user.mentorEmailsSent, professionArray: professions, matchProf: profToFilter, skillsToFilter: skillsToFilter, errorMessageMentors: errorMessageMentors, errorMessageMentees: errorMessageMentees, skills: skills, advancedFiltersToApply: advancedFiltersToApply, csrfToken: req.csrfToken() });
            });
          });
        });
      });
    });
  }
};
