package com.ushinogg.customgame.model

import org.komapper.annotation.*
import java.time.LocalDateTime

enum class Team {
    BLUE, RED
}

enum class GameStatus {
    PENDING,      // 待機中
    IN_PROGRESS,  // 進行中
    COMPLETED     // 完了
}

@KomapperEntity
@KomapperTable("games")
data class Game(
    @KomapperId
    @KomapperAutoIncrement
    val id: Long = 0,
    
    @KomapperColumn("server_id")
    val serverId: String, // DiscordサーバーID
    
    @KomapperColumn("status")
    val status: GameStatus = GameStatus.PENDING,
    
    @KomapperColumn("winning_team")
    val winningTeam: Team? = null,
    
    @KomapperColumn("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @KomapperColumn("completed_at")
    val completedAt: LocalDateTime? = null
)
