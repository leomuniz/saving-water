const restful = require("node-restful")
const mongoose = restful.mongoose

const sensoresSchema = new mongoose.Schema({
    nome: { type:String, required:true },
    apelido: { type: String, required:true, lowercase:true },
    tipo: { type:String, required:true, enum:["pulso","ultrassonico","nivel","gas","fluxo"] },
    vazaoNominal: { type:Number, reqquired:false },
    vazaoMedia: { type: Number, required:false },
    valorAtual: { type:Number, required:true, default:0 },
    mediaDiaria: { type:Number, required:true, default:0 },
    media30dias: { type:Number, required:true, default:0 },
    ultimos30dias: { type:Number, required:true, default:0 }
})

const condominiosSchema = new mongoose.Schema({
    nome: { type:String, required:true },
    apelido: { type: String, required: true, lowercase:true, unique:true },
    endereco: { type:String, required: false },
    bairro: { type: String, required: false },
    cidade: { type: String, required: false, default:"Rio de Janeiro" },
    estado: { type: String, required: false, default:"RJ" },
    apartamentos: { type:Number, required:true, default:1 },
    andares: { type:Number, required:false, default:1 },
    sindico: { type:String, required:false },
    email: { type:String, required:false },
    telefone: { type:String, required:false },
    celular: { type:String, required: false },
    sensores: { type:[sensoresSchema], required:false },
    ativo: { type:Boolean, required:true, default:true },
    createdAt: { type: Date, default: Date.now }
})

model = restful.model("Condominios", condominiosSchema)
model.methods(['get', 'post', 'put', 'delete'])
model.updateOptions({ new: true, runValidators:true })

module.exports = model

// Condomínio
// *************************************
// nome: Edifício Alpoli
// apelido: alpoli (index, unique)
// endereço: Rua Humaitá, 109
// bairro: Humaitá
// cidade: Rio de Janeiro
// estado: RJ
// apartamentos: 63
// andares: 10
// sindico: Júlia Cerqueira
// email: juliacerqueira@gmail.com
// telefone: (21) 2555-2632
// celular: (21) 99555-2398
// sensores: [sensorSchema1, sensorSchema2]
// ativo: true (verifica se o condomínio está com o pagamento em dia)
// createdAt: data


// Sensor pulsado - dentro da collection 'condominios'; campo 'sensores'
// *************************************
// nome: Hidrometro Entrada
// apelido: hidr_entr
// tipo: pulso
// vazaoNominal: 166.7 (litros/minuto) (1 metro3/hora = 16,66667 litros/minutos) -- vazao declarada
// vazaoMedia: 143.2 (litros/minuto)
// valorAtual: 47839 (litros) -- número de pulsos recebidos desde o início
// mediaDiaria: 284 (pulsos = litros)
// media30dias: 3346 (pulsos = litros)
// ultimos30dias: 3542 (pulsos = litros)

// leitura pulsos
// id_sensor: alpoli_hidr_entr (apelidoCondominio_apelidoSensor) - (index)
// valor: 1 (litro - 1 pulso = 1 litro)
// datahora: 20/06/2017 19:10


// Sensor ultrassônico
// *************************************
// nome: cisterna
// apelido: cist
// tipo: ultrassonico
// vazaoNominal: null
// vazaoMedia: null
// valorAtual: 897 (litros) = 89,7%
// mediaDiaria: 64%
// media30dias: 67%
// ultimos30dias: 66% 

// leitura ultrassônico
// id_sensor: alpoli_cisterna (apelidoCondominio_apelidoSensor)
// valor: 689 (69%)
// datahora: 20/06/2017 19:10

// leitura ultrassônico
// id_sensor: alpoli_cisterna (apelidoCondominio_apelidoSensor)
// valor: 710 (71%)
// datahora: 20/06/2017 19:11

// sensor de nível, se necessário, pode ser igual ao sensor ultrassônico, passando somente 25%, 50%, 75%...


// Condomínios - Data do POSTMAN
// nome:Edifício Colorado
// apelido:colorado
// endereço:Rua Marquês de Abrantes, 158
// bairro:Flamengo
// cidade:Rio de Janeiro
// estado:RJ
// apartamentos:38
// andares:8
// sindico:Priscila
// email:priscila7andar@gmail.com
// telefone:(21) 2555-3453
// celular:(21) 99555-7676
// sensores[0][nome]:Hidrometro Entrada
// sensores[0][apelido]:hidr_entr
// sensores[0][tipo]:pulso
// sensores[0][valorAtual]:47343
// sensores[0][mediaDiaria]:321
// sensores[0][media30dias]:302
// sensores[0][ultimos30dias]:334
// sensores[1][nome]:Cisterna
// sensores[1][apelido]:cist
// sensores[1][tipo]:ultrassonico
// sensores[1][valorAtual]:67
// sensores[1][mediaDiaria]:56
// sensores[1][media30dias]:57
// sensores[1][ultimos30dias]:55