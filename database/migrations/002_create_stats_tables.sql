-- プレイヤー戦績サマリーテーブル
CREATE TABLE IF NOT EXISTS t_player_stats (
    id BIGSERIAL PRIMARY KEY,
    player_id BIGINT NOT NULL REFERENCES t_player(id) ON DELETE CASCADE,
    server_id VARCHAR(255) NOT NULL,
    total_games INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(player_id, server_id)
);

-- 必要最低限のインデックスだけ！
CREATE INDEX idx_player_stats_player_server ON t_player_stats(player_id, server_id);
CREATE INDEX idx_player_stats_server_wins ON t_player_stats(server_id, wins DESC);

-- 戦績詳細ビュー（game_playersから履歴を取得）
CREATE OR REPLACE VIEW v_player_game_results AS
SELECT
    p.id as player_id,
    p.server_id,
    g.id as game_id,
    gp.is_winner,
    gp.mmr_at_game as mmr_before,
    g.created_at as game_date
FROM t_player p
JOIN game_players gp ON p.id = gp.player_id
JOIN t_games g ON gp.game_id = g.id
ORDER BY g.created_at DESC;
