CREATE TABLE partyrequests (
  id INTEGER PRIMARY KEY GENERATED Always AS IDENTITY,
  user_id int references users (user_id) ON DELETE CASCADE NOT NULL,
  party_id int references parties (party_id) ON DELETE CASCADE NOT NULL
);
