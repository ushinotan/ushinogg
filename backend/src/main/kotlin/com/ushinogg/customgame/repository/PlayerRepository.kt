package com.ushinogg.customgame.repository

import com.ushinogg.customgame.model.Player
import org.komapper.core.dsl.QueryDsl
import org.komapper.jdbc.JdbcDatabase
import org.springframework.stereotype.Repository

@Repository
class PlayerRepository(
    private val database: JdbcDatabase,
) : KomapperMeta() {
    /**
     * サーバーIDに基づいてプレイヤーを取得
     *
     * @param serverId サーバーID
     */
    fun getPlayersByServer(serverId: String): List<Player> {
        val query =
            QueryDsl.from(playerTable).where {
                playerTable.serverId eq serverId
            }
        return database.runQuery(query)
    }

    /**
     * プレイヤーIDでプレイヤーを取得
     *
     * @param playerId プレイヤーID
     */
    fun findById(playerId: Long): Player? {
        val query =
            QueryDsl.from(playerTable).where {
                playerTable.id eq playerId
            }
        return database.runQuery(query).firstOrNull()
    }

    /**
     * プレイヤーIDのリストで複数プレイヤーを取得
     *
     * @param playerIds プレイヤーIDのリスト
     */
    fun findByIds(playerIds: List<Long>): List<Player> {
        val query =
            QueryDsl.from(playerTable).where {
                playerTable.id inList playerIds
            }
        return database.runQuery(query)
    }

    /**
     * プレイヤーのMMRを更新
     *
     * @param playerId プレイヤーID
     * @param newMmr 新しいMMR
     */
    fun updateMmr(
        playerId: Long,
        newMmr: Int,
    ): Player? {
        val existing = findById(playerId) ?: return null
        val updated = existing.copy(mmr = newMmr)
        val query = QueryDsl.update(playerTable).single(updated)
        return database.runQuery(query)
    }

    /**
     * Discord IDとサーバーIDでプレイヤーを取得
     */
    fun findByDiscordIdAndServerId(
        discordId: String,
        serverId: String,
    ): Player? {
        val query =
            QueryDsl.from(playerTable).where {
                playerTable.discordId eq discordId
                playerTable.serverId eq serverId
            }
        return database.runQuery(query).firstOrNull()
    }

    /**
     * プレイヤーを作成または取得
     */
    fun findOrCreate(
        discordId: String,
        serverId: String,
    ): Player {
        val existing = findByDiscordIdAndServerId(discordId, serverId)
        if (existing != null) return existing

        val newPlayer =
            Player(
                discordId = discordId,
                serverId = serverId,
            )
        val query = QueryDsl.insert(playerTable).single(newPlayer)
        return database.runQuery(query)
    }
}
