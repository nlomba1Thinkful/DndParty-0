CREATE TABLE character_sheets (
  char_id INTEGER PRIMARY KEY GENERATED Always AS IDENTITY,
  url TEXT DEFAULT NULL,
  user_id int references users (user_id) ON DELETE CASCADE NOT NULL,
  date_modified TIMESTAMPTZ DEFAULT now() NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
