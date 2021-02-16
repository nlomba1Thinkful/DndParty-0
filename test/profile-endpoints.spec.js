const { expect } = require('chai');
const knex = require('knex');
const { describe } = require('mocha');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Profile Endpoints', function () {
  let db;

  const testParties = helpers.parties();
  const testUsers = helpers.users();
  const testUser = testUsers[0];
  const testParty = testParties[0];

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

  describe(`/api/profile`, () => {
    beforeEach('insert party', () =>
      helpers.seedPartiesTables(db, testUsers, testParties)
    );
    it('gets individual Profile user information from database', () => {
      testUser.user_id = '1';
      return supertest(app)
        .get(`/api/profile/${testUser.user_id}`)
        .expect(200)
        .then((res) => {
          const user = res.body;
          expect(user.user_name).to.eql(testUser.user_name);
          expect(user.user_id).to.eql(testUser.user_id);
          expect(user.about_me).to.eql(testUser.about_me);
          delete testUser.user_id;
        });
    });

    it('updates user Profile info', () => {
      testUser.user_id = '1';
      updatedInfo = { user_name: 'Updated Test User Name' };
      return supertest(app)
        .patch(`/api/profile/${testUser.user_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(updatedInfo)
        .expect(200)
        .then((res) => {
          const user = res.body[0];
          expect(user.user_name).to.eql(updatedInfo.user_name);
          expect(user.user_id).to.eql(testUser.user_id);
          expect(user.about_me).to.eql(testUser.about_me);
          delete testUser.user_id;
        });
    });

    it('gets created parties by user', () => {
      testUser.user_id = '1';
      return supertest(app)
        .get(`/api/profile/created_parties/${testUser.user_id}`)
        .expect(200)
        .then((res) => {
          const parties = res.body;
          parties.forEach((party) => {
            expect(party.user_id_creator).to.eql(testUser.user_id);
          });
          delete testUser.user_id;
        });
    });
  });
});
