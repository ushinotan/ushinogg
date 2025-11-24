package com.ushinogg.customgame.repository

import com.ushinogg.customgame.model.game
import com.ushinogg.customgame.model.gamePlayer
import com.ushinogg.customgame.model.player
import com.ushinogg.customgame.model.playerStats
import org.komapper.core.dsl.Meta

abstract class KomapperMeta {
    val playerTable = Meta.player
    val gameTable = Meta.game
    val gamePlayerTable = Meta.gamePlayer
    val playerStatsTable = Meta.playerStats
}
