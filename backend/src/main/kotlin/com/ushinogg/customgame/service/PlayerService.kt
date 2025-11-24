package com.ushinogg.customgame.service

import com.ushinogg.customgame.bot.DiscordBot
import com.ushinogg.customgame.dto.PlayerDto
import com.ushinogg.customgame.model.Player
import com.ushinogg.customgame.repository.PlayerRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * プレイヤー管理サービス
 */
@Service
@Transactional
class PlayerService(
    private val playerRepository: PlayerRepository,
    private val discordBot: DiscordBot,
) {
    /**
     * ボイスチャンネル内のプレイヤーを取得
     *
     * @param serverId サーバーID
     * @param channelId チャンネルID
     * @return プレイヤーリスト
     */
    fun getPlayers(
        serverId: String,
        channelId: String,
    ): List<PlayerDto> {
        val channelMembers = discordBot.getVoiceChannelMembers(serverId, channelId)
        val serverPlayers = playerRepository.getPlayersByServer(serverId)

        val playersByDiscordId =
            serverPlayers
                .associateBy { it.discordId }

        return channelMembers.map { member ->
            val player = playersByDiscordId[member.id] ?: Player(serverId = serverId, discordId = member.id)
            PlayerDto(
                id = player.id,
                discordId = player.discordId,
                discordUsername = member.effectiveName,
                currentRank = null,
                mmr = player.mmr,
            )
        }
    }
}
