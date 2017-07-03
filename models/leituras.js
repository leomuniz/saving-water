const restful = require("node-restful")
const mongoose = restful.mongoose

const leiturasSchema = new mongoose.Schema({
    id_sensor: { type:String, required:true, index:true },
    valor: { type:Number, required:true },
    datahora: { type:Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

model = restful.model("Leituras", leiturasSchema)
model.methods(['get', 'post', 'put', 'delete'])
model.updateOptions({ new: true, runValidators:true })


model.route('count', (req, res, next) => {
    model.count((error, value) => { // mongoose count method
        if (error) {
            res.status(500).json({ errors: [error] })
        } else {
            res.json({ value })
        }
    })
})

model.before('get', function (req, res, next) {

    next()
})

model.after('post', function (req, res, next) {
    // após o post é necessário atualizar os valores atuais dos sensores

    next(); // Don't forget to call next!
});

module.exports = model


// POSTMAN post format
// id_sensor:colorado_hidr_entr
// valor:1
// datahora: 2017-06-21T00:19:00.234Z  (ISO format)