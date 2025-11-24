package com.ushinogg.customgame.service

import com.ushinogg.customgame.dto.ShufflePlayerDto
import com.ushinogg.customgame.dto.ShuffleResponseDto
import org.springframework.stereotype.Service
import kotlin.math.abs
import kotlin.random.Random

/**
 * チームシャッフルサービス
 * MMRに基づいてバランスの取れたチーム分けを行う
 */
@Service
class ShuffleService {
    companion object {
        /** シャッフル試行回数 */
        private const val SHUFFLE_ITERATIONS = 1000

        /** 許容範囲の倍率（最小MMR差の1.2倍以内を許容） */
        private const val TOLERANCE_FACTOR = 1.2
    }

    /**
     * プレイヤーをMMRベースでバランスの取れた2チームに分ける
     * 複数回シャッフルして最もバランスの良い組み合わせを選択
     * 最小MMR差の一定範囲内の候補からランダムに選択することでランダム性を持たせる
     *
     * @param players シャッフル対象のプレイヤーリスト
     * @return チーム分けの結果
     */
    fun shuffleTeams(players: List<ShufflePlayerDto>): ShuffleResponseDto {
        require(players.size >= 2) { "最低2人のプレイヤーが必要です" }
        require(players.size % 2 == 0) { "プレイヤー数は偶数である必要があります" }

        val teamSize = players.size / 2
        val candidates = mutableListOf<Triple<List<ShufflePlayerDto>, List<ShufflePlayerDto>, Double>>()
        var minDifference = Double.MAX_VALUE

        // 複数回シャッフルして良い組み合わせを収集
        repeat(SHUFFLE_ITERATIONS) {
            val shuffled = players.shuffled(Random)
            val team1 = shuffled.take(teamSize)
            val team2 = shuffled.drop(teamSize)

            val team1AvgMmr = team1.map { it.mmr }.average()
            val team2AvgMmr = team2.map { it.mmr }.average()
            val difference = abs(team1AvgMmr - team2AvgMmr)

            // 最小差を更新
            if (difference < minDifference) {
                minDifference = difference
            }

            // 候補として保存
            candidates.add(Triple(team1, team2, difference))
        }

        // 最小差の許容範囲内の候補をフィルタリング
        val threshold = minDifference * TOLERANCE_FACTOR
        val goodCandidates = candidates.filter { it.third <= threshold }

        // 候補からランダムに1つ選択
        val selected = goodCandidates.random(Random)

        val team1AvgMmr = selected.first.map { it.mmr }.average()
        val team2AvgMmr = selected.second.map { it.mmr }.average()

        return ShuffleResponseDto(
            team1 = selected.first,
            team2 = selected.second,
            team1AvgMmr = team1AvgMmr,
            team2AvgMmr = team2AvgMmr,
            mmrDifference = abs(team1AvgMmr - team2AvgMmr),
        )
    }
}
