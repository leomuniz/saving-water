const restful = require("node-restful")
const jwt = require("jsonwebtoken")
const mongoose = restful.mongoose

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
    modulos: { type:[String], required:false }, // apelidos dos módulos (ard01; ard02...)
    ativo: { type:Boolean, required:true, default:true },
    createdAt: { type: Date, default: Date.now },
    token: { type: String, required:false, index:true } 
})

modelCond = restful.model("Condominios", condominiosSchema)
modelCond.methods(['get', 'post', 'put', 'delete'])
modelCond.updateOptions({ new: true, runValidators:true })

modelCond.generateToken = (req, res, next) => {
    var token = jwt.sign({ apelido: req.body.apelido, role: "condominio" }, sysvar.jwtSecret);
    req.body.token = token // para salvar o token correto no banco de dados (e nãoo token utilizado para criar o condomínio)
    next()
}

modelCond.before("post", modelCond.generateToken)
modelCond.before("put", modelCond.generateToken)

module.exports = modelCond

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