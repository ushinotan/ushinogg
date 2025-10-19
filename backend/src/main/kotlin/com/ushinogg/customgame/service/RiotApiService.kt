package com.ushinogg.customgame.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject

/**
 * Riot API連携サービス
 * サモナー情報とランク情報を取得
 */
@Service
class RiotApiService(
    @Value("\${riot.api.key:}") private val apiKey: String
) {
    private val restTemplate = RestTemplate()
    
    data class SummonerDto(
        val id: String,
        val accountId: String,
        val puuid: String,
        val name: String,
        val profileIconId: Int,
        val summonerLevel: Long
    )
    
    data class LeagueEntryDto(
        val leagueId: String?,
        val summonerId: String,
        val summonerName: String,
        val queueType: String,
        val tier: String,
        val rank: String,
        val leaguePoints: Int,
        val wins: Int,
        val losses: Int
    )
    
    data class RankInfo(
        val tier: String,
        val division: String,
        val lp: Int,
        val mmrEstimate: Int
    )
    
    /**
     * サモナー名からサモナー情報を取得
     */
    fun getSummonerByName(summonerName: String, region: String = "jp1"): SummonerDto? {
        if (apiKey.isBlank()) {
            println("Riot API Keyが設定されていません")
            return null
        }
        
        return try {
            val url = "https://$region.api.riotgames.com/lol/summoner/v4/summoners/by-name/$summonerName?api_key=$apiKey"
            restTemplate.getForObject<SummonerDto>(url)
        } catch (e: Exception) {
            println("サモナー情報の取得に失敗: ${e.message}")
            null
        }
    }
    
    /**
     * サモナーIDからランク情報を取得
     */
    fun getLeagueEntries(summonerId: String, region: String = "jp1"): List<LeagueEntryDto> {
        if (apiKey.isBlank()) {
            return emptyList()
        }
        
        return try {
            val url = "https://$region.api.riotgames.com/lol/league/v4/entries/by-summoner/$summonerId?api_key=$apiKey"
            restTemplate.getForObject<Array<LeagueEntryDto>>(url)?.toList() ?: emptyList()
        } catch (e: Exception) {
            println("ランク情報の取得に失敗: ${e.message}")
            emptyList()
        }
    }
    
    /**
     * ソロランクの情報を取得（複数のキューから）
     */
    fun getSoloRankInfo(summonerId: String, region: String = "jp1"): RankInfo? {
        val entries = getLeagueEntries(summonerId, region)
        val soloEntry = entries.find { it.queueType == "RANKED_SOLO_5x5" } ?: return null
        
        val mmr = calculateMMRFromRank(soloEntry.tier, soloEntry.rank, soloEntry.leaguePoints)
        
        return RankInfo(
            tier = soloEntry.tier,
            division = soloEntry.rank,
            lp = soloEntry.leaguePoints,
            mmrEstimate = mmr
        )
    }
    
    /**
     * ランクからMMRを推定
     * 各ティアの基準MMRを設定し、ディビジョンとLPから計算
     */
    fun calculateMMRFromRank(tier: String, division: String, lp: Int): Int {
        // ティアごとの基準MMR
        val tierBaseMMR = mapOf(
            "IRON" to 800,
            "BRONZE" to 1000,
            "SILVER" to 1200,
            "GOLD" to 1400,
            "PLATINUM" to 1800,
            "EMERALD" to 2200,
            "DIAMOND" to 2600,
            "MASTER" to 3000,
            "GRANDMASTER" to 3400,
            "CHALLENGER" to 3800
        )
        
        // ディビジョンごとのMMR差（I=0, II=1, III=2, IV=3）
        val divisionOffset = mapOf(
            "I" to 3,
            "II" to 2,
            "III" to 1,
            "IV" to 0
        )
        
        val baseMMR = tierBaseMMR[tier.uppercase()] ?: 1500
        
        // Master以上はディビジョンがない
        if (tier.uppercase() in listOf("MASTER", "GRANDMASTER", "CHALLENGER")) {
            return baseMMR + (lp * 2) // LPに応じて加算
        }
        
        val divisionMult = divisionOffset[division.uppercase()] ?: 0
        val divisionMMR = divisionMult * 100 // 各ディビジョンは100MMR差
        val lpMMR = (lp * 0.8).toInt() // LP 1につき約0.8MMR
        
        return baseMMR + divisionMMR + lpMMR
    }
}
