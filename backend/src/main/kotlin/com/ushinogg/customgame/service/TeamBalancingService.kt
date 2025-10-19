package com.ushinogg.customgame.service

import com.ushinogg.customgame.model.Player
import com.ushinogg.customgame.model.Team
import org.springframework.stereotype.Service
import kotlin.math.abs
import kotlin.random.Random

/**
 * チーム分けサービス
 * MMRと現在のランクを考慮してバランスの取れたチームを作成
 */
@Service
class TeamBalancingService {
    
    data class TeamAssignment(
        val blueTeam: List<Player>,
        val redTeam: List<Player>,
        val mmrDifference: Int
    )
    
    /**
     * プレイヤーをMMRベースでバランスの取れた2チームに分ける
     * 複数回シャッフルして最もバランスの良い組み合わせを選択
     */
    fun balanceTeams(players: List<Player>, iterations: Int = 1000): TeamAssignment {
        require(players.size >= 10) { "最低10人のプレイヤーが必要です" }
        require(players.size % 2 == 0) { "プレイヤー数は偶数である必要があります" }
        
        val teamSize = players.size / 2
        var bestAssignment: TeamAssignment? = null
        var bestDifference = Int.MAX_VALUE
        
        repeat(iterations) {
            val shuffled = players.shuffled(Random)
            val blueTeam = shuffled.take(teamSize)
            val redTeam = shuffled.drop(teamSize)
            
            val blueMMR = blueTeam.sumOf { it.mmr }
            val redMMR = redTeam.sumOf { it.mmr }
            val difference = abs(blueMMR - redMMR)
            
            if (difference < bestDifference) {
                bestDifference = difference
                bestAssignment = TeamAssignment(blueTeam, redTeam, difference)
            }
        }
        
        return bestAssignment!!
    }
    
    /**
     * MMRを更新
     * 勝利チームのMMRを増加、敗北チームのMMRを減少
     */
    fun updateMMR(winners: List<Player>, losers: List<Player>, kFactor: Int = 32): Map<Long, Int> {
        val winnerAvgMMR = winners.map { it.mmr }.average()
        val loserAvgMMR = losers.map { it.mmr }.average()
        
        // 期待勝率を計算 (Elo rating system)
        val expectedWinRate = 1.0 / (1.0 + Math.pow(10.0, (loserAvgMMR - winnerAvgMMR) / 400.0))
        
        val mmrChanges = mutableMapOf<Long, Int>()
        
        // 勝者のMMR増加
        winners.forEach { player ->
            val change = (kFactor * (1 - expectedWinRate)).toInt()
            mmrChanges[player.id] = player.mmr + change
        }
        
        // 敗者のMMR減少
        losers.forEach { player ->
            val change = (kFactor * expectedWinRate).toInt()
            mmrChanges[player.id] = maxOf(0, player.mmr - change) // MMRは0以下にならない
        }
        
        return mmrChanges
    }
}
