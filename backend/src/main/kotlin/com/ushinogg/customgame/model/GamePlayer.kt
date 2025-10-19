package com.ushinogg.customgame.model

import org.komapper.annotation.*

@KomapperEntity
@KomapperTable("game_players")
data class GamePlayer(
    @KomapperId
    @KomapperAutoIncrement
    val id: Long = 0,
    
    @KomapperColumn("game_id")
    val gameId: Long,
    
    @KomapperColumn("player_id")
    val playerId: Long,
    
    @KomapperColumn("team")
    val team: Team,
    
    @KomapperColumn("mmr_at_game")
    val mmrAtGame: Int // 試合時のMMR
)
