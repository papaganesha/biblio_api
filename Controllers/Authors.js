//Listar e buscar todos os clientes E cliente especifico por ID.✔️


const { 
    createAuthorBusiness,
} = require('../Business/Authors')


var Controller = {}


Controller.createAuthorController = async(req, res) => {
    const {name, country} = req.body
    let result = await createAuthorBusiness(name, country)
    res.status(result.status).json(result.msg)

}



module.exports = Controller