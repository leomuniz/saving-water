
var roles = {    
    admin: { all:["all"] },
    user:{ all:["get"], condominios:["post"] },
    condominio: { leituras:["post"] } // o token de condomínio só permite enviar leitura de sensor
}


module.exports = {
    
    verify: (role, model, method) => {
        if (roles.hasOwnProperty(role)) {
            if (roles[role].hasOwnProperty("all")) {
                if (roles[role].all.includes(method.toLowerCase()) || roles[role].all.includes("all")) {
                    return true;
                }
            } else if (roles[role].hasOwnProperty(model)) {
                if (roles[role][model].includes(method.toLowerCase()) || roles[role][model].includes("all")) {
                    return true;
                }
            }
        }

        return false
    }
}