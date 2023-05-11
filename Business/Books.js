const { Op } = require('sequelize')
const BooksRepository = require("../Models/Books.js")
const AuthorsRepository = require("../Models/Authors.js")


BooksBusiness = {}

//BooksBusiness.findAllStudents = async () => {}

BooksBusiness.createBookBusiness = async (isbn, name, author, publisher, publi_date, stock) => {
    const create = await BooksRepository.create({
        isbn,
        name,
        author,
        publisher,
        publi_date,
        stock
    }).catch(err => {
        //RETURN 1 CASE ISBN ALREADY REGISTERES
        //RETURN 2 ANY OTHER ERRO
        if(err.name == 'SequelizeUniqueConstraintError'){
            return {flag: 1, status: 400, msg: 'Book with this ISBN already exists'}
        }else if(err.name == 'SequelizeConnectionRefusedError'){
            return {flag: 2, status: 400, msg: 'Connection with DB error'}
        }
        
    })

    if(create.flag != null){
        if(create.flag == 1){
            return {status: create.status, msg: create.msg}
        }else{
            return {status: create.status, msg: create.msg}
        }
    }else{
        return {status: 201, msg: create.isbn}
    }
}

// RETURNING ONLY AVAILABLE BOOKS, WHERE STOCK IS GREATHER THAN 0
BooksBusiness.getAllBooksBusiness = async () => {
    const books = await BooksRepository.findAll({where:{
        stock:{
            [Op.gt]: 0
          }
    }}).catch(err => {
        if(err.name == 'SequelizeConnectionRefusedError'){
            return {status: 400, msg: 'Connection with DB error'}
        }else{
            return {status: 400, msg: err.message}
        }
        
    })
    console.log(books.length)
    if (books == null || books.length == 0) {
        return {status: 200, msg: "Not a single book registered"}
    }
    else if(books.status == 400){
        return {status: books.status, msg: books.msg}
    }
    else {
        return {status: 200, msg: books}
    }
}


BooksBusiness.getBooksByAuthorBusiness = async (authorName) => {
    const book = await BooksRepository.findAll({ where: { author: authorName } })
    if (book == null || book.length == 0) {
        return "Inexistent Books for this Author"
    }
    else {
        return book
    }
}

BooksBusiness.getBooksByNameBusiness = async (bookName) => {
    const book = await BooksRepository.findAll({
        where: {
            name:
                { [Op.like]: `%${bookName}%` }
        }
    })
    if (book == null || book.length == 0) {
        return "Inexistent Books with this name"
    }
    else {
        return book
    }
}

module.exports = BooksBusiness