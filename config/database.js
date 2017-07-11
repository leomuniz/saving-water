mongoose = require("mongoose")
mongoAddress = process.env.NODE_ENV == "dev" ? "mongodb://localhost/vesi" : "mongodb://127.0.0.1:27017/vesi"

module.exports = mongoose.connect(mongoAddress)

/*
dbURI = "mongodb://mongodb.bontec.kinghost.net/bontec01"
dbOptions = { 
	db: { native_parser: true }, 
	server: { poolSize: 5 }, 
	replset: { rs_name: 'myReplicaSetName' }, 
	user: 'bontec01',
	pass: '12B0nt3c34'
}

module.exports = mongoose.connect(dbURI,dbOptions)
*/