//Listar e buscar todos os clientes E cliente especifico por ID.✔️


const { 
    createAuthorBusiness, 
    getAllAuthorsBusiness,
} = require('../Business/Authors')


var Controller = {}


Controller.createAuthorController = async(req, res) => {
    const {name, country} = req.body
    let result = await createAuthorBusiness(name, country)
    res.status(result.status).json(result.msg)

}

Controller.getAllAuthorsController = async(req, res) => {
    let result = await getAllAuthorsBusiness()
    res.status(result.status).json(result.msg)

}



module.exports = Controller