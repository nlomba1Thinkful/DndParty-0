module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgres://fhmngnyqldrgjq:8b72538f3dd33e9f18abbb5d33487ae5b76bed8455ab2a2d2b5ac24c2cd5e8a6@ec2-54-225-130-212.compute-1.amazonaws.com:5432/d575g45sd203t5',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
};
