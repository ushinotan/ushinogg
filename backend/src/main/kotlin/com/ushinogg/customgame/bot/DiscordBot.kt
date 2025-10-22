package com.ushinogg.customgame.bot

import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.JDABuilder
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import net.dv8tion.jda.api.interactions.commands.build.Commands
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import jakarta.annotation.PostConstruct
import jakarta.annotation.PreDestroy
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.interactions.InteractionContextType

/**
 * Discord Bot の Spring コンポーネント。
 *
 * - アプリ起動時に JDA を初期化し、スラッシュコマンドを登録します。
 * - `/customgame`、`/history`、`/mmr` のハンドリングを行います。
 * - アプリ終了時に JDA をシャットダウンします。
 *
 * @param botToken Discord Bot のトークン（プロパティ `discord.bot.token`）
 * @param frontendUrl フロントエンドのベース URL（プロパティ `app.frontend.url`）
 * @author 牛乃タン
 */
@Component
class DiscordBot(
    @param:Value("\${discord.bot.token:}") private val botToken: String,
    @param:Value("\${app.frontend.url:http://localhost:3000}") private val frontendUrl: String
) : ListenerAdapter() {

    private var jda: JDA? = null

    @PostConstruct
    fun initialize() {
        if (botToken.isBlank()) {
            println("Discord Botトークンが設定されていません。Botは起動されません。")
            return
        }

        try {
            jda = JDABuilder.createDefault(botToken)
                .setActivity(Activity.playing("LOLカスタムゲーム"))
                .addEventListeners(this)
                .build()
                .awaitReady()

            // スラッシュコマンドを登録
            jda?.updateCommands()?.addCommands(
                Commands.slash("customgame", "カスタムゲームのチーム分けを開始")
                    .setContexts(InteractionContextType.GUILD),
                Commands.slash("history", "カスタムゲームの履歴を表示")
                    .setContexts(InteractionContextType.GUILD),
                Commands.slash("mmr", "自分のMMRを確認")
                    .setContexts(InteractionContextType.GUILD)
            )?.queue()

            println("Discord Bot起動完了")
        } catch (e: Exception) {
            println("Discord Bot起動失敗: ${e.message}")
        }
    }

    @PreDestroy
    fun shutdown() {
        jda?.shutdown()
    }

    /**
     * 指定されたギルドとボイスチャンネルにいる非ボットメンバーのリストを取得します。
     *
     * @param guildId ギルドのID
     * @param channelId ボイスチャンネルのID
     * @return メンバーのリスト、ギルドまたはチャンネルが見つからない場合は空のリスト
     */
    fun getVoiceChannelMembers(guildId: String, channelId: String): List<Member> {
        val jdaInstance = jda ?: return emptyList()
        val guild = jdaInstance.getGuildById(guildId) ?: return emptyList()
        val voiceChannel = guild.getVoiceChannelById(channelId) ?: return emptyList()
        return voiceChannel.members.filter { !it.user.isBot }
    }

    override fun onSlashCommandInteraction(event: SlashCommandInteractionEvent) {
        when (event.name) {
            "customgame" -> handleCustomGame(event)
            "history" -> handleHistory(event)
            "mmr" -> handleMMR(event)
        }
    }

    /**
     * カスタムゲーム作成コマンドのハンドラ。
     *
     * - コマンド発行者がボイスチャンネルに参加していることを確認する。
     * - 参加していない場合はエフェメラルな警告を返信する。
     * - 参加している場合はフロントエンドのゲーム作成ページへのURLを生成して返信する。
     *
     * @param event SlashCommandInteractionEvent スラッシュコマンドイベント
     */
    private fun handleCustomGame(event: SlashCommandInteractionEvent) {
        val guildId = event.guild?.id ?: return

        val voiceChannel = event.member?.voiceState?.channel ?: run {
            event.reply("⚠️ まずボイスチャンネルに参加してください。").setEphemeral(true).queue()
            return
        }

        // フロントエンドへのリンクを生成
        val gameUrl = "$frontendUrl/game/new?server=$guildId&channel=${voiceChannel.id}"

        event.reply("""
            🎮 **カスタムゲーム作成**
            
            以下のリンクからチーム分けを行ってください：
            $gameUrl
            
            ボイスチャンネルに参加している10人のプレイヤーで自動的にチーム分けされます。
        """.trimIndent()).setEphemeral(false).queue()
    }

    private fun handleHistory(event: SlashCommandInteractionEvent) {
        val guildId = event.guild?.id ?: return
        val historyUrl = "$frontendUrl/games?server=$guildId"

        event.reply("""
            📊 **試合履歴**
            
            以下のリンクから試合履歴を確認できます：
            $historyUrl
        """.trimIndent()).setEphemeral(true).queue()
    }

    private fun handleMMR(event: SlashCommandInteractionEvent) {
        val userId = event.user.id

        // TODO: 実際にはデータベースからMMRを取得
        event.reply("""
            📈 **あなたのMMR**
            
            現在のMMR: 1500
            ランク: Gold
            
            試合を重ねることでMMRが変動します。
        """.trimIndent()).setEphemeral(true).queue()
    }
}
