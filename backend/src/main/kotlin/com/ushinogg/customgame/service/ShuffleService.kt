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
     * 2パスアプローチで効率的にシャッフル：
     * - 第1パス：最小MMR差を見つける
     * - 第2パス：閾値以内の候補が見つかったら即座に採用
     *
     * @param players シャッフル対象のプレイヤーリスト
     * @return チーム分けの結果
     */
    fun shuffleTeams(players: List<ShufflePlayerDto>): ShuffleResponseDto {
        require(players.size >= 2) { "最低2人のプレイヤーが必要です" }
        require(players.size % 2 == 0) { "プレイヤー数は偶数である必要があります" }

        val teamSize = players.size / 2

        // 第1パス：最小MMR差を見つける
        var minDifference = Double.MAX_VALUE
        repeat(SHUFFLE_ITERATIONS) {
            val shuffled = players.shuffled(Random)
            val team1 = shuffled.take(teamSize)
            val team2 = shuffled.drop(teamSize)

            val team1AvgMmr = team1.map { it.mmr }.average()
            val team2AvgMmr = team2.map { it.mmr }.average()
            val difference = abs(team1AvgMmr - team2AvgMmr)

            if (difference < minDifference) {
                minDifference = difference
            }
        }

        // 第2パス：閾値以内の候補からランダムに選択
        val threshold = minDifference * TOLERANCE_FACTOR
        val candidates = mutableListOf<Pair<List<ShufflePlayerDto>, List<ShufflePlayerDto>>>()

        repeat(SHUFFLE_ITERATIONS) {
            val shuffled = players.shuffled(Random)
            val team1 = shuffled.take(teamSize)
            val team2 = shuffled.drop(teamSize)

            val team1AvgMmr = team1.map { it.mmr }.average()
            val team2AvgMmr = team2.map { it.mmr }.average()
            val difference = abs(team1AvgMmr - team2AvgMmr)

            // 閾値以内の候補のみ保存
            if (difference <= threshold) {
                candidates.add(Pair(team1, team2))
            }
        }

        // 候補からランダムに1つ選択
        val selected = candidates.random(Random)

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
