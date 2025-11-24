package com.ushinogg.customgame.service

import com.ushinogg.customgame.dto.GameDetailDto
import com.ushinogg.customgame.dto.GameListDto
import com.ushinogg.customgame.dto.GamePlayerDto
import com.ushinogg.customgame.dto.GameResultDto
import com.ushinogg.customgame.dto.PlayerDto
import com.ushinogg.customgame.model.Game
import com.ushinogg.customgame.model.GamePlayer
import com.ushinogg.customgame.model.Player
import com.ushinogg.customgame.model.PlayerStats
import com.ushinogg.customgame.repository.GamePlayerRepository
import com.ushinogg.customgame.repository.GameRepository
import com.ushinogg.customgame.repository.PlayerRepository
import com.ushinogg.customgame.repository.PlayerStatsRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow

/**
 * ゲーム管理サービス
 */
@Service
@Transactional
class GameService(
    private val gameRepository: GameRepository,
    private val gamePlayerRepository: GamePlayerRepository,
    private val playerRepository: PlayerRepository,
    private val playerStatsRepository: PlayerStatsRepository,
) {
    companion object {
        private const val K_FACTOR = 32 // MMR変動の係数
        private const val MIN_MMR = 0
        private const val MAX_MMR = 3000
        private const val INDIVIDUAL_WEIGHT = 0.7
        private const val TEAM_WEIGHT = 0.3
    }

    /**
     * ゲーム結果を登録してMMRを更新
     */
    fun registerGameResult(request: GameResultDto): GameDetailDto {
        // 1. ゲームを作成
        val game = Game(serverId = request.serverId)
        val createdGame = gameRepository.create(game)

        // 2. Discord IDからプレイヤー情報を取得または作成
        val winnerPlayers =
            request.winningTeam.map { playerDto ->
                getOrCreatePlayer(playerDto.discordId, request.serverId)
            }
        val loserPlayers =
            request.losingTeam.map { playerDto ->
                getOrCreatePlayer(playerDto.discordId, request.serverId)
            }

        // 3. フロントから送信されたMMRを使用（試合開始時のMMRとして記録）
        val winnerMmrs = request.winningTeam.map { it.mmr }
        val loserMmrs = request.losingTeam.map { it.mmr }

        // 4. 相手チームの平均MMRを計算
        val winnerAvgMmr = winnerMmrs.average()
        val loserAvgMmr = loserMmrs.average()

        // 5. GamePlayerレコードを作成
        val gamePlayers = mutableListOf<GamePlayer>()

        // 勝者
        winnerPlayers.forEachIndexed { index, player ->
            gamePlayers.add(
                GamePlayer(
                    gameId = createdGame.id,
                    playerId = player.id,
                    isWinner = true,
                    mmrAtGame = winnerMmrs[index],
                ),
            )
        }

        // 敗者
        loserPlayers.forEachIndexed { index, player ->
            gamePlayers.add(
                GamePlayer(
                    gameId = createdGame.id,
                    playerId = player.id,
                    isWinner = false,
                    mmrAtGame = loserMmrs[index],
                ),
            )
        }

        gamePlayerRepository.insertAll(gamePlayers)

        // 6. プレイヤーのMMRを個別に更新
        winnerPlayers.forEachIndexed { index, player ->
            val currentMmr = winnerMmrs[index]
            val mmrChange =
                calculateMmrChangeHybrid(
                    playerMmr = currentMmr.toDouble(),
                    teamAvgMmr = winnerAvgMmr,
                    opponentAvgMmr = loserAvgMmr,
                    isWinner = true,
                )
            val newMmr = max(MIN_MMR, min(MAX_MMR, currentMmr + mmrChange))
            playerRepository.updateMmr(player.id, newMmr)
            updatePlayerStats(player.id, request.serverId, isWinner = true)
        }

        loserPlayers.forEachIndexed { index, player ->
            val currentMmr = loserMmrs[index]
            val mmrChange =
                calculateMmrChangeHybrid(
                    playerMmr = currentMmr.toDouble(),
                    teamAvgMmr = loserAvgMmr,
                    opponentAvgMmr = winnerAvgMmr,
                    isWinner = false,
                )
            val newMmr = max(MIN_MMR, min(MAX_MMR, currentMmr + mmrChange))
            playerRepository.updateMmr(player.id, newMmr)
            updatePlayerStats(player.id, request.serverId, isWinner = false)
        }

        // 7. 結果を返す
        return getGameDetail(createdGame.id)
            ?: throw IllegalStateException("作成したゲームが見つかりません")
    }

    /**
     * プレイヤーを取得または作成
     */
    private fun getOrCreatePlayer(
        discordId: String,
        serverId: String,
    ): Player = playerRepository.findOrCreate(discordId, serverId)

    /**
     * MMR変動量を計算（個別プレイヤー vs 相手チーム平均）
     *
     * @param playerMmr このプレイヤーのMMR
     * @param opponentAvgMmr 相手チームの平均MMR
     * @param isWinner このプレイヤーが勝者かどうか
     * @return MMR変動量
     */
    private fun calculateMmrChange(
        playerMmr: Double,
        opponentAvgMmr: Double,
        isWinner: Boolean,
    ): Int {
        // プレイヤーの期待勝率を計算
        val expectedScore = 1.0 / (1.0 + 10.0.pow((opponentAvgMmr - playerMmr) / 400.0))
        val actualScore = if (isWinner) 1.0 else 0.0
        return (K_FACTOR * (actualScore - expectedScore)).toInt()
    }

    /**
     * MMR変動量を計算（ハイブリッド方式：個人 + チーム平均）
     *
     * 個人の実力（70%）とチーム貢献（30%）の両方を加味した計算
     *
     * @param playerMmr このプレイヤーのMMR
     * @param teamAvgMmr このプレイヤーが所属するチームの平均MMR
     * @param opponentAvgMmr 相手チームの平均MMR
     * @param isWinner このプレイヤーが勝者かどうか
     * @return MMR変動量
     */
    private fun calculateMmrChangeHybrid(
        playerMmr: Double,
        teamAvgMmr: Double,
        opponentAvgMmr: Double,
        isWinner: Boolean,
    ): Int {
        // 方式1: 個人MMR vs 相手チーム平均（個人実力重視）
        val individualExpectedScore = 1.0 / (1.0 + 10.0.pow((opponentAvgMmr - playerMmr) / 400.0))

        // 方式2: チーム平均 vs 相手チーム平均（チーム貢献重視）
        val teamExpectedScore = 1.0 / (1.0 + 10.0.pow((opponentAvgMmr - teamAvgMmr) / 400.0))

        // ハイブリッド: 両方を重み付け平均（70%個人 + 30%チーム）
        val hybridExpectedScore = (individualExpectedScore * INDIVIDUAL_WEIGHT) + (teamExpectedScore * TEAM_WEIGHT)

        val actualScore = if (isWinner) 1.0 else 0.0
        return (K_FACTOR * (actualScore - hybridExpectedScore)).toInt()
    }

    /**
     * プレイヤー戦績を更新
     */
    private fun updatePlayerStats(
        playerId: Long,
        serverId: String,
        isWinner: Boolean,
    ) {
        val existingStats = playerStatsRepository.findByPlayerIdAndServerId(playerId, serverId)

        val updatedStats =
            existingStats?.copy(
                totalGames = existingStats.totalGames + 1,
                wins = if (isWinner) existingStats.wins + 1 else existingStats.wins,
            )
                ?: PlayerStats(
                    playerId = playerId,
                    serverId = serverId,
                    totalGames = 1,
                    wins = if (isWinner) 1 else 0,
                )

        playerStatsRepository.upsert(updatedStats)
    }

    /**
     * 特定のサーバーの試合履歴を取得
     */
    fun getGameHistory(serverId: String): List<GameListDto> {
        val games = gameRepository.findByServerId(serverId)

        return games.map { game ->
            val players = gamePlayerRepository.findByGameId(game.id)
            GameListDto(
                id = game.id,
                serverId = game.serverId,
                playerCount = players.size,
                createdAt = game.createdAt,
            )
        }
    }

    /**
     * 試合詳細を取得
     */
    fun getGameDetail(gameId: Long): GameDetailDto? {
        val game = gameRepository.findById(gameId) ?: return null
        val gamePlayers = gamePlayerRepository.findByGameId(gameId)
        val playerIds = gamePlayers.map { it.playerId }
        val players = playerRepository.findByIds(playerIds)
        val playerMap = players.associateBy { it.id }

        val gamePlayerDtos =
            gamePlayers.map { gp ->
                val player = playerMap[gp.playerId]
                GamePlayerDto(
                    player =
                        PlayerDto(
                            id = player?.id ?: 0,
                            discordId = player?.discordId ?: "",
                            discordUsername = player?.discordId ?: "Unknown",
                            currentRank = null,
                            mmr = player?.mmr,
                        ),
                    isWinner = gp.isWinner,
                    mmrAtGame = gp.mmrAtGame,
                )
            }

        return GameDetailDto(
            id = game.id,
            serverId = game.serverId,
            players = gamePlayerDtos,
            createdAt = game.createdAt,
        )
    }
}
