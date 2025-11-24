package com.ushinogg.customgame.model

import org.komapper.annotation.KomapperAutoIncrement
import org.komapper.annotation.KomapperColumn
import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable
import java.time.LocalDateTime

@KomapperEntity
@KomapperTable("t_player_stats")
data class PlayerStats(
    @KomapperId
    @KomapperAutoIncrement
    val id: Long = 0,
    @KomapperColumn("player_id")
    val playerId: Long,
    @KomapperColumn("server_id")
    val serverId: String,
    @KomapperColumn("total_games")
    val totalGames: Int = 0,
    @KomapperColumn("wins")
    val wins: Int = 0,
    @KomapperColumn("updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    // 計算プロパティで勝率を算出
    val winRate: Double
        get() = if (totalGames > 0) wins.toDouble() / totalGames else 0.0

    // 敗北数も計算で
    val losses: Int
        get() = totalGames - wins
}
