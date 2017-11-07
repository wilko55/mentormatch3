'use strict';

const moment = require('moment');
const _ = require('underscore');
let config = require('../config').config();

let additionalExperienceList = ['bame', 'lbgtq', 'disability', 'partTime', 'dependents', 'gender'];

module.exports = {
  breakupSkillsList: function (string) {
    let array = string.split(',');
    let finalArray = [];
    for (let i = 0; i < array.length; i++) {
      let tempString = array[i].split(/(?=[A-Z])/).join(' ').toLowerCase();
      if (tempString === 'prog proj management') {
        tempString = 'programme & project management';
      }
      let letter = tempString.charAt(0).toUpperCase();
      let newWord = ' ' + letter + tempString.slice(1);
      finalArray.push(newWord);
    }

    return finalArray;
  },
  convertGrade: function (gradeNum) {
    let gradeConversion = { AA: 0, AO: 1, EO: 2, HEO: 3, 'HEO(D)/ Fast streamer': 4, SEO: 5, G7: 6, G6: 7, SCS: 8, All: -1 };
    for (let key in gradeConversion) {
      if (gradeConversion[key] == gradeNum) {
        return key;
      }
    }
  },
  getCommsEmail: function (userData) {
    switch (userData.commsEmail) {
      case null:
        return userData.email;
      case 0:
        return userData.email;
      case 1:
        return userData.csEmail;
      case 2:
        return userData.emailOther;
    }
  },
  setProfileReqBody: function (data) {
    let completeObject = {};
    for (let y = 0; y < config.skillsList.length; y += 1) {
      if (data[config.skillsList[y].nameShort + 'ToDevelop'] != 1) {
        completeObject[config.skillsList[y].nameShort + 'ToDevelop'] = 0;
      }
    }

    for (let z = 0; z < config.skillsList.length; z++) {
      if (data[config.skillsList[z].nameShort + 'ToOffer'] != 1) {
        completeObject[config.skillsList[z].nameShort + 'ToOffer'] = 0;
      }
    }

    // set values to 0 if unchecked on profile
    completeObject.faceToFace = data.faceToFace == 1 ? 1 : 0;
    completeObject.mentoring = data.mentoring == 1 ? 1 : 0;
    completeObject.phone = data.phone == 1 ? 1 : 0;
    completeObject.coaching = data.coaching == 1 ? 1 : 0;
    completeObject.bame = data.bame == 1 ? 1 : 0;
    completeObject.dependents = data.dependents == 1 ? 1 : 0;
    completeObject.gender = data.gender == 1 ? 1 : 0;
    completeObject.lgbtq = data.lgbtq == 1 ? 1 : 0;
    completeObject.disability = data.disability == 1 ? 1 : 0;
    completeObject.partTime = data.partTime == 1 ? 1 : 0;

    if (data.signedUp === '0') {
      completeObject.mentoring = 1;
      completeObject.faceToFace = 1;
    }

    // replace textarea newlines with brs
    let stripNewline = function (prop) {
      return prop.replace(/&#13;&#10;/g, ' ');
    };

    let stripAboutNewline = function (prop) {
      return prop.replace(/\r\n/g, ' ');
    };

    // Take data from body, not db, about toDevelop1,2,3 levels when saving. Means that if user saves comms toDev and comms toOffer, toDev level will be updated from req.body.toOfferXLevel
    for (var i = 1; i <= 6; i++) {
      completeObject['toDevelop' + i] = data['toDevelop' + i] ? data['toDevelop' + i] : '';
      completeObject['toOffer' + i] = data['toOffer' + i] ? data['toOffer' + i] : '';
      completeObject['toDevelop' + i + 'About'] = data['toDevelop' + i + 'About'] ? stripNewline(data['toDevelop' + i + 'About']) : '';
      completeObject['toOffer' + i + 'About'] = data['toOffer' + i + 'About'] ? stripNewline(data['toOffer' + i + 'About']) : '';
      completeObject['toOffer' + i + 'Level'] = data['toOffer' + i + 'Level'] ? data['toOffer' + i + 'Level'] : 0;
    }

    for (var i = 1; i <= 6; i++) {
      completeObject['toDevelop' + i + 'About'] = stripAboutNewline(completeObject['toDevelop' + i + 'About']);
      completeObject['toOffer' + i + 'About'] = stripAboutNewline(completeObject['toOffer' + i + 'About']);
    }

    for (let x = 1; x <= 6; x++) {
      for (var y = 1; y <= 6; y++) {
        if (data['toDevelop' + x] === data['toOffer' + y]) {
          completeObject['toDevelop' + x + 'Level'] = data['toOffer' + y + 'Level'] ? data['toOffer' + y + 'Level'] : 0;
        }
      }
    }

    return completeObject;
  },
  markAsMessaged: function (mentorList, recepients) {
    let mentors = mentorList;
    let recepientIds = recepients;
    for (let j = 0; j < mentors.length; j += 1) {
      for (let i = 0; i < recepientIds.length; i += 1) {
        if (recepientIds[i] === mentors[j].id) {
          mentors[j].messaged = true;
        }
      }
    }
    return mentors;
  },
  transformUserSkillsFromString(skillsList) {
    if (skillsList == '') {
      return {};
    }
    let skillsArray = skillsList.split(',');
    skillsArray.forEach(function (element, index, array) {
      // change element to camelcase
      let newElem = element.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
      }).replace(/\s+/g, '');
      skillsArray[index] = newElem;
    });
    let skillsObject = {};
    for (let j = 0; j < skillsArray.length; j++) {
      skillsObject[skillsArray[j]] = 1;
    }
    return skillsObject;
  },
  transformUserSkillsToString(skillsListArray) {
    let skillsListString = '';
    for (let i = 0; i < skillsListArray.length; i++) {
      skillsListString += skillsListArray[i].replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^./, function (str) {
        return str.toUpperCase();
      }) + ',';
    }
    skillsListString = skillsListString.slice(0, -1);
    return skillsListString;
  },
  gotAdditionalExperience(userData) {
    for (let val of additionalExperienceList) {
      if (userData[val] === 1) {
        return true;
      }
    }
    return false;
  },
  calculateReplyTime(userId, receivedEmails, sentReplies) {
    if (receivedEmails.length === 0) {
      return false;
    }
    let emails = []
    _.each(receivedEmails, receivedEmail => {
      let obj = {
        receivedEmail: receivedEmail
      }
      _.each(sentReplies, reply => {
        if (reply.recepientId === receivedEmail.senderId) {
          obj.reply = reply;
        }
      })
      emails.push(obj)
    })

    _.each(emails, email => {
      if (!email.reply) {
        email.reply = false
      }
    });

    let replyTimeInWeeks = _.map(emails, email => {
      return moment(email.reply.timestamp).diff(moment(email.receivedEmail.timestamp), 'weeks');
    });

    // if never replied
    if (replyTimeInWeeks[0] === false) {
      return 'in +4 weeks';
    }

    let averageReplyTime = Math.floor(_.reduce(replyTimeInWeeks, (a, b) => { return a + b})/replyTimeInWeeks.length);

    if (averageReplyTime <= 0) {
      return 'in less than a week';
    } else if (averageReplyTime > 4) {
      return 'in +4 weeks';
    } else if (averageReplyTime === 1) {
      'in less than a week';
    } else {
      return 'within ' + averageReplyTime + ' weeks'
    }

  }
};
