const express = require('express');
const bcrypt = require('bcryptjs');
const edc = require('email-domain-check');
const AuthService = require('./auth-service');
const { loginLimiter } = require('../middleware/rate-limiter');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter
  .route('/register')
  .post(loginLimiter, jsonBodyParser, (req, res, next) => {
    let { user_email, password, user_name, policy_checked } = req.body;
    let newUser = { user_email, password, user_name, policy_checked };

    if (!user_email || !password || !user_name || !policy_checked) {
      return res
        .status(400)
        .json({ error: 'Bad Request - Missing Credentials' });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        error: 'Password must be atleast 8 characters',
      });
    }
    edc(user_email).then((result) => {
      if (!result) {
        return res.status(400).json({ error: 'Invalid Email' });
      }
      newUser.password = bcrypt.hashSync(password);
      AuthService.getUserEmail(req.app.get('db'), user_email).then((result) => {
        if (result) {
          return res.status(400).json({ error: 'Email Already Exists' });
        }
        AuthService.getUsername(req.app.get('db'), user_name).then((result) => {
          if (result) {
            return res.status(400).json({ error: 'Nickname Already Exists' });
          }
          AuthService.registerUser(req.app.get('db'), newUser)
            .then((user) => {
              return res.status(201).send({
                authToken: AuthService.createJwt(user.user_email, {
                  user_id: user.user_id,
                  user_name: user.user_name,
                }),
                user_id: user.user_id,
              });
            })
            .catch(next);
        });
      });
    });
  });

authRouter.post('/login', loginLimiter, jsonBodyParser, (req, res, next) => {
  const { user_email, password } = req.body;
  const loginUser = { user_email, password };

  for (const [key, value] of Object.entries(loginUser))
    if (!value)
      return res.status(400).json({
        error: `Missing '${key}' in request`,
      });
  AuthService.getUserEmail(req.app.get('db'), loginUser.user_email)
    .then((dbUser) => {
      if (!dbUser)
        return res.status(400).json({
          error: 'Invalid Credentials',
        });
      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: 'Invalid Credentials',
          });

        const sub = dbUser.user_email;
        const payload = {
          user_id: dbUser.user_id,
          user_name: dbUser.user_name,
        };
        res.json({
          authToken: AuthService.createJwt(sub, payload),
        });
      });
    })

    .catch(next);
});

module.exports = authRouter;
