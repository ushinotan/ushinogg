package com.ushinogg.customgame.dto

import jakarta.validation.Valid
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import java.time.LocalDateTime

data class PlayerDto(
    val id: Long,
    val discordId: String,
    val discordUsername: String,
    val currentRank: String?,
    val mmr: Int?,
)

// ゲーム結果登録用のプレイヤー情報（フロントから送信）
data class GameResultPlayerDto(
    @field:NotBlank(message = "discordIdは必須です")
    val discordId: String,
    @field:Min(value = 0, message = "mmrは0以上である必要があります")
    @field:Max(value = 4000, message = "mmrは4000以下である必要があります")
    val mmr: Int, // フロントで選択されたMMR
)

data class GameResultDto(
    @field:NotBlank(message = "serverIdは必須です")
    val serverId: String,
    @field:NotEmpty(message = "winningTeamは空にできません")
    @field:Valid
    val winningTeam: List<GameResultPlayerDto>,
    @field:NotEmpty(message = "losingTeamは空にできません")
    @field:Valid
    val losingTeam: List<GameResultPlayerDto>,
)

data class GamePlayerDto(
    val player: PlayerDto,
    val isWinner: Boolean,
    val mmrAtGame: Int,
)

data class GameDetailDto(
    val id: Long,
    val serverId: String,
    val players: List<GamePlayerDto>,
    val createdAt: LocalDateTime,
)

data class GameListDto(
    val id: Long,
    val serverId: String,
    val playerCount: Int,
    val createdAt: LocalDateTime,
)

// 戦績関連DTO
data class PlayerStatsDto(
    val playerId: Long,
    val discordUsername: String,
    val serverId: String,
    val totalGames: Int,
    val wins: Int,
    val losses: Int,
    val winRate: Double,
    val currentMmr: Int?,
)

data class GameHistoryDto(
    val gameId: Long,
    val isWinner: Boolean,
    val mmrAtGame: Int,
    val gameDate: LocalDateTime,
)

// Shuffle用のプレイヤー情報
data class ShufflePlayerDto(
    @field:NotBlank(message = "discordIdは必須です")
    val discordId: String,
    @field:NotBlank(message = "discordUsernameは必須です")
    val discordUsername: String,
    @field:Min(value = 0, message = "mmrは0以上である必要があります")
    @field:Max(value = 4000, message = "mmrは4000以下である必要があります")
    val mmr: Int,
)

// Shuffleリクエスト
data class ShuffleRequestDto(
    @field:NotEmpty(message = "playersは空にできません")
    @field:Valid
    val players: List<ShufflePlayerDto>,
)

// Shuffleレスポンス（チーム分け結果）
data class ShuffleResponseDto(
    val team1: List<ShufflePlayerDto>,
    val team2: List<ShufflePlayerDto>,
    val team1AvgMmr: Double,
    val team2AvgMmr: Double,
    val mmrDifference: Double,
)
