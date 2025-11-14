package com.ushinogg.customgame.repository

import com.ushinogg.customgame.model.Player
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.Query
import org.komapper.core.dsl.query.first
import org.komapper.jdbc.JdbcDatabase
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
@Transactional
class PlayerRepository(private val database: JdbcDatabase): KomapperMeta() {

    /**
     * DiscordIDとサーバーIDでプレイヤーを取得
     *
     * @param discordId DiscordのユーザーID
     * @param serverId DiscordのサーバーID
     * @return プレイヤー情報、存在しない場合はnull
     */
    fun getPlyerById(discordId: String, serverId: String): Player? {
        val query: Query<Player> = QueryDsl.from(playerTable)
            .where {
                playerTable.discordId eq discordId
                playerTable.serverId eq serverId
            } .first()
        return database.runQuery(query)
    }


}
