const restful = require("node-restful")
const mongoose = restful.mongoose

const modulosSchema = new mongoose.Schema({
    apelido: { type:String, required:true, unique:true }, //ard01; ard02...
    tipo: { type:String, required:true, enum:["arduino"] },
    condominio: { type:String, required:true, index:true },
    sensores: { type:[String], required:false },
    createdAt: { type: Date, default: Date.now }
})

modelModulos = restful.model("Modulos", modulosSchema)
modelModulos.methods(['get', 'post', 'put', 'delete'])
modelModulos.updateOptions({ new: true, runValidators:true })

modelModulos.prefixo = { arduino: "ard" }

// auto increment funcion to generate id modulo
modelModulos.before("post", (req, res, next) => {
    modelModulos.findOne({},{ id:"id" },{ sort: { 'createdAt' : -1 } }, function(err, modulo) {
        var prefixo = modelModulos.prefixo[req.body.tipo]
        if (modulo) {
            modulo.id = modulo.id.replace(prefixo,"")
            req.body.id = prefixo + (modulo.id-0+1)
        } else {
            req.body.id = prefixo + "1"
        }
        next()
    })   
})

module.exports = modelModulos
