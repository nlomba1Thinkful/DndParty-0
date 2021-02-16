const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function users() {
  return [
    {
      user_name: 'test-user-1',
      user_email: 'TU1@gmail.com',
      password: 'password',
      first_name: 'john',
      last_name: 'doe',
      dnd_experience: 'none',
      location: 'US',
      languages: 'English',
      contact: 'email',
      about_me: 'I was once a wizard',
      preferred_editions: '1st',
      preferred_classes: 'any',
    },
    {
      user_name: 'test-user-2',
      user_email: 'TU2@gmail.com',
      password: 'password',
      first_name: 'john',
      last_name: 'doe',
      dnd_experience: 'none',
      location: 'US',
      languages: 'English',
      contact: 'email',
      about_me: 'I was once a wizard',
      preferred_editions: '1st',
      preferred_classes: 'any',
    },
    {
      user_name: 'test-user-3',
      user_email: 'TU3@gmail.com',
      password: 'password',
      first_name: 'john',
      last_name: 'doe',
      dnd_experience: 'none',
      location: 'US',
      languages: 'English',
      contact: 'email',
      about_me: 'I was once a wizard',
      preferred_editions: '1st',
      preferred_classes: 'any',
    },
    {
      user_name: 'test-user-4',
      user_email: 'TU4@gmail.com',
      password: 'password',
      first_name: 'john',
      last_name: 'doe',
      dnd_experience: 'none',
      location: 'US',
      languages: 'English',
      contact: 'email',
      about_me: 'I was once a wizard',
      preferred_editions: '1st',
      preferred_classes: 'any',
    },
  ];
}

function parties() {
  return [
    {
      party_name: 'Test Party 1',
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
    },
    {
      party_name: 'Test Party 2',
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
    },
    {
      party_name: 'Test Party 3',
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
      user_id_creator: 2,
    },
    {
      party_name: 'Test Party 4',
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
      user_id_creator: 2,
    },
  ];
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      partyrequests,
      partyusers,
      users,
      parties
      RESTART IDENTITY CASCADE`
  );
}

function seedUsers(db, users) {
  const encryptedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db.into('users').insert(encryptedUsers);
}

function seedPartiesTables(db, users, parties = []) {
  return db('users')
    .then(() => seedUsers(db, users))
    .then(() => db.into('parties').insert(parties))
    .then(() => db.into('partyrequests').insert({ user_id: 3, party_id: 1 }))
    .then(() => db.into('partyusers').insert({ user_id: 2, party_id: 1 }));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: 1, user_name: user.user_name }, secret, {
    subject: user.user_email,
    algorithm: 'HS256',
  });
  return `bearer ${token}`;
}

module.exports = {
  users,
  parties,
  cleanTables,
  seedUsers,
  seedPartiesTables,
  makeAuthHeader,
};
