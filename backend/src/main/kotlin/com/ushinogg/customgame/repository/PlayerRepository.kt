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
}
