'use strict';

// Generates matching parts or query - two different ones for getting mentor and mentees

module.exports = {
  queryBuilder: function (userData, mentor, skillsArray, profession, advancedFiltersToApply) {
    let query = '';

    if (mentor === true) {
      if (userData.minimumMentorGrade !== 'all') { query += " AND grade >= " + userData.minimumMentorGrade; }
    }
    query += " AND (coaching = " + userData.coaching + " OR mentoring = " + userData.mentoring + ") ";
    query += " AND (faceToFace = " + userData.faceToFace + " OR phone = " + userData.phone + ") ";


    // for each toDevelop that is set
      // check if that category is in uses 'toOffer' list
      // if so, set userData.toDevelop1Level to value of toOffer cat
      // if not set userData.toDevelop1Level to 0
    let toDevelopSet = 0;
    let toOfferSet = 0;
    for (let x = 1; x <= 6; x += 1) {
      userData['toDevelop' + x + 'Level'] = 0;
      for (let y = 1; y <= 6; y += 1) {
        if (userData['toDevelop' + x] === userData['toOffer' + y]) {
          userData['toDevelop' + x + 'Level'] = userData['toOffer' + y + 'Level'];
        }
      }
      // get total number of toDevelops the user has saved
      if (userData['toDevelop' + x] !== "") {
        toDevelopSet += 1;
      }
      // get total number of toOffers the user has saved
      if (userData['toOffer' + x] !== "") {
        toOfferSet += 1;
      }
    }

    // if building query to get mentors
    if (mentor === true && (toDevelopSet > 0)) {
      // user toDevelopCount to track how many times the first for loop has run through - goes through each of the toDevelop skill columns
      for (let z = 1; z <= 6; z += 1) {
        // Iterator keeps track of when to not add the final ' OR ' to query in an iteration of the inside loop
        let iterator = 1;
        // Start each smart query with AND ( to encapulate the matched skills
        if (z === 1) {
          query += " AND ((";
        }

        // Iterate again so for toOffer1, it checks if toOffer1 = any of the things in toDevelop1,2,3... as long as toDevelopX != ""
        for (let a = 1; a <= 6; a += 1) {
          if (userData['toDevelop' + a] !== "") {
            query += ' (toOffer' + z + ' = "' + userData['toDevelop' + a] + '" AND toOffer' + z + 'Level > ' + userData["toDevelop" + a + "Level"] + '  ) ';

            if (iterator < toDevelopSet) {
              query += " OR ";
            }
            iterator += 1;
          }
        }

        // Joins all but the last internal match query with this
        if (z < 6) {
          query += " ) OR (";
        }
      }
      query += " ) )";
    } else if (mentor === false && (toOfferSet > 0)) {
      for (let h = 1; h <= 6; h += 1) {
        let iterator = 1;
        if (h === 1) {
          query += " AND ((";
        }
        for (let a = 1; a <= 6; a += 1) {
          if (userData['toOffer' + a] !== "") {
            query += ' (toDevelop' + h + ' = "' + userData['toOffer' + a] + '" AND toDevelop' + h + 'Level < ' + userData["toOffer" + a + "Level"] + '  ) ';

            if (iterator < toOfferSet) {
              query += " OR ";
            }
            iterator += 1;
          }
        }
        if (h < 6) {
          query += " ) or (";
        }
      }
      query += " ) )";

      query += " AND (grade <= (" + userData.grade + "+1) ) ";
    }

    if (skillsArray) {
      if (skillsArray[0] !== '' && skillsArray.length > 0) {
        query += " AND (";
        skillsArray.forEach(function (element, index, array) {
          if (index !== array.length - 1) {
            query += "(" + element + " = 1) AND ";
          } else {
            query += "(" + element + " = 1)";
          }
        });
        query += ") ";
      }
    }
    if (profession) {
      query += "AND (profession = '" + profession + "') ";
    }
    // add extra search filters
    if (advancedFiltersToApply) {
      if (advancedFiltersToApply.experience.length > 0) {
        advancedFiltersToApply.experience.forEach(function (e) {
          query += " AND " + e + " = 1 ";
        });
      }
      if (advancedFiltersToApply.location !== '') {
        query += " AND location = '" + advancedFiltersToApply.location + "' ";
      }
    }

    query += " AND signedUp = 1 AND csVerified = 1 AND dormant = 0 ORDER BY RAND() LIMIT 10";
    return query;
  }

};
