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

/**
 * Discord Bot
 * スラッシュコマンドで試合を作成
 */
@Component
class DiscordBot(
    @Value("\${discord.bot.token:}") private val botToken: String,
    @Value("\${app.frontend.url:http://localhost:3000}") private val frontendUrl: String
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
                    .setGuildOnly(true),
                Commands.slash("history", "カスタムゲームの履歴を表示")
                    .setGuildOnly(true),
                Commands.slash("mmr", "自分のMMRを確認")
                    .setGuildOnly(true)
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
    
    override fun onSlashCommandInteraction(event: SlashCommandInteractionEvent) {
        when (event.name) {
            "customgame" -> handleCustomGame(event)
            "history" -> handleHistory(event)
            "mmr" -> handleMMR(event)
        }
    }
    
    private fun handleCustomGame(event: SlashCommandInteractionEvent) {
        val guildId = event.guild?.id ?: return
        
        // フロントエンドへのリンクを生成
        val gameUrl = "$frontendUrl/game/new?server=$guildId"
        
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
