const ProfileService = {
  getUserInfoFromDB(db, user_id) {
    return db('users')
      .select('*')
      .where({ user_id })
      .first()
      .then((res) => {
        delete res.password;
        delete res.user_email;
        return res;
      });
  },
  checkUsernameExists(db, user_name) {
    return db('users')
      .select('*')
      .where({ user_name })
      .first()
      .then((res) => {
        if (res) {
          delete res.password;
          delete res.user_email;
        }
        return res;
      });
  },
  updateUserInfo(db, userInfo, user_id) {
    return db('users')
      .where({ user_id })
      .update(userInfo)
      .returning('*')
      .then((res) => {
        delete res[0].password;
        return res;
      });
  },
  updateCharacterSheets(db, user_id, character_sheets) {
    return db('character_sheets')
    .where({ user_id })
    .update(userInfo)
    .returning('*')
    .then((res) => {
      delete res[0].password;
      return res;
    });
  },
  getUserCreatedTablesFromDB(db, id) {
    return db('parties')
      .select('*')
      .where({ 'parties.user_id_creator': id })
      .then((res) => {
        return res;
      });
  },
};

module.exports = ProfileService;
