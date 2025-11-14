package com.ushinogg.customgame.service

import com.ushinogg.customgame.bot.DiscordBot
import com.ushinogg.customgame.dto.*
import com.ushinogg.customgame.model.*
import com.ushinogg.customgame.repository.PlayerRepository
import net.dv8tion.jda.api.entities.channel.concrete.VoiceChannel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * ゲーム管理サービス
 */
@Service
@Transactional
class GameService(
    private val discordBot: DiscordBot,
    private val playerRepository: PlayerRepository
) {

    /**
     * 試合結果を記録してMMRを更新
     */
    fun recordResult(gameId: Long, winningTeam: Team): GameDetailDto {
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

    /**
     * 指定されたサーバーとチャンネルの全プレイヤーを取得
     * @param serverId DiscordサーバーID
     * @param channelId DiscordボイスチャンネルID
     */
    fun getAllPlayers(serverId: String, channelId: String): List<PlayerDto> {
        val jda = discordBot.getJda()
        val voiceChannel: VoiceChannel = jda.getGuildById(serverId)?.getVoiceChannelById(channelId)
            ?: throw IllegalArgumentException("指定されたサーバーまたはチャンネルが見つかりません")

        return voiceChannel.members.map { member ->
           val existsData =  playerRepository.getPlyerById(member.id, serverId)
            if (existsData != null) {
                PlayerDto(
                    id = member.id,
                    name = member.effectiveName,
                    mmr = existsData.mmr
                )
            } else {
                PlayerDto(
                    id = member.id,
                    name = member.effectiveName,
                    mmr = null
                )
            }
        }
    }
}
