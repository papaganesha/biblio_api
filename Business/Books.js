// CREATE NEW BOOK.✔️
// GET ALL BOOKS BY AVAILABILITY. ✔️
// GET ALL BOOKS BY PARAMS(BOOKNAME OR AUTHOR) ✔️

const { Op } = require('sequelize')
const BooksRepository = require("../Models/Books.js")
const sequelize  = require('../models/Connect.js')


BooksBusiness = {}


//CREATE BOOK: REQUIRED PARAMS(ISBN, NAME, AUTHOR, PUBLISHER, PUBLI_DATE, STOCK)
//RETURN STATUS AND NEW CREATED BOOK ISBN
BooksBusiness.createBookBusiness = async (isbn, name, author, publisher, publi_date, stock) => {
    //CHECK PARAMETERS
    if (isbn && name && author && publisher && publisher && publi_date && stock) {
        const transaction = await sequelize.transaction() 

        //CREATE VARIABLE TO CALL REPOSITORES
        let create
        try {
            //CREATE A NEW AUTHOR WITH THE REQUIRED PARAMETERS
            create = await BooksRepository.create({
                isbn,
                name,
                author,
                publisher,
                publi_date,
                stock
            }, { transaction })
            await transaction.commit()
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            await transaction.rollback()
            if (err.name == 'SequelizeUniqueConstraintError') {
                return { status: 400, msg: 'Book with this ISBN already exists' }
            } else if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Connection with DB error' }
            }

        }
        //console.log("1 - ",transaction)
        //IF THE INSERTION HAS OCCURRED
        return { status: 201, msg: { isbn: create.isbn } }
    }
    //MISSING PARAMETERS
    else {
        return { status: 400, msg: 'Missing parameters, try again' }
    }

}

//GET ALL AVAILABLE BOOKS
//RETURNING ONLY AVAILABLE BOOKS, WHERE STOCK IS GREATHER THAN 0
BooksBusiness.getAllBooksBusiness = async () => {
    //CREATE VARIABLE TO CALL REPOSITORES
    let books
    try {
        //GET ALL BOOKS WHERE STOCK IS GREATHER THAN 0
        books = await BooksRepository.findAll({
            where: {
                stock: {
                    [Op.gt]: 0
                },
                
            },
            order: [
                ['name', 'ASC'],
            ],
        })
    }
    //IN CASE OF ERROR
    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
    catch (err) {
        if (err.name == 'SequelizeConnectionRefusedError') {
            return { status: 400, msg: 'Connection with DB error' }
        } else {
            return { status: 400, msg: 'Error while getting books, try again' }
        }
    }

    //IF BOOKS ARE NULL OR INVALID
    if (books == null || books.length == 0) {
        return { status: 200, msg: "Not a single book registered" }
    }
    //RETURNING BOOKS
    else {
        return { status: 200, msg: books }
    }
}


//GET BOOKS BY AUTHOR NAME
//RETURN STATUS AND LIST OF BOOKS
BooksBusiness.getBooksByAuthorBusiness = async (authorName) => {
    //CHECK PARAMETERS
    if (authorName) {
        //CREATE VARIABLE TO CALL REPOSITORES
        let books
        try {
            //GET ALL BOOKS WHERE AUTHOR IS THE SAME AS THE PARAMETER RECEIVED AND STOCK IS GREATER THAN 0
            books = await BooksRepository.findAll({
                where: {
                    author: authorName,
                    stock: {
                        [Op.gt]: 0
                    }
                }
            })
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Connection with DB error' }
            } else {
                return { status: 400, msg: 'Error while getting books, try again' }
            }
        }

        //IF BOOKS ARE NULL OR INVALID
        if (books == null || books.length == 0) {
            return { status: 400, msg: 'Inexistent Books for this Author' }
        }
        //RETURNING BOOKS
        else {
            return { status: 200, msg: books }
        }
    }
    //MISSING PARAMETERS
    else {
        return { status: 400, msg: 'Missing parameters, try again' }
    }
}

//GET BOOKS BY BOOKNAME
//RETURN STATUS AND LIST OF BOOKS
BooksBusiness.getBooksByNameBusiness = async (bookName) => {
    //CHECK PARAMETERS
    if (bookName) {
        //CREATE VARIABLE TO CALL REPOSITORES
        let books
        try {
            //GET ALL BOOKS WHERE BOOKANME IS THE SAME AS THE PARAMETER RECEIVED AND STOCK IS GREATER THAN 0
            books = await BooksRepository.findAll({
                where: {
                    name: {
                        [Op.like]: `%${bookName}%`
                    },
                    stock: {
                        [Op.gt]: 0
                    }
                }
            })
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Connection with DB error' }
            } else {
                return { status: 400, msg: 'Error while getting books, try again' }
            }
        }

        //IF BOOKS ARE NULL OR INVALID
        if (books == null || books.length == 0) {
            return { status: 400, msg: 'Inexistent Books with this name' }
        }
        //RETURNING BOOKS
        else {
            return { status: 200, msg: books }
        }
    }
    //MISSING PARAMETERS
    else {
        return { status: 400, msg: 'Missing parameters, try again' }
    }
}

module.exports = BooksBusiness