const express = require("express")

module.exports = function(server) {

    // API Routes
    const router = express.Router()
    server.use("/api", router)

    // Condominios e Sensores - Routes
    const condominios = require("../models/condominios")
    condominios.register(router, "/condominios")

    // Leituras de Sensores - Routes
    const leituras = require("../models/leituras")
    leituras.register(router, "/leituras")






}