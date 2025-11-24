-- プレイヤーテーブル
CREATE TABLE IF NOT EXISTS t_player (
    id BIGSERIAL PRIMARY KEY,
    discord_id VARCHAR(255) NOT NULL UNIQUE,
    server_id VARCHAR(255) NOT NULL,
    mmr INTEGER DEFAULT 1500,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_players_discord_id ON t_player(discord_id);
CREATE INDEX idx_players_mmr ON t_player(mmr);

-- ゲームテーブル
CREATE TABLE IF NOT EXISTS t_games (
    id BIGSERIAL PRIMARY KEY,
    server_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_games_server_id ON t_games(server_id);
CREATE INDEX idx_games_created_at ON t_games(created_at DESC);

-- ゲームプレイヤー中間テーブル
CREATE TABLE IF NOT EXISTS game_players (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT NOT NULL REFERENCES t_games(id) ON DELETE CASCADE,
    player_id BIGINT NOT NULL REFERENCES t_player(id) ON DELETE CASCADE,
    is_winner BOOLEAN NOT NULL,
    mmr_at_game INTEGER NOT NULL,
    UNIQUE(game_id, player_id)
);

CREATE INDEX idx_game_players_game_id ON game_players(game_id);
CREATE INDEX idx_game_players_player_id ON game_players(player_id);
CREATE INDEX idx_game_players_is_winner ON game_players(is_winner);
