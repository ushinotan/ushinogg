package com.ushinogg.customgame.service

import com.ushinogg.customgame.model.Player
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

/**
 * プレイヤー管理サービス
 */
@Service
@Transactional
class PlayerService(
    private val riotApiService: RiotApiService
) {
    
    /**
     * サモナー名を登録してRiot APIからランク情報を取得
     * 初期MMRをソロランクから計算
     */
    fun registerSummonerName(
        player: Player,
        summonerName: String,
        region: String = "jp1"
    ): Player {
        // Riot APIからサモナー情報を取得
        val summoner = riotApiService.getSummonerByName(summonerName, region)
            ?: throw IllegalArgumentException("サモナー '$summonerName' が見つかりません")
        
        // ランク情報を取得
        val rankInfo = riotApiService.getSoloRankInfo(summoner.id, region)
        
        // MMRを計算（ランク情報がない場合はデフォルト1500）
        val calculatedMMR = rankInfo?.mmrEstimate ?: 1500
        val currentRank = if (rankInfo != null) {
            "${rankInfo.tier} ${rankInfo.division}"
        } else {
            "UNRANKED"
        }
        
        // プレイヤー情報を更新
        return player.copy(
            summonerName = summoner.name,
            summonerPuuid = summoner.puuid,
            summonerRegion = region,
            currentRank = currentRank,
            currentTier = rankInfo?.tier,
            currentDivision = rankInfo?.division,
            currentLp = rankInfo?.lp,
            mmr = calculatedMMR,
            updatedAt = LocalDateTime.now()
        )
    }
    
    /**
     * ランク情報を更新してMMRを再計算
     */
    fun updateRankInfo(player: Player): Player {
        if (player.summonerName == null) {
            throw IllegalArgumentException("サモナー名が登録されていません")
        }
        
        // Riot APIからサモナー情報を取得
        val summoner = riotApiService.getSummonerByName(player.summonerName, player.summonerRegion)
            ?: throw IllegalArgumentException("サモナー '${player.summonerName}' が見つかりません")
        
        // ランク情報を取得
        val rankInfo = riotApiService.getSoloRankInfo(summoner.id, player.summonerRegion)
        
        // MMRを計算
        val calculatedMMR = rankInfo?.mmrEstimate ?: player.mmr
        val currentRank = if (rankInfo != null) {
            "${rankInfo.tier} ${rankInfo.division}"
        } else {
            "UNRANKED"
        }
        
        // プレイヤー情報を更新
        return player.copy(
            currentRank = currentRank,
            currentTier = rankInfo?.tier,
            currentDivision = rankInfo?.division,
            currentLp = rankInfo?.lp,
            mmr = calculatedMMR,
            updatedAt = LocalDateTime.now()
        )
    }
}
