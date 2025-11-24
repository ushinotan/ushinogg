package com.ushinogg.customgame.repository

import com.ushinogg.customgame.model.PlayerStats
import org.komapper.core.dsl.QueryDsl
import org.komapper.jdbc.JdbcDatabase
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class PlayerStatsRepository(
    private val database: JdbcDatabase,
) : KomapperMeta() {
    /**
     * プレイヤーとサーバーIDで戦績を取得
     *
     * @param playerId プレイヤーID
     * @param serverId サーバーID
     */
    fun findByPlayerIdAndServerId(
        playerId: Long,
        serverId: String,
    ): PlayerStats? {
        val query =
            QueryDsl
                .from(playerStatsTable)
                .where {
                    playerStatsTable.playerId eq playerId
                    playerStatsTable.serverId eq serverId
                }
        return database.runQuery(query).firstOrNull()
    }

    /**
     * 戦績を作成または更新
     *
     * @param stats 戦績データ
     */
    fun upsert(stats: PlayerStats): PlayerStats {
        val existing = findByPlayerIdAndServerId(stats.playerId, stats.serverId)

        return if (existing != null) {
            // 更新
            val updated =
                existing.copy(
                    totalGames = stats.totalGames,
                    wins = stats.wins,
                    updatedAt = LocalDateTime.now(),
                )
            val query = QueryDsl.update(playerStatsTable).single(updated)
            database.runQuery(query)
        } else {
            // 新規作成
            val query = QueryDsl.insert(playerStatsTable).single(stats)
            database.runQuery(query)
        }
    }
}
