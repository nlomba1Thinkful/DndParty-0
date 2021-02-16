const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Parties Endpoints', function () {
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

  describe(`/api/parties`, () => {
    beforeEach('insert party', () =>
      helpers.seedPartiesTables(db, testUsers, testParties)
    );
    it(`creates a party, responding with 201 and the new party`, function () {
      const testUser = testUsers[0];
      testUser.user_id = '1';
      const newparty = {
        party_name: 'New Test Party 0',
        language: 'English',
        time_of_event: 'Wed @ 8:00pm Est',
        dnd_edition: '1st',
        players_needed: 2,
        dm_needed: true,
        homebrew_rules: 'None',
        classes_needed: 'Any',
        group_personality: 'Laidback',
        online_or_not: 'Online',
        camera_required: 'Yes',
        about: 'About my Lorem Ipsum',
        campaign_or_custom: 'Custom',
        user_id_creator: 1,
      };
      return supertest(app)
        .post('/api/parties')
        .set(
          'Authorization',
          helpers.makeAuthHeader(testUser, process.env.JWT_SECRET)
        )
        .send(newparty)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property('party_id');
          expect(res.body.language).to.eql(newparty.language);
          expect(res.body.time_of_event).to.eql(newparty.time_of_event);
          expect(res.body.party_name).to.eql(newparty.party_name);
          expect(res.body.user_id_creator).to.eql(testUser.user_id);
          const expectedDate = new Date().toLocaleString();
          const actualDate = new Date(res.body.date_created).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
        })
        .expect((res) =>
          db
            .from('parties')
            .select('*')
            .where({ party_id: res.body.party_id })
            .first()
            .then((party) => {
              expect(party.time_of_event).to.eql(newparty.time_of_event);
              expect(party.language).to.eql(newparty.language);
              expect(party.party_name).to.eql(newparty.party_name);
              expect(party.about).to.eql(newparty.about);
              const expectedDate = new Date().toLocaleString();
              const actualDate = new Date(party.date_created).toLocaleString();
              expect(actualDate).to.eql(expectedDate);
              delete testUser.user_id;
            })
        );
    });

    const requiredFields = ['party_name'];

    requiredFields.forEach((field) => {
      const testUser = testUsers[0];
      const newparty = {
        party_name: 'Test Party Name 0',
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newparty[field];
        return supertest(app)
          .post('/api/parties')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newparty)
          .expect(400, { error: 'Missing Required Fields' });
      });
    });

    it(`responds with 400 when party name already taken`, () => {
      newparty = testParties[0];
      return supertest(app)
        .post('/api/parties')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newparty)
        .expect(400, { error: 'Party Name is Already Taken' });
    });

    it('gets all parties from database', () => {
      return supertest(app)
        .get('/api/parties')
        .expect(200)
        .then((res) => {
          const parties = res.body;
          for (let i = 0; i < parties.length; i++) {
            expect(parties[i].time_of_event).to.eql(
              testParties[i].time_of_event
            );
            expect(Number(parties[i].user_id_creator)).to.eql(
              testParties[i].user_id_creator
            );
            expect(parties[i].language).to.eql(testParties[i].language);
            expect(parties[i].party_name).to.eql(testParties[i].party_name);
            expect(parties[i].about).to.eql(testParties[i].about);
          }
        });
    });

    it('gets individual party from database', () => {
      return supertest(app)
        .get('/api/parties/1')
        .expect(200)
        .then((res) => {
          const party = res.body;
          expect(party[0].time_of_event).to.eql(testParty.time_of_event);
          expect(party[0].language).to.eql(testParty.language);
          expect(party[0].party_name).to.eql(testParty.party_name);
          expect(party[0].about).to.eql(testParty.about);
          expect(Number(party[0].user_id_creator)).to.eql(
            testParty.user_id_creator
          );
        });
    });

    it('posts user to requesters table when request to join', () => {
      testParty.party_id = 1;
      testUser.user_id = 1;
      return supertest(app)
        .post('/api/parties/join')
        .send({ party_id: testParty.party_id })
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(201)
        .then(() => {
          db('partyrequests')
            .select('*')
            .where({ party_id: testParty.party_id })
            .then((requests) => {
              for (let i = 0; i < requests.length; i++) {
                expect(requests[i].party_id).to.eql(1);
                delete testUser.user_id;
                delete testParty.party_id;
              }
            });
        });
    });

    it(`responds 200 with Users who joined a particular Party`, () => {
      testParty.party_id = 1;
      const usersWhoJoined = { user_name: 'test-user-2', user_id: '2' };
      return supertest(app)
        .post('/api/parties/joined')
        .send({ party_id: testParty.party_id })
        .expect(200)
        .expect((res) => {
          expect(res.body[0]).to.eql(usersWhoJoined);
          delete testParty.party_id;
        });
    });

    it(`responds 200 with individual User who joined a particular Party`, () => {
      testUser.user_id = '2';
      testParty.party_id = '1';
      return supertest(app)
        .get(`/api/parties/joined/${testUser.user_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect((res) => {
          const party = res.body[0];
          expect(party.party_name).to.eql(testParty.party_name);
          expect(party.party_id).to.eql(testParty.party_id);
          delete testUser.user_id;
          delete testParty.party_id;
        });
    });

    it(`responds 200 and accepts requester to join party`, () => {
      testUser.user_id = 2;
      testParty.party_id = '1';
      let requesterToAccept = {
        user_id: testUser.user_id,
        party_id: testParty.party_id,
        type: 'player',
      };
      return supertest(app)
        .post(`/api/parties/accept_request`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(requesterToAccept)
        .expect(200)
        .expect(() => {
          db('partyusers')
            .select('*')
            .where({ user_id: testUser.user_id })
            .then((res) => {
              const user = res[0];
              expect(user.user_id).to.eql(testUser.user_id);
              delete testUser.user_id;
              delete testParty.party_id;
            });
        });
    });

    it("gets all user's requests to join individual Party from database", () => {
      testParty.party_id = 1;
      const party = { party_id: testParty.party_id };
      return supertest(app)
        .post('/api/parties/requests')
        .send(party)
        .expect(200)
        .then(() => {
          db('partyusers')
            .select('*')
            .where({ party_id: testParty.party_id })
            .then((res) => {
              const parties = res[0];
              expect(parties.party_id).to.eql(testParty.party_id);
              delete testParty.party_id;
            });
        });
    });
  });
});
