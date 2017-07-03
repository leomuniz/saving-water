mongoose = require("mongoose")

module.exports = mongoose.connect("mongodb://localhost/vesi")

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