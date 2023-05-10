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


module.exports = AuthorsBusiness