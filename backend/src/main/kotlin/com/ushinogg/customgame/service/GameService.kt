package com.ushinogg.customgame.service

import com.ushinogg.customgame.dto.*
import com.ushinogg.customgame.model.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * ゲーム管理サービス
 */
@Service
@Transactional
class GameService(
    private val teamBalancingService: TeamBalancingService,
) {
    /**
     * 試合結果を記録してMMRを更新
     */
    fun recordResult(
        gameId: Long,
        winningTeam: Team,
    ): GameDetailDto {
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
