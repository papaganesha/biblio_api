const { Op } = require('sequelize')
const BooksRepository = require("../Models/Books.js")
const AuthorsRepository = require("../Models/Authors.js")


BooksBusiness = {}

//BooksBusiness.findAllStudents = async () => {}

BooksBusiness.createBookBusiness = async (name, password, phone) => {
    const create = await BooksRepository.create({
        name,
        password,
        phone
    }).catch(err => {
        return { msg: err.message.slice(18, err.message.length) }
    })

    return create
}

// RETURNING ONLY AVAILABLE BOOKS, WHERE STOCK IS GREATHER THAN 0
BooksBusiness.getAllBooksBusiness = async () => {
    const books = await BooksRepository.findAll({where:{
        stock:{
            [Op.gt]: 0
          }
    }})
    console.log("=> ", books)
    if (books == null || books.length == 0) {
        return "Not a single book registered"
    }
    else {
        return books
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