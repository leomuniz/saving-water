const express = require("express")
const jwt = require("jsonwebtoken")

module.exports = function(server) {

    // SITE Routes
    const siteRouter = express.Router()
    server.use("/", siteRouter)

    siteRouter.get("/", (req, res, next) => {
        res.send("Prédios inteligentes")
        next()   
    })

    siteRouter.get("/contato/", (req, res, next) => {
        res.send("Contato - 2556-4327")
        next();
    })


    // API Routes
    const apiRouter = express.Router()
    server.use("/api", apiRouter)

    apiRouter.all("/", (req, res, next) => {
        res.json({ error: 'Invalid endpoint'})
        next()
    })

    // Cria o token para acesso a API
    const user = require("../controllers/users")
    apiRouter.post("/authorize/",user.authorize)

    // verify if user is allowed to access API and verify permissions of endpoints according to the role
    apiRouter.use(user.verifyToken)

    // Condominios- Routes
    const condominios = require("../models/condominios")
    condominios.register(apiRouter, "/condominios")

    // Módulos - Routes
    const modulos = require("../models/modulos")
    modulos.register(apiRouter, "/modulos")

    // Sensores - Routes
    const sensores = require("../models/sensores")
    sensores.register(apiRouter, "/sensores")

    // Leituras de Sensores - Routes
    const leituras = require("../models/leituras")
    leituras.register(apiRouter, "/leituras")



}