'use strict';

let config = require('../../config').config();
let base64url = require('base64-url');

let chaser1 = function (userData, recepientData, emailData) {
  let replyLink = config.url + 'reply/' + base64url.encode('id=' + userData.id);
  let pauseCommsLink = config.url + 'update-prefs/' + base64url.encode('comms?' + userData.email);
  recepientData.firstName = recepientData.name.split(' ')[0];
  let reminderLink = config.url + 'reply/followup/' + base64url.encode('reminder=' + userData.email + '&senderId=' + userData.id + '&recepientId=' + recepientData.id + '&logId=' + emailData.logId);
  let notRightLink = config.url + 'reply/followup/' + base64url.encode('not-right=' + userData.email + '&id=' + recepientData.id + '&userID=' + userData.id);

  userData.firstName = userData.name.split(' ')[0];
  return `
        <head>
          <meta charset="UTF-8">
        </head>
        <div style="background:#f5f6f9;color:#666;font-family:Helvetica,arial,sans-serif;max-width:500px;padding:20px" bgcolor="#F5F6F9">
          <h2 style="font-family:'Museo Sans Rounded 300',arial,sans-serif;font-size:26px;font-weight:normal;line-height:39px;margin-bottom:26px">
          Hi ` + recepientData.firstName + `</h2>
          <hr style="border:#ddd solid 1px;clear:both;min-height:0;margin-bottom:30px;margin-top:30px">
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">3 weeks ago, you received a message from ` + userData.name + ` via <a href="http://www.mentormatch.org.uk" style="color:#469abd;text-decoration:underline" target="_blank">mentormatch.org.uk</a></p>
          <blockquote>`
            + emailData.newBody +
          `</blockquote>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            This is your final reminder. The system relies on people responding to emails - even if that is to tell them that now isn't the right time for you to start the mentoring relationship.
          </p>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            Please click here to <a href="` + replyLink + `" target="_blank" style="text-decoration:none"><span style="padding:5px; background-color: #04AAC9 ;color:#FFFFFF;">reply to ` + userData.name + ` now</span></a> or if <a href="` + notRightLink + `" target="_blank" style="text-decoration:none"><span style="padding:5px; background-color: #04AAC9 ;color:#FFFFFF;">now isn't the right time</span></a> for you, we can send the person an automated message to let them know.
          </p>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            If you fail to get in contact with the person within the next week, we will temporarily hibernate your account on Mentor Match. This is to prevent other people contacting you and being disappointed that they hear nothing from you. The next time you log on to Mentor Match, you'll get a message showing you how to reactivate your account.
          </p>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            Never been a mentor before? Not sure what to expect from your mentoring relationship? You can find our <a href="` + config.url + `faq" target="_blank" style="color:#469abd;text-decoration:underline">FAQs here</a>.
          </p>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            The Mentor Match team
            <br />
            <a href="http://www.mentormatch.org.uk" style="color:#469abd;text-decoration:underline" target="_blank">mentormatch.org.uk</a>
          </p>
          <p style="font-size:11px;line-height:21px;margin-bottom:21px">If you are already have a mentor and are not looking to take on another, <a href="` + pauseCommsLink + `" target="_blank">click here</a> to pause your messages. Bear in mind that by pausing, you will not be able to view your mentee matches.</p>
        </div>`;
};


module.exports = chaser1;
