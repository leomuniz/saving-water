const port = 8080

console.log("Environment: " + process.env.NODE_ENV);

const bodyParser = require("body-parser")
const express = require("express")
const server = express()
//const allowCors = require("./cors.js")

// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
server.use(bodyParser.json())

//server.use(allowCors)

server.listen(port, function(){
	console.log(`Backend is running on port ${port}`)
})

module.exports = server