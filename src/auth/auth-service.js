const bcrypt = require('bcryptjs');
const e = require('express');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRY } = require('../../config');

const AuthService = {
  registerUser(db, newUser) {
    return db('users')
      .insert(newUser)
      .returning('*')
      .then((res) => {
        return res[0];
      });
  },
  getUserEmail(db, user_email) {
    return db('users').where({ user_email }).first();
  },
  getUsername(db, user_name) {
    return db('users').where({ user_name }).first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, JWT_SECRET, {
      subject,
      expiresIn: JWT_EXPIRY,
      algorithm: 'HS256',
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
  getPartyCreator(db, user_id, party_id) {
    return db('parties')
      .where({ party_id })
      .first()
      .then((result) => {
        if (result.user_id_creator === user_id) {
          return true;
        } else {
          return false;
        }
      });
  },
};

module.exports = AuthService;
