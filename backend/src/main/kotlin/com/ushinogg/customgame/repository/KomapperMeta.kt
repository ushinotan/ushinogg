package com.ushinogg.customgame.repository

import com.ushinogg.customgame.model.player
import org.komapper.core.dsl.Meta

abstract class KomapperMeta {
    val playerTable = Meta.player
}
