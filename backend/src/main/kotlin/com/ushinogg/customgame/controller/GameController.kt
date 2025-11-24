package com.ushinogg.customgame.controller

import com.ushinogg.customgame.dto.PlayerDto
import com.ushinogg.customgame.service.PlayerService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * ゲーム管理REST API
 */
@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = ["http://localhost:3000"])
class GameController(
    private val playerService: PlayerService,
) {
    /**
     * ボイスチャンネルのメンバー取得
     */
    @GetMapping("/members/{serverId}/{channelId}")
    fun getVoiceChannelMembers(
        @PathVariable serverId: String,
        @PathVariable channelId: String,
    ): List<PlayerDto> = playerService.getPlayers(serverId, channelId)
}
