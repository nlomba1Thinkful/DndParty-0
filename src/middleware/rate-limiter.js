const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Exceeded Login\\Register Limit',
});

const chatmessagesLimiter1 = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
});

const chatmessagesLimiter2 = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 50,
});

module.exports = { loginLimiter, chatmessagesLimiter1, chatmessagesLimiter2 };
