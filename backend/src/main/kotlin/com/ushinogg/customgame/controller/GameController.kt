package com.ushinogg.customgame.controller

import com.ushinogg.customgame.dto.*
import com.ushinogg.customgame.model.Player
import com.ushinogg.customgame.service.GameService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * ゲーム管理REST API
 */
@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = ["http://localhost:3000"])
class GameController(
    private val gameService: GameService
) {
    
    /**
     * 新しいゲームを作成
     */
    @PostMapping
    fun createGame(@RequestBody request: CreateGameRequest): ResponseEntity<GameDetailDto> {
        // TODO: 実際にはリポジトリからプレイヤー情報を取得
        // ここではモックデータを使用
        val mockPlayers = (1..10).map { i ->
            Player(
                id = i.toLong(),
                discordId = "discord_$i",
                discordUsername = "Player$i",
                currentRank = listOf("Iron", "Bronze", "Silver", "Gold", "Platinum").random(),
                mmr = (1200..1800).random()
            )
        }
        
        val game = gameService.createGame(request, mockPlayers)
        return ResponseEntity.ok(game)
    }
    
    /**
     * 試合結果を記録
     */
    @PostMapping("/{gameId}/result")
    fun recordResult(
        @PathVariable gameId: Long,
        @RequestBody request: RecordResultRequest
    ): ResponseEntity<GameDetailDto> {
        val game = gameService.recordResult(gameId, request.winningTeam)
        return ResponseEntity.ok(game)
    }
    
    /**
     * サーバーの試合履歴を取得
     */
    @GetMapping("/server/{serverId}")
    fun getGameHistory(@PathVariable serverId: String): ResponseEntity<List<GameListDto>> {
        val games = gameService.getGameHistory(serverId)
        return ResponseEntity.ok(games)
    }
    
    /**
     * 試合詳細を取得
     */
    @GetMapping("/{gameId}")
    fun getGameDetail(@PathVariable gameId: Long): ResponseEntity<GameDetailDto> {
        val game = gameService.getGameDetail(gameId)
        return game?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
    }
}
