package com.ushinogg.customgame.repository

import com.ushinogg.customgame.model.GamePlayer
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.operator.desc
import org.komapper.jdbc.JdbcDatabase
import org.springframework.stereotype.Repository

@Repository
class GamePlayerRepository(
    private val database: JdbcDatabase,
) : KomapperMeta() {
    /**
     * ゲームプレイヤーを一括登録
     *
     * @param gamePlayers 登録するゲームプレイヤーのリスト
     */
    fun insertAll(gamePlayers: List<GamePlayer>): List<GamePlayer> {
        val query = QueryDsl.insert(gamePlayerTable).multiple(gamePlayers)
        return database.runQuery(query)
    }

    /**
     * ゲームIDに基づいてゲームプレイヤーを取得
     *
     * @param gameId ゲームID
     */
    fun findByGameId(gameId: Long): List<GamePlayer> {
        val query =
            QueryDsl
                .from(gamePlayerTable)
                .where { gamePlayerTable.gameId eq gameId }
        return database.runQuery(query)
    }

    /**
     * プレイヤーIDに基づいてゲーム履歴を取得
     *
     * @param playerId プレイヤーID
     */
    fun findByPlayerId(playerId: Long): List<GamePlayer> {
        val query =
            QueryDsl
                .from(gamePlayerTable)
                .where { gamePlayerTable.playerId eq playerId }
                .orderBy(gamePlayerTable.id.desc())
        return database.runQuery(query)
    }
}
