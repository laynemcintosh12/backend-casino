-- USERS OR COMMON ---------------------------------------------------------------------------------------------

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  balance INT DEFAULT 100000, -- Initial in-game currency balance
  isAdmin BOOLEAN DEFAULT FALSE
);

CREATE TABLE games (
  game_id SERIAL PRIMARY KEY,
  game_type VARCHAR(50) NOT NULL, 
  game_name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE game_history (
  history_id SERIAL PRIMARY KEY,
  game_id INT REFERENCES games(game_id),
  result VARCHAR(50) NOT NULL, 
  bet_amount INT
);



-- BOTS --------------------------------------------------------------------------------------------------------------------

CREATE TABLE bots (
  bot_id SERIAL PRIMARY KEY,
  bot_name VARCHAR(255) NOT NULL,
  bot_type VARCHAR(50) NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- POKER -----------------------------------------------------------------------------------------------------------------

CREATE TABLE poker_games (
  game_id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE poker_players (
  player_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  bot_id INT REFERENCES bots(bot_id),
  game_id INT REFERENCES poker_games(game_id),
  seat_number INT
);

CREATE TABLE poker_actions (
  action_id SERIAL PRIMARY KEY,
  player_id INT REFERENCES poker_players(player_id),
  game_id INT REFERENCES poker_games(game_id),
  action_type VARCHAR(50) NOT NULL,
  amount INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- BLACKJACK ----------------------------------------------------------------------------------------------------------

CREATE TABLE blackjack_games (
  game_id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blackjack_players (
  player_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  bot_id INT REFERENCES bots(bot_id),
  game_id INT REFERENCES blackjack_games(game_id),
  seat_number INT
);

CREATE TABLE blackjack_actions (
  action_id SERIAL PRIMARY KEY,
  player_id INT REFERENCES blackjack_players(player_id),
  game_id INT REFERENCES blackjack_games(game_id),
  action_type VARCHAR(50) NOT NULL,
  amount INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- ROULETTE ------------------------------------------------------------------------------------------------------------

CREATE TABLE roulette_games (
  game_id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roulette_players (
  player_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  bot_id INT REFERENCES bots(bot_id),
  game_id INT REFERENCES roulette_games(game_id),
  seat_number INT
);

CREATE TABLE roulette_actions (
  action_id SERIAL PRIMARY KEY,
  player_id INT REFERENCES roulette_players(player_id),
  game_id INT REFERENCES roulette_games(game_id),
  action_type VARCHAR(50) NOT NULL,
  amount INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


