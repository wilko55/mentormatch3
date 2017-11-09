'use strict';

const assert = require('assert');
const transformData = require('../../../helpers/transformData.js');

describe('The transformData lib', () => {
  describe('breakupString function', function () {
    it('should break the string digitalDelivery into two words', function () {
      let expectedResult = [' Digital delivery'];

      let service = transformData.breakupSkillsList('digitalDelivery');
      assert.deepEqual(service, expectedResult);
    });

    it('should break the string "digitalDelivery,changeManagement" into two words', function () {
      let expectedResult = [' Digital delivery', ' Change management'];

      let service = transformData.breakupSkillsList('digitalDelivery,changeManagement');
      assert.deepEqual(service, expectedResult);
    });
  });

  describe('convertGrade function', function () {
    it('should convert 1 to "AO"', function () {
      let expectedResult = 'AO';

      let service = transformData.convertGrade(1);
      assert.deepEqual(service, expectedResult);
    });

    it('should convert -1 to "All"', function () {
      let expectedResult = 'All';

      let service = transformData.convertGrade(-1);
      assert.deepEqual(service, expectedResult);
    });
  });

  describe('setProfileReqBody function', function () {
    let egBody = { coaching: 1, toDevelop1: "Communications", toDevelop1Level: 4, toDevelop1About: "line one&#13;&#10;and line two" };
    it('should set undefined keys to 0', function () {
      let expectedResult =
        {
          changeManagementToDevelop: 0,
          commercialAwarenessToDevelop: 0,
          commercialAwarenessToOffer: 0,
          communicationsToDevelop: 0,
          digitalDeliveryToDevelop: 0,
          financialManagementToDevelop: 0,
          progProjManagementToDevelop: 0,
          policySkillsToDevelop: 0,
          changeManagementToOffer: 0,
          communicationsToOffer: 0,
          digitalDeliveryToOffer: 0,
          financialManagementToOffer: 0,
          peopleManagementToDevelop: 0,
          peopleManagementToOffer: 0,
          progProjManagementToOffer: 0,
          policySkillsToOffer: 0,
          faceToFace: 0,
          mentoring: 0,
          phone: 0,
          coaching: 1,
          bame: 0,
          dependents: 0,
          gender: 0,
          lgbtq: 0,
          disability: 0,
          partTime: 0,
          toDevelop1: 'Communications',
          toOffer1: '',
          toDevelop1About: 'line one and line two',
          toOffer1About: '',
          toOffer1Level: 0,
          toDevelop2: '',
          toOffer2: '',
          toDevelop2About: '',
          toOffer2About: '',
          toOffer2Level: 0,
          toDevelop3: '',
          toOffer3: '',
          toDevelop3About: '',
          toOffer3About: '',
          toOffer3Level: 0,
          toDevelop4: '',
          toOffer4: '',
          toDevelop4About: '',
          toOffer4About: '',
          toOffer4Level: 0,
          toDevelop5: '',
          toOffer5: '',
          toDevelop5About: '',
          toOffer5About: '',
          toOffer5Level: 0,
          toDevelop6: '',
          toOffer6: '',
          toDevelop6About: '',
          toOffer6About: '',
          toOffer6Level: 0,
          toDevelop1Level: 4,
          toDevelop2Level: 0,
          toDevelop3Level: 0,
          toDevelop4Level: 0,
          toDevelop5Level: 0,
          toDevelop6Level: 0
        };


      let service = transformData.setProfileReqBody(egBody);
      assert.deepEqual(Object.assign(egBody, service), expectedResult);
    });

    it('should replace &#13;&#10; with " "s', function () {
      let body = { toDevelop1About: "line one&#13;&#10;and line two" };
      let expectedResult = 'line one and line two';

      let service = transformData.setProfileReqBody(body);
      assert.equal(service.toDevelop1About, expectedResult);
    });

    it('should replace newline characters with " "s', function () {
      let body = { toDevelop1About: "line one\nand line two" };
      let expectedResult = 'line one\nand line two';

      let service = transformData.setProfileReqBody(body);
      assert.equal(service.toDevelop1About, expectedResult);
    });
  });

  describe('markAsMessaged function', function () {
    let recepientIds = [{ recepientId: 2 }];
    let mentorList = [
      { id: 1, name: "Mr Smith", commercialAwarenessToOffer: 1, digitalDeliveryToDevelop: 1 },
      { id: 2, name: "John Doe", changeManagementToOffer: 1, digitalDeliveryToDevelop: 1 }
    ];

    it('should add an "messaged: true" property to messaged mentors ', function () {
      let expectedResult = [
        { id: 1, name: "Mr Smith", commercialAwarenessToOffer: 1, digitalDeliveryToDevelop: 1 },
        { id: 2, name: "John Doe", changeManagementToOffer: 1, digitalDeliveryToDevelop: 1, messaged: true }
      ];

      let service = transformData.markAsMessaged(mentorList, recepientIds);
      assert.deepEqual(service, expectedResult);
    });
  });

  describe('getCommsEmail function', function () {
    let userData = {};
    before(function () {
      userData = {
        email: 'login@email.com',
        csEmail: 'work@email.com',
        emailOther: 'other@email.com'
      };
    });
    it('should return the main email if the user has chosen to recieve emails at that address', function () {
      userData.commsEmail = 0;
      let service = transformData.getCommsEmail(userData);
      assert.equal(service, userData.email);
    });
    it('should return a work email if the user has chosen to recieve emails at that address', function () {
      userData.commsEmail = 1;
      let service = transformData.getCommsEmail(userData);
      assert.equal(service, userData.csEmail);
    });
    it('should return another email if the user has chosen to recieve emails at that address', function () {
      userData.commsEmail = 2;
      let service = transformData.getCommsEmail(userData);
      assert.equal(service, userData.emailOther);
    });
    it('should default to returning the main email address if comms email isn\'t defined', function () {
      userData.commsEmail = null;
      let service = transformData.getCommsEmail(userData);
      assert.equal(service, userData.email);
    });
  });

  describe('transformUserSkillsFromString function', function () {
    it('returns an empty object if the skillList is empty', function () {
      let skillsList = '';
      let service = transformData.transformUserSkillsFromString(skillsList);
      assert.deepEqual(service, {});
    });
    it('returns a completed object when passed a skills list string', function () {
      let skillsList = 'Data,commercial';
      let service = transformData.transformUserSkillsFromString(skillsList);
      let result = { data: 1, commercial: 1 };
      assert.deepEqual(service, result);
    });
  });

  describe('transformUserSkillsToString function', function () {
    it('returns a skills list string when given a skills list array', function () {
      let skillsListArray = ['data', 'commercial'];
      let service = transformData.transformUserSkillsToString(skillsListArray);
      let result = 'Data,Commercial';
      assert.equal(service, result);
    });
    it('returns an empty string when an empty array is passed in', function () {
      let skillsListArray = [];
      let service = transformData.transformUserSkillsToString(skillsListArray);
      let result = '';
      assert.equal(service, result);
    });
  });

  describe('gotAdditionalExperience function', function () {
    it('returns true if an additional experience area is selected', function () {
      let userData = { bame: 1 };
      let service = transformData.gotAdditionalExperience(userData);
      let result = true;
      assert.equal(service, result);
    });
    it('returns an empty string when an empty array is passed in', function () {
      let userData = { bame: 0 };
      let service = transformData.gotAdditionalExperience(userData);
      let result = false;
      assert.equal(service, result);
    });
  });

  describe('calculateReplyTime function', () => {
    let dummyReceived = [ {
      id: 20,
      senderId: 2329,
      recepientId: 2333,
      sentStatus: null,
      emailBody: 'Hello,<br />My name is wilko',
      replyEmailId: null,
      queueReminder: 0,
      type: 'email',
      chaserSent: null,
      dormantWarningSent: null
    }];

    let dummySent = [ {
      id: 12,
      senderId: 2333,
      recepientId: 2329,
      sentStatus: null,
      emailBody: 'Hello, <br />I received your message through Mentor Match. please contact me on andyjwilko@gmail.com where we can arrange to have a chat. <br /> <br />Thanks, <br />Andrew Wilkinson',
      replyEmailId: null,
      queueReminder: 0,
      type: 'reply',
      chaserSent: null,
      dormantWarningSent: null
    }];

    let dummyId = 2333;

    it('returns "less than a week" if the average reply time is under a week', () => {
      dummyReceived[0].timestamp = '2017-04-18T12:54:47.000Z';
      dummySent[0].timestamp = '2017-04-20T12:54:47.000Z';
      let result = transformData.calculateReplyTime(dummyId, dummyReceived, dummySent);

      assert.equal(result, 'in less than a week')
    });

    it('returns the correct average reply time in weeks', () => {
      dummyReceived[0].timestamp = '2017-04-07T12:54:47.000Z';
      dummySent[0].timestamp = '2017-04-28T12:54:47.000Z';
      let result = transformData.calculateReplyTime(dummyId, dummyReceived, dummySent);

      assert.equal(result, 'within 3 weeks')
    });

    it('returns "in 1 week" if the average reply time is within one week', () => {
      dummyReceived[0].timestamp = '2017-04-24T12:54:47.000Z';
      dummySent[0].timestamp = '2017-04-28T12:54:47.000Z';
      let result = transformData.calculateReplyTime(dummyId, dummyReceived, dummySent);

      assert.equal(result, 'in less than a week')
    });

    it('returns "+4 weeks" if the average reply time is over a month', () => {
      dummyReceived[0].timestamp = '2017-04-01T12:54:47.000Z';
      dummySent[0].timestamp = '2017-05-18T12:54:47.000Z';
      let result = transformData.calculateReplyTime(dummyId, dummyReceived, dummySent);

      assert.equal(result, 'in +4 weeks')
    });

    it('returns "+4 weeks" if the user has never replied to an email', () => {
      dummyReceived[0].timestamp = '2017-04-01T12:54:47.000Z';
      dummySent = [];
      let result = transformData.calculateReplyTime(dummyId, dummyReceived, dummySent);

      assert.equal(result, 'in +4 weeks')
    });

    it('returns false if the user has never been sent an email', () => {
      dummyReceived = [];
      dummySent = [];
      let result = transformData.calculateReplyTime(dummyId, dummyReceived, dummySent);

      assert.equal(result, false)
    });
  });
});
