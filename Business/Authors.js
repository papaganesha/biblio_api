const { Op } = require('sequelize')
const AuthorsRepository = require("../Models/Authors.js")


AuthorsBusiness = {}


AuthorsBusiness.createAuthorBusiness = async (name, country) => {
    const create = await AuthorsRepository.create({
        name,
        country,
    }).catch(err => {
            if(err.name == 'SequelizeUniqueConstraintError'){
            return { status: 400, msg: 'Author already exists'}
        }
    })

    return {status: 201, msg: create}
}

AuthorsBusiness.getAllAuthorsBusiness = async () => {
    const result = await AuthorsRepository.findAll()
    .catch(err => {
            return { status: 400, msg: err.name}
    })

    return {status: 200, msg: result}
}


module.exports = AuthorsBusiness