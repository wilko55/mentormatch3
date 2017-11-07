'use strict';

const config = require('../config').config();
const queryBuilder = require('../helpers/queryBuilder.js').queryBuilder;
const model = require('../models');
const transformData = require('../helpers/transformData');
const base64url = require('base64url');

const User = model.user;
const Email = model.email;

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

          Email.contactedMentors()
          .then((recepientIds) => {
            let mentorsMessaged = transformData.markAsMessaged(mentors, recepientIds);
            let menteesMessaged = transformData.markAsMessaged(mentees, recepientIds);
            res.render('matches', {
              title: config.title + ' - Matches',
              mentors: mentorsMessaged,
              mentees: menteesMessaged,
              emailCount: req.user.mentorEmailsSent,
              // professionArray: professionArray,
              // skills: skills,
              csrfToken: req.csrfToken()
            });
          });
        });
      });
    }
  }
};
