package com.ushinogg.customgame.controller

import com.ushinogg.customgame.model.Player
import com.ushinogg.customgame.service.PlayerService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * プレイヤー管理REST API
 */
@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = ["http://localhost:3000"])
class PlayerController(
    private val playerService: PlayerService
) {
    
    data class RegisterSummonerRequest(
        val playerId: Long,
        val summonerName: String,
        val region: String = "jp1"
    )
    
    data class PlayerResponse(
        val id: Long,
        val discordId: String,
        val discordUsername: String,
        val summonerName: String?,
        val summonerRegion: String,
        val currentRank: String?,
        val currentTier: String?,
        val currentDivision: String?,
        val currentLp: Int?,
        val mmr: Int
    )
    
    /**
     * サモナー名を登録
     */
    @PostMapping("/{playerId}/register-summoner")
    fun registerSummoner(
        @PathVariable playerId: Long,
        @RequestBody request: RegisterSummonerRequest
    ): ResponseEntity<PlayerResponse> {
        // TODO: 実際にはリポジトリからプレイヤーを取得
        // ここではモックプレイヤーを使用
        val mockPlayer = Player(
            id = playerId,
            discordId = "discord_$playerId",
            discordUsername = "Player$playerId"
        )
        
        try {
            val updatedPlayer = playerService.registerSummonerName(
                mockPlayer,
                request.summonerName,
                request.region
            )
            
            return ResponseEntity.ok(toResponse(updatedPlayer))
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.badRequest().build()
        }
    }
    
    /**
     * ランク情報を更新
     */
    @PostMapping("/{playerId}/update-rank")
    fun updateRank(@PathVariable playerId: Long): ResponseEntity<PlayerResponse> {
        // TODO: 実際にはリポジトリからプレイヤーを取得
        val mockPlayer = Player(
            id = playerId,
            discordId = "discord_$playerId",
            discordUsername = "Player$playerId",
            summonerName = "TestSummoner",
            summonerRegion = "jp1"
        )
        
        try {
            val updatedPlayer = playerService.updateRankInfo(mockPlayer)
            return ResponseEntity.ok(toResponse(updatedPlayer))
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.badRequest().build()
        }
    }
    
    private fun toResponse(player: Player): PlayerResponse {
        return PlayerResponse(
            id = player.id,
            discordId = player.discordId,
            discordUsername = player.discordUsername,
            summonerName = player.summonerName,
            summonerRegion = player.summonerRegion,
            currentRank = player.currentRank,
            currentTier = player.currentTier,
            currentDivision = player.currentDivision,
            currentLp = player.currentLp,
            mmr = player.mmr
        )
    }
}
