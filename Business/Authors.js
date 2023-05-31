// CREATE NEW AUTHOR.✔️
// GET ALL AUTHORS. ✔️


const { Op } = require('sequelize')
const AuthorsRepository = require("../Models/Authors.js")
const sequelize  = require('../models/Connect.js')

AuthorsBusiness = {}

//CREATE AUTHOR: REQUIRED PARAMS(NAME, COUNTRY) 
AuthorsBusiness.createAuthorBusiness = async (name, country) => {
    const transaction = await sequelize.transaction() 
    //CREATE VARIABLE TO CALL REPOSITORES
    let create
    try {
        //CREATE A NEW AUTHOR WITH THE REQUIRED PARAMETERS
        create = await AuthorsRepository.create({
            name,
            country,
        }, { transaction })
        await transaction.commit()
    }
    //IN CASE OF ERROR
    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
    catch (err) {
        console.log("2 -- ", transaction)
        await transaction.rollback()
        if (err.name == 'SequelizeUniqueConstraintError') {
            return { status: 400, msg: 'Author already exists' }
        } else if (err.name == 'SequelizeConnectionRefusedError') {
            return { status: 400, msg: 'Connection with DB error' }
        }
        else {
            return { status: 400, msg: 'Error while creating Author, try again' }
        }
    }
    console.log("1 -- ", transaction)
    //IF THE INSERTION HAS OCCURRED
    return { status: 201, msg: {name: create.name} }
}

AuthorsBusiness.getAllAuthorsBusiness = async () => {
    //CREATE VARIABLE TO CALL REPOSITORES
    let authors
    try {
        //GET ALL AUTHORS
        authors = await AuthorsRepository.findAll()
    }
    //IN CASE OF ERROR
    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
    catch (err) {
        if (err.name == 'SequelizeConnectionRefusedError') {
            return { status: 400, msg: 'Connection with DB error' }
        }
        else {
            return { status: 400, msg: 'Error while getting Authors, try again' }
        }
    }

    //IF AUTHORS ARE NULL OR INVALID
    if (authors == null || authors.length == 0) {
        return { status: 200, msg: 'Not a single author with registered' }
    } 
    //RETURNING AUTHORS
    else {
        return { status: 200, msg: authors }
    }
}


module.exports = AuthorsBusiness