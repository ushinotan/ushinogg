package com.ushinogg.customgame.controller

import com.ushinogg.customgame.dto.GameDetailDto
import com.ushinogg.customgame.dto.GameListDto
import com.ushinogg.customgame.dto.GameResultDto
import com.ushinogg.customgame.dto.PlayerDto
import com.ushinogg.customgame.service.GameService
import com.ushinogg.customgame.service.PlayerService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

/**
 * ゲーム管理REST API
 */
@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = ["http://localhost:3000"])
class GameController(
    private val playerService: PlayerService,
    private val gameService: GameService,
) {
    /**
     * ボイスチャンネルのメンバー取得
     */
    @GetMapping("/members/{serverId}/{channelId}")
    fun getVoiceChannelMembers(
        @PathVariable serverId: String,
        @PathVariable channelId: String,
    ): List<PlayerDto> = playerService.getPlayers(serverId, channelId)

    /**
     * ゲーム結果の登録
     */
    @PostMapping("/result")
    fun registerGameResult(
        @Valid @RequestBody request: GameResultDto,
    ): GameDetailDto = gameService.registerGameResult(request)

    /**
     * サーバーの試合履歴を取得
     */
    @GetMapping("/history/{serverId}")
    fun getGameHistory(
        @PathVariable serverId: String,
    ): List<GameListDto> = gameService.getGameHistory(serverId)

    /**
     * 試合詳細を取得
     *
     * @param gameId ゲームID
     */
    @GetMapping("/{gameId}")
    fun getGameDetail(
        @PathVariable gameId: Long,
    ): GameDetailDto =
        gameService.getGameDetail(gameId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "ゲームID $gameId が見つかりません")
}
