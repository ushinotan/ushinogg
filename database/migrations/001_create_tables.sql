-- プレイヤーテーブル
CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    discord_id VARCHAR(255) NOT NULL UNIQUE,
    discord_username VARCHAR(255) NOT NULL,
    summoner_name VARCHAR(255),
    summoner_puuid VARCHAR(255),
    summoner_region VARCHAR(10) DEFAULT 'jp1',
    current_rank VARCHAR(50),
    current_tier VARCHAR(50),
    current_division VARCHAR(10),
    current_lp INTEGER,
    mmr INTEGER NOT NULL DEFAULT 1500,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_players_discord_id ON players(discord_id);
CREATE INDEX idx_players_mmr ON players(mmr);
CREATE INDEX idx_players_summoner_name ON players(summoner_name);

-- ゲームテーブル
CREATE TABLE IF NOT EXISTS games (
    id BIGSERIAL PRIMARY KEY,
    server_id VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    winning_team VARCHAR(10),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_games_server_id ON games(server_id);
CREATE INDEX idx_games_created_at ON games(created_at DESC);

-- ゲーム参加者テーブル
CREATE TABLE IF NOT EXISTS game_players (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    team VARCHAR(10) NOT NULL,
    mmr_at_game INTEGER NOT NULL,
    UNIQUE(game_id, player_id)
);

CREATE INDEX idx_game_players_game_id ON game_players(game_id);
CREATE INDEX idx_game_players_player_id ON game_players(player_id);

-- サンプルデータ挿入
INSERT INTO players (discord_id, discord_username, current_rank, mmr) VALUES
    ('123456789', 'TestPlayer1', 'Gold', 1500),
    ('123456790', 'TestPlayer2', 'Platinum', 1600),
    ('123456791', 'TestPlayer3', 'Silver', 1400),
    ('123456792', 'TestPlayer4', 'Gold', 1550),
    ('123456793', 'TestPlayer5', 'Gold', 1450),
    ('123456794', 'TestPlayer6', 'Gold', 1520),
    ('123456795', 'TestPlayer7', 'Platinum', 1580),
    ('123456796', 'TestPlayer8', 'Silver', 1420),
    ('123456797', 'TestPlayer9', 'Gold', 1530),
    ('123456798', 'TestPlayer10', 'Gold', 1470)
ON CONFLICT (discord_id) DO NOTHING;

-- サンプルゲームデータ
INSERT INTO games (server_id, status, winning_team, created_at, completed_at) VALUES
    ('server_001', 'COMPLETED', 'BLUE', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '30 minutes'),
    ('server_001', 'COMPLETED', 'RED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '35 minutes')
ON CONFLICT DO NOTHING;

-- サンプルゲームプレイヤーデータ
INSERT INTO game_players (game_id, player_id, team, mmr_at_game) 
SELECT 1, id, CASE WHEN id <= 5 THEN 'BLUE' ELSE 'RED' END, mmr
FROM players
WHERE id <= 10
ON CONFLICT DO NOTHING;
