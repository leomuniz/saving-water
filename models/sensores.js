const restful = require("node-restful")
const sysvar = require("../config/sysvar")
const mongoose = restful.mongoose

const sensoresSchema = new mongoose.Schema({
    nome: { type:String, required:true },
    apelido: { type: String, required:true, lowercase:true, unique: true },    
    tipo: { type:String, required:true, enum:["pulso","ultrassonico","nivel","gas","fluxo", "chave"] },
    vazaoNominal: { type:Number, required:false }, // vazao declarada - litros/minuto (1 metro3/hora = 16,66667 litros/minutos)
    vazaoMedia: { type: Number, required:false },
    valorAtual: { type:Number, required:true, default:0 },
    mediaDiaria: { type:Number, required:true, default:0 },
    media30dias: { type:Number, required:true, default:0 },
    ultimos30dias: { type:Number, required:true, default:0 },
    condominio: { type:String, required:true, index: true },
    modulo: { type:String, required:true, index:true }
})

modelSensores = restful.model("Sensores", sensoresSchema)
modelSensores.methods(['get', 'post', 'put', 'delete'])
modelSensores.updateOptions({ new: true, runValidators:true })

module.exports = modelSensores

// Sensor pulsado - dentro da collection 'condominios'; campo 'sensores'
// *************************************
// nome: Hidrometro Entrada
// id: alpoli_hidr_entr
// tipo: pulso
// vazaoNominal: 166.7 (litros/minuto) (1 metro3/hora = 16,66667 litros/minutos) -- vazao declarada
// vazaoMedia: 143.2 (litros/minuto)
// valorAtual: 47839 (litros) -- número de pulsos recebidos desde o início
// mediaDiaria: 284 (pulsos = litros)
// media30dias: 3346 (pulsos = litros)
// ultimos30dias: 3542 (pulsos = litros)

// leitura pulsos
// id_sensor: alpoli_hidr_entr
// valor: 1 (litro - 1 pulso = 1 litro)
// datahora: 20/06/2017 19:10


// Sensor ultrassônico
// *************************************
// nome: cisterna
// id: alpoli_cist
// tipo: ultrassonico
// vazaoNominal: null
// vazaoMedia: null
// valorAtual: 897 (litros) = 89,7%
// mediaDiaria: 64%
// media30dias: 67%
// ultimos30dias: 66% 

// leitura ultrassônico
// id_sensor: alpoli_cist 
// valor: 689 (69%)
// datahora: 20/06/2017 19:10

// leitura ultrassônico
// id_sensor: alpoli_cist
// valor: 710 (71%)
// datahora: 20/06/2017 19:11

// sensor de nível, se necessário, pode ser igual ao sensor ultrassônico, passando somente 25%, 50%, 75%...