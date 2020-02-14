mongoose = require("mongoose")
sysvar = require("./sysvar")
mongoAddress = process.env.NODE_ENV == "dev" ? sysvar.devDB : sysvar.prodDB

module.exports = mongoose.connect(mongoAddress)

/*
dbURI = "mongodb://mongodb.bontec.kinghost.net/bontec01"
dbOptions = { 
	db: { native_parser: true }, 
	server: { poolSize: 5 }, 
	replset: { rs_name: 'myReplicaSetName' }, 
	user: '********',
	pass: '*********'
}

module.exports = mongoose.connect(dbURI,dbOptions)
*/
