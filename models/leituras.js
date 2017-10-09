const restful = require("node-restful")
const sensores = require("./sensores")
const mongoose = restful.mongoose
mongoose.Promise = Promise

const leiturasSchema = new mongoose.Schema({
    id_post: { type:String, required:true, index:true, unique:true },
    id_sensor: { type:String, required:true, index:true },
    valor: { type:Number, required:true },
    datahora: { type:Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

modelLeituras = restful.model("Leituras", leiturasSchema)
modelLeituras.methods(['get', 'post', 'put', 'delete'])
modelLeituras.updateOptions({ new: true, runValidators:true })

modelLeituras.route('count', (req, res, next) => {
    modelLeituras.count((error, value) => { // mongoose count method
        if (error) {
            res.status(500).json({ errors: [error] })
        } else {
            res.json({ value })
        }
    })
})

modelLeituras.before('post', function(req, res, next) {

    // impede a leitura de ser registrada novamente (não sei pq "unique" no model não está funcionando)
    modelLeituras.count({ 'id_post': req.body.id_post }, function (err, total) {
        if (err) return handleError(err);
        if (total > 0) {
            console.log("Leitura já registrada")
            res.setHeader('content-type', 'text/plain')
            res.send(req.body.queueFile) // arquivo de fila processado
            res.end() // termina requisição
        } else {
            next()
        }
    })    
})

modelLeituras.after('post', function (req, res, next) {
    // após o post é necessário atualizar os valores atuais dos sensores
    modelLeituras.atualizaSensor(req.body);

    res.setHeader('content-type', 'text/plain');
    res.locals.bundle = parseInt(req.body.queueFile)
    next(); // Don't forget to call next!
});



modelLeituras.atualizaSensor = (params) => { 
    buscaSensor = sensores.find({ 'apelido':params.id_sensor }).exec()
    
    calculos = [];
    calculos.push(buscaSensor.then(modelLeituras.mediaDiaria))
    calculos.push(buscaSensor.then(modelLeituras.media30dias))
    calculos.push(buscaSensor.then(modelLeituras.ultimos30dias))

    Promise.all(calculos).then(modelLeituras.salvaSensor)
}


modelLeituras.mediaDiaria = (sensor) => {
    console.log("Media diária: " + sensor[0].mediaDiaria)

    var today = new Date();
    today.setHours(0,0,0,0);

    // talvez seja interessante manter a média dos últimos 12 meses
    // ignorar datas mais antigas significa processamento mais rápido e ignorar comportamento que já tenha sido alterado
    // outra opção é dar menos peso para dias mais longe (+ difícil)
    calculaMediaDiaria = modelLeituras.aggregate([
        { $match: { id_sensor: sensor[0].apelido, datahora: { $lt: today }  } }, // filtra pelo id do sensor e ignora leituras do dia atual para não interferir no cálculo da média histórica
        { $group: { _id: { dia: { $dayOfMonth:"$datahora" }, mes:{ $month:"$datahora" }, ano:{ $year:"$datahora" } }, soma: { $sum: "$valor" } } }, // agrupa pelo dia, somando os valores
        { $group: { _id: null, dailyAvg: { $avg: "$soma" } } }  // calcula a média diária               
    ]).exec()

    // é preciso retornar outra promise para a promise original 
    // só terminar após a consulta ao bd com aggregate
    // ps.: todo then retorna uma promise
    return calculaMediaDiaria.then((result) => { 
        sensor[0].mediaDiaria = result[0].dailyAvg.toFixed(2)
        console.log("NOVA Media diária: " + sensor[0].mediaDiaria)
        return sensor
    })
}

modelLeituras.media30dias = (sensor) => {
    console.log("Media 30 dias: " + sensor[0].media30dias)

    var firstDayOfMonth = new Date();
    firstDayOfMonth.setHours(0,0,0,0);
    firstDayOfMonth.setDate(1); // primeiro dia do mês

    // talvez seja interessante ignorar meses mais antigos para agilizar cálculo e esquecer comportamento muito antigo
    calculaMediaMensal = modelLeituras.aggregate([
        { $match: { id_sensor: sensor[0].apelido, datahora: { $lt: firstDayOfMonth }  } }, // filtra pelo id do sensor e ignora o último mês
        { $group: { _id: { mes: { $month:"$datahora" }, ano:{ $year:"$datahora" } }, soma: { $sum: "$valor" } } }, // agrupa pelo mês, somando os valores
        { $group: { _id: null, monthlyAvg: { $avg: "$soma" } } }  // calcula a média mensal               
    ]).exec()

    return calculaMediaMensal.then((result) => { 
        sensor[0].media30dias = result[0].monthlyAvg.toFixed(2)
        console.log("NOVA Media 30 dias: " + sensor[0].media30dias)
        return sensor
    })
}

modelLeituras.ultimos30dias = (sensor) => {
    console.log("Ultimos 30 dias: " + sensor[0].ultimos30dias)

    var time = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
        
    calculaUltimos30dias = modelLeituras.aggregate([
        { $match: { id_sensor: sensor[0].apelido, datahora: {$gt: new Date(time)} } }, // filtra pelo id do sensor e pelos últimos 30 dias
        { $group: { _id: null, last30Days: { $sum: "$valor" } } }  // calcula a média mensal               
    ]).exec()

    return calculaUltimos30dias.then((result) => {
        sensor[0].ultimos30dias = result[0].last30Days.toFixed(2)
        console.log("NOVA Ultimos 30 dias: " + sensor[0].ultimos30dias)
        return sensor        
    })

}


modelLeituras.salvaSensor = (sensor) => {
    console.log("Terminou promises")
    sensor[0][0].save(function(err) { if (err) { console.log(err) } else { console.log('updated...') } });
}

module.exports = modelLeituras



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