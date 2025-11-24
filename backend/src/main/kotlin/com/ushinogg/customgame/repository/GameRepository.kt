package com.ushinogg.customgame.repository

import com.ushinogg.customgame.model.Game
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.operator.desc
import org.komapper.jdbc.JdbcDatabase
import org.springframework.stereotype.Repository

@Repository
class GameRepository(
    private val database: JdbcDatabase,
) : KomapperMeta() {
    /**
     * ゲームを作成
     *
     * @param game 作成するゲーム
     */
    fun create(game: Game): Game {
        val query = QueryDsl.insert(gameTable).single(game)
        return database.runQuery(query)
    }

    /**
     * サーバーIDに基づいてゲーム履歴を取得
     *
     * @param serverId サーバーID
     */
    fun findByServerId(serverId: String): List<Game> {
        val query =
            QueryDsl
                .from(gameTable)
                .where { gameTable.serverId eq serverId }
                .orderBy(gameTable.createdAt.desc())
        return database.runQuery(query)
    }

    /**
     * ゲームIDでゲームを取得
     *
     * @param gameId ゲームID
     */
    fun findById(gameId: Long): Game? {
        val query =
            QueryDsl
                .from(gameTable)
                .where { gameTable.id eq gameId }
        return database.runQuery(query).firstOrNull()
    }
}
