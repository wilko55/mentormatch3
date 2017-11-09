'use strict';

module.exports = function (sequelize, DataTypes) {
  let SkillsList = sequelize.define("skillsList",
    {
      skillTableId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      userId: DataTypes.INTEGER
    },
    {
      tableName: 'skillsList',
      timestamps: false
    }
  );

  SkillsList.findAllUserSkills = function (id) {
    return sequelize.query('select * from skillsList where userId = :userId', { replacements: { userId: id }, type: sequelize.QueryTypes.SELECT })
    .then((data) => {
      let skills = {
        skillsRow: data.length !== 0,
        userSkills: []
      };
      for (let key in data[0]) {
        if (data[0].hasOwnProperty(key)) {
          if (key !== 'skillTableId' && key !== 'userId') {
            if (data[0][key] === 1) {
              skills.userSkills.push(key);
            }
          }
        }
      }
      return skills;
    });
  };

  SkillsList.findSkillColumns = function () {
    return sequelize.query('select column_name from information_schema.columns where table_name=\'skillsList\' and column_name != \'id\' and column_name != \'userId\' and column_name != \'skillTableId\'')
    .then((data) => {
      return data[0].map((e) => {
        return e.column_name;
      });
    });
  };

  SkillsList.insertOrUpdate = function (insert, data, id) {
    if (insert === 'insert') {
      let cols = '';
      let values = '';
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          cols += key + ', ';
          values += data[key] + ', ';
        }
      }
      return sequelize.query('INSERT INTO skillsList (' + cols + ' userId) VALUES (' + values + ' ' + id + ' )', { type: sequelize.QueryTypes.INSERT });
    } else {
      let query = '';
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          query += ' ' + key + ' = ' + data[key] + ', ';
        }
      }
      query = query.slice(0, -2);
      return sequelize.query('UPDATE skillsList SET ' + query, { type: sequelize.QueryTypes.UPDATE, where: { userId: id } });
    }
  };

  return SkillsList;
};
