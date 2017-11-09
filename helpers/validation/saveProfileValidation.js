module.exports = {
  validateSkills: function (skills, skillsColNames) {
    let userSkillsObject = {};
    if (skills) {
      let userSkills = skills.split(',') || '';
      let validSkills;
      let skillsColCamelArray = [];
      let skillsColArray = [];
      skillsColNames.forEach(function (element) {
        let newElement = element.charAt(0).toUpperCase() + element.replace(/([A-Z])/g, ' $1').toLowerCase().substring(1, element.length + 1);
        skillsColArray.push(newElement);
      });
      skillsColNames.forEach(function (element) {
        skillsColCamelArray.push(element);
      });

      if (userSkills) {
        userSkills.forEach(function (e) {
          for (let j = 0; j < skillsColArray.length; j += 1) {
            if (skillsColArray[j] === e) {
              validSkills = true;
              return validSkills;
            }
            validSkills = false;
          }
        });
      }
      if (validSkills) {
        userSkills.forEach(function (element) {
          let newElem = element.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
          }).replace(/\s+/g, '');
          userSkillsObject[newElem] = 1;
        });

        // set rest of the skills to 0 unless they're saved as 1
        let k;
        for (k = 0; k < skillsColCamelArray.length; k += 1) {
          if (userSkillsObject[skillsColCamelArray[k]] !== 1) {
            userSkillsObject[skillsColCamelArray[k]] = 0;
          }
        }

        return userSkillsObject;
      } else {
        return false;
      }
    }
  }
};
