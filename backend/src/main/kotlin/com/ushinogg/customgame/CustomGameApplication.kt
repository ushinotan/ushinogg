package com.ushinogg.customgame

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CustomGameApplication

fun main(args: Array<String>) {
    runApplication<CustomGameApplication>(*args)
}
