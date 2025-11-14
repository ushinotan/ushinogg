package com.ushinogg.customgame.controller

import com.ushinogg.customgame.dto.*
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
     * 参加者取得API
     */
    @GetMapping("/players")
    fun getPlayers(serverId: String, channelId: String): ResponseEntity<List<PlayerDto>> {
        val players = gameService.getAllPlayers(serverId, channelId)
        return ResponseEntity.ok(players)
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
