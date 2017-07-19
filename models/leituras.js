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

model.after('post', function (req, res, next) {
    // após o post é necessário atualizar os valores atuais dos sensores

    next(); // Don't forget to call next!
});

module.exports = model


// POSTMAN post format
// id_sensor:colorado_hidr_entr
// valor:1
// datahora: 2017-06-21T00:19:00.234Z  (ISO format)

// leitura pulsos
// id_sensor: alpoli_hidr_entr (apelidoCondominio_apelidoSensor) - (index)
// valor: 1 (litro - 1 pulso = 1 litro)
// datahora: 20/06/2017 19:10


// leitura ultrassônico
// id_sensor: alpoli_cisterna (apelidoCondominio_apelidoSensor)
// valor: 689 (69%)
// datahora: 20/06/2017 19:10


// leitura ultrassônico
// id_sensor: alpoli_cisterna (apelidoCondominio_apelidoSensor)
// valor: 710 (71%)
// datahora: 20/06/2017 19:11

// sensor de nível, se necessário, pode ser igual ao sensor ultrassônico, passando somente 25%, 50%, 75%...