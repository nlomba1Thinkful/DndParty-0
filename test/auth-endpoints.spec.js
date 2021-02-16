const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe('Auth Endpoints', function () {
  let db;

  const testUsers = helpers.users();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`POST /api/auth/register`, () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

    const requiredFields = ['user_email', , 'user_name', 'password'];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        user_name: 'new test user name',
        user_email: 'newtest@email.com',
        password: 'password',
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/register')
          .send(loginAttemptBody)
          .expect(400, { error: 'Bad Request - Missing Credentials' });
      });
    });

    it(`responds with 400 if user_email invalid`, () => {
      const invalidUserEmail = {
        user_email: 'userinvalid',
        user_name: 'new test user name',
        password: 'password',
      };
      return supertest(app)
        .post('/api/auth/register')
        .send(invalidUserEmail)
        .expect(400, { error: 'Invalid Email' });
    });

    it(`responds with 400 if user_email already taken`, () => {
      const takenUserEmail = {
        user_email: testUser.user_email,
        user_name: testUser.user_name,
        password: 'password',
      };
      return supertest(app)
        .post('/api/auth/register')
        .send(takenUserEmail)
        .expect(400, { error: 'Email Already Exists' });
    });

    it(`responds with 400 if user_name already taken`, () => {
      const takenUserEmail = {
        user_email: 'newemail@gmail.com',
        user_name: testUser.user_name,
        password: 'password',
      };
      return supertest(app)
        .post('/api/auth/register')
        .send(takenUserEmail)
        .expect(400, { error: 'Nickname Already Exists' });
    });
  });

  describe(`POST /api/auth/login`, () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

    const requiredFields = ['user_email', 'password'];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        user_email: testUser.user_email,
        password: testUser.password,
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, { error: `Missing '${field}' in request` });
      });
    });

    it(`responds with 400 if username invalid`, () => {
      const invalidUserEmail = {
        user_email: 'userinvalid',
        password: 'existy',
      };
      return supertest(app)
        .post('/api/auth/login')
        .send(invalidUserEmail)
        .expect(400, { error: `Invalid Credentials` });
    });

    it(`responds with 400 if password invalid`, () => {
      const invalidUserEmail = {
        user_email: testUser.user_email,
        password: 'invalidpassword',
      };
      return supertest(app)
        .post('/api/auth/login')
        .send(invalidUserEmail)
        .expect(400, { error: `Invalid Credentials` });
    });

    it(`responds with 200 JWT auth token using secret when valid credentials`, () => {
      const validUserCreds = {
        user_email: testUser.user_email,
        password: testUser.password,
      };
      const expectedToken = jwt.sign(
        { user_id: 1, user_name: testUser.user_name },
        process.env.JWT_SECRET,
        {
          subject: testUser.user_email,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: 'HS256',
        }
      );
      return supertest(app)
        .post('/api/auth/login')
        .send(validUserCreds)
        .expect(200, {
          authToken: expectedToken,
        });
    });
  });
});
