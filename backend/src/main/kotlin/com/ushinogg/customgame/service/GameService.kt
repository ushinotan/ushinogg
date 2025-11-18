package com.ushinogg.customgame.service

import com.ushinogg.customgame.dto.*
import com.ushinogg.customgame.model.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

/**
 * ゲーム管理サービス
 */
@Service
@Transactional
class GameService(
    private val teamBalancingService: TeamBalancingService
) {
    
    /**
     * 新しいゲームを作成してチーム分けを行う
     */
    fun createGame(request: CreateGameRequest, players: List<Player>): GameDetailDto {
        // チームバランス調整
        val teamAssignment = teamBalancingService.balanceTeams(players)
        
        // ゲーム作成（実際のDB操作は省略、モック実装）
        val game = Game(
            id = System.currentTimeMillis(), // 仮のID
            serverId = request.serverId,
            status = GameStatus.PENDING,
            winningTeam = null,
            createdAt = LocalDateTime.now()
        )
        
        // チーム情報をDTOに変換
        val blueTeamDto = teamAssignment.blueTeam.map { player ->
            GamePlayerDto(
                player = PlayerDto(
                    id = player.id,
                    discordId = player.discordId,
                    discordUsername = player.discordUsername,
                    currentRank = player.currentRank,
                    mmr = player.mmr
                ),
                team = Team.BLUE,
                mmrAtGame = player.mmr
            )
        }
        
        val redTeamDto = teamAssignment.redTeam.map { player ->
            GamePlayerDto(
                player = PlayerDto(
                    id = player.id,
                    discordId = player.discordId,
                    discordUsername = player.discordUsername,
                    currentRank = player.currentRank,
                    mmr = player.mmr
                ),
                team = Team.RED,
                mmrAtGame = player.mmr
            )
        }
        
        return GameDetailDto(
            id = game.id,
            serverId = game.serverId,
            status = game.status,
            winningTeam = game.winningTeam,
            blueTeam = blueTeamDto,
            redTeam = redTeamDto,
            createdAt = game.createdAt,
            completedAt = game.completedAt
        )
    }
    
    /**
     * 試合結果を記録してMMRを更新
     */
    fun recordResult(gameId: Long, winningTeam: Team): GameDetailDto {
        // 実際のDB操作は省略
        // ここでは勝利チームと敗北チームのプレイヤーを取得し、
        // MMRを更新する処理を実装する
        
        TODO("実装予定: 試合結果の記録とMMR更新")
    }
    
    /**
     * 特定のサーバーの試合履歴を取得
     */
    fun getGameHistory(serverId: String): List<GameListDto> {
        // 実際のDB操作は省略
        TODO("実装予定: 試合履歴の取得")
    }
    
    /**
     * 試合詳細を取得
     */
    fun getGameDetail(gameId: Long): GameDetailDto? {
        // 実際のDB操作は省略
        TODO("実装予定: 試合詳細の取得")
    }
}
