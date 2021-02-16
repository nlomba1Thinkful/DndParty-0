const express = require('express');
const ProfileService = require('./profile-service');
const { requireAuth } = require('../middleware/require-auth');
const serializeData = require('../serializeData/serializeData');
const profileRouter = express.Router();

const jsonBodyParser = express.json();

profileRouter
  .route('/:user_id')
  .get(requireAuth, (req, res, next) => {
    const user_id = req.params.user_id;
    ProfileService.getUserInfoFromDB(req.app.get('db'), user_id)
      .then((result) => {
        return res.json(serializeData(result));
      })
      .catch(next);
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const user_id = req.user.user_id;
    const {
      name,
      user_name,
      last_name,
      dnd_experience,
      location,
      languages,
      contact,
      about_me,
      preferred_editions,
      preferred_classes,
      character_sheets,
    } = req.body;
    const userInfo = {
      name,
      user_name,
      last_name,
      dnd_experience,
      location,
      languages,
      contact,
      about_me,
      preferred_editions,
      preferred_classes,
      character_sheets,
    };
    if (!user_name) {
      return res
        .status(400)
        .json({ error: 'Nickname must be atleast 1 Character' });
    }

    let pdfCheck = character_sheets
      .slice(character_sheets.length - 4, character_sheets.length)
      .toLowerCase();

    if (character_sheets && pdfCheck !== '.pdf') {
      return res
        .status(401)
        .json({ error: 'Character Sheet URL must be a PDF file' });
    }

    ProfileService.checkUsernameExists(req.app.get('db'), user_name)
      .then((result) => {
        if (
          !result ||
          (result.user_name === user_name && result.user_id == user_id)
        ) {
          ProfileService.updateUserInfo(req.app.get('db'), userInfo, user_id)
            .then((result) => {
              return res.status(200).json(result.map(serializeData));
            })
            .catch(next);
        } else {
          return res.status(400).json({ error: 'Nickname already exists' });
        }
      })
      .catch(next);
  });

profileRouter
  .route('/created_parties/:user_id')
  .get(requireAuth, (req, res, next) => {
    const user_id = req.params.user_id;
    ProfileService.getUserCreatedTablesFromDB(req.app.get('db'), user_id)
      .then((result) => {
        return res.json(result.map(serializeData));
      })
      .catch(next);
  });

module.exports = profileRouter;
