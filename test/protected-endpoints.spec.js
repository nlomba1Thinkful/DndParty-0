const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected endpoints', function () {
  let db;
  const testUsers = helpers.users();
  const testParties = helpers.parties();
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
  beforeEach('insert things', () =>
    helpers.seedPartiesTables(db, testUsers, testParties)
  );
  const protectedEndpoints = [
    {
      name: 'POST /api/parties',
      path: '/api/parties',
      method: supertest(app).post,
    },
    {
      name: `POST /api/parties/join`,
      path: `/api/parties/join`,
      method: supertest(app).post,
    },
    {
      name: `POST /api/parties/accept_request`,
      path: `/api/parties/accept_request`,
      method: supertest(app).post,
    },
    {
      name: `PATCH /api/profile/1`,
      path: `/api/profile/1`,
      method: supertest(app).patch,
    },
  ];
  protectedEndpoints.forEach((endpoint) => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint
          .method(endpoint.path)
          .expect(401, { error: `Missing bearer token` });
      });
      it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
        const userNoCreds = { user_email: '', password: '' };
        return endpoint
          .method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(userNoCreds))
          .expect(401, { error: `Unauthorized request` });
      });
      it(`responds 401 'Unauthorized request' when invalid user`, () => {
        const userInvalidCreds = { user_email: 'user-not', password: 'existy' };
        return endpoint
          .method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(userInvalidCreds))
          .expect(401, { error: `Unauthorized request` });
      });
      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0];
        const invalidSecret = 'bad-secret';
        return endpoint
          .method(endpoint.path)
          .set(
            'Authorization',
            helpers.makeAuthHeader(validUser, invalidSecret)
          )
          .expect(401, { error: `Unauthorized request` });
      });

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { user_email: 'user-not-existy', user_id: 1 };
        return endpoint
          .method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` });
      });
    });
  });
});
