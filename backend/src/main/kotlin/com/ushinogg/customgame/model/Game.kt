package com.ushinogg.customgame.model

import org.komapper.annotation.*
import java.time.LocalDateTime

@KomapperEntity
@KomapperTable("t_games")
data class Game(
    @KomapperId
    @KomapperAutoIncrement
    val id: Long = 0,
    @KomapperColumn("server_id")
    val serverId: String, // DiscordサーバーID
    @KomapperColumn("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
)
