package com.ushinogg.customgame.model

import org.komapper.annotation.*
import java.time.LocalDateTime

@KomapperEntity
@KomapperTable("t_player")
data class Player(
    @KomapperId
    @KomapperAutoIncrement
    val id: Long = 0,

    @KomapperColumn("discord_id")
    val discordId: String,

    @KomapperColumn("channel_id")
    val serverId: String,

    @KomapperColumn("mmr")
    val mmr: Int = 1500, // デフォルトMMR

    @KomapperColumn("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @KomapperColumn("updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
