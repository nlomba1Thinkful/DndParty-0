CREATE TABLE chatmessages (
  id INTEGER PRIMARY KEY GENERATED Always AS IDENTITY,
  user_id int references users (user_id) ON DELETE CASCADE NOT NULL,
  party_id int references parties (party_id) ON DELETE CASCADE NOT NULL,
  message text,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
