package com.ushinogg.customgame.dto

import com.ushinogg.customgame.model.GameStatus
import com.ushinogg.customgame.model.Team
import java.time.LocalDateTime

data class PlayerDto(
    val id: Long,
    val discordId: String,
    val discordUsername: String,
    val currentRank: String?,
    val mmr: Int?,
)

data class GamePlayerDto(
    val player: PlayerDto,
    val team: Team,
    val mmrAtGame: Int,
)

data class GameDetailDto(
    val id: Long,
    val serverId: String,
    val status: GameStatus,
    val winningTeam: Team?,
    val blueTeam: List<GamePlayerDto>,
    val redTeam: List<GamePlayerDto>,
    val createdAt: LocalDateTime,
    val completedAt: LocalDateTime?,
)

data class CreateGameRequest(
    val serverId: String,
    val playerIds: List<Long>,
)

data class RecordResultRequest(
    val gameId: Long,
    val winningTeam: Team,
)

data class GameListDto(
    val id: Long,
    val serverId: String,
    val status: GameStatus,
    val winningTeam: Team?,
    val blueTeamCount: Int,
    val redTeamCount: Int,
    val createdAt: LocalDateTime,
)
