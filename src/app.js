require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('../config');
const authRouter = require('./auth/auth-router');
const partiesRouter = require('./parties/parties-route');
const profileRouter = require('./profile/profile-route');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/parties', partiesRouter);
app.use('/api/profile', profileRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    console.log(error);
    response = { error: 'Sorry, Server Error! Try refreshing.' };
  } else {
    console.error(error);
    response = { error: error.message };
  }
  res.status(500).json(response);
});

module.exports = app;
