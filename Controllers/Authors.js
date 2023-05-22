// CREATE NEW AUTHOR.✔️
// GET ALL AUTHORS. ✔️

const { 
    createAuthorBusiness, 
    getAllAuthorsBusiness,
} = require('../Business/Authors')


var Controller = {}

//CREATE A NEW AUTHOR: REQUIRED PARAMS(NAME, COUNTRY)
Controller.createAuthorController = async(req, res) => {
    const {name, country} = req.body
    let result = await createAuthorBusiness(name, country)
    res.status(result.status).json(result.msg)
}


// RETURN ALL REGISTERED AUTHORS
Controller.getAllAuthorsController = async(req, res) => {
    let result = await getAllAuthorsBusiness()
    res.status(result.status).json(result.msg)
}



module.exports = Controller