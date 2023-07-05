// CREATE NEW BOOK.✔️
// GET ALL BOOKS BY AVAILABILITY. ✔️
// GET ALL BOOKS BY PARAMS(BOOKNAME OR AUTHOR) ✔️

const { Op } = require('sequelize')
const BooksRepository = require("../Models/Books.js")
const sequelize = require('../Models/Connect.js')


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
                return { status: 400, msg: 'Livro com este ISBN já existe' }
            } else if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Erro de conexão ao Banco' }
            }

        }
        //console.log("1 - ",transaction)
        //IF THE INSERTION HAS OCCURRED
        return { status: 201, msg: { isbn: create.isbn } }
    }
    //MISSING PARAMETERS
    else {
        return { status: 400, msg: 'Parametros insuficientes, tente novamente' }
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
            limit: 300,
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
            return { status: 400, msg: 'Erro de conexão ao Banco' }
        } else {
            return { status: 400, msg: 'Erro buscando Livros, tente novamente' }
        }
    }

    //IF BOOKS ARE NULL OR INVALID
    if (books == null || books.length == 0) {
        return { status: 200, msg: "Nenhum livro registrado" }
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
                return { status: 400, msg: 'Erro de conexão ao Banco' }
            } else {
                return { status: 400, msg: 'Erro buscando Livros, tente novamente' }
            }
        }

        //IF BOOKS ARE NULL OR INVALID
        if (books == null || books.length == 0) {
            return { status: 400, msg: 'Nenhum livro para este Autor' }
        }
        //RETURNING BOOKS
        else {
            return { status: 200, msg: books }
        }
    }
    //MISSING PARAMETERS
    else {
        return { status: 400, msg: 'Parametros insuficientes, tente novamente' }
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
                return { status: 400, msg: 'Erro de conexão ao Banco' }
            } else {
                return { status: 400, msg: 'Erro buscando Livros, tente novamente' }
            }
        }

        //IF BOOKS ARE NULL OR INVALID
        if (books == null || books.length == 0) {
            return { status: 400, msg: 'Livro com este nome não existe' }
        }
        //RETURNING BOOKS
        else {
            return { status: 200, msg: books }
        }
    }
    //MISSING PARAMETERS
    else {
        return { status: 400, msg: 'Parametros insuficientes, tente novamente' }
    }
}

//UPDATE BOOKS BY BOOKNAME
//RETURN MESSAGE
BooksBusiness.updateBookBusiness = async (regId, bookName, newBookName, author, publisher, publiDate, stock) => {
    //CHECK PARAMETERS
    if (regId || bookName || newBookName || author || publisher || publiDate || stock) {
        //CREATE VARIABLE TO CALL REPOSITORES
        let books
        let updateds = []
        let response = ""

        try {
            //GET ALL BOOKS WHERE BOOKANME IS THE SAME AS THE PARAMETER RECEIVED AND STOCK IS GREATER THAN 0
            books = await BooksRepository.findOne({
                where: {
                    name: bookName
                    }
                })
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Erro de conexão ao Banco' }
            } else {
                return { status: 400, msg: 'Erro buscando Livros, tente novamente' }
            }
        }

        //IF BOOKS ARE NULL OR INVALID
        if (books == null || books.length == 0) {
            return { status: 400, msg: 'Livro com este nome não existe' }
        }
        //UPDATING
        else {
            if(newBookName){
                const transaction = await sequelize.transaction()
                let updateName
                    try {
                        updateName = await BooksRepository.update(
                            {
                                name: newBookName,
                            },
                            { where: { name: bookName } },
                            { transaction }
                        )
                        await transaction.commit()
                    }
                    //IN CASE OF ERROR
                    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
                    catch (err) {
                        await transaction.rollback()
                        if (err.name == 'SequelizeConnectionRefusedError') {
                            return { status: 400, msg: 'Erro de conexão ao Banco' }
                        }
                        else {
                            return { status: 400, msg: 'Erro atualizando Livro, tente novamente' }
                        }
                    }
                    updateds.push('Nome')
            }
            if(author){
                const transaction = await sequelize.transaction()
                let updateAuthor
                    try {
                        updateAuthor = await BooksRepository.update(
                            {
                                author,
                            },
                            { where: { name: bookName } },
                            { transaction }
                        )
                        await transaction.commit()
                    }
                    //IN CASE OF ERROR
                    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
                    catch (err) {
                        await transaction.rollback()
                        if (err.name == 'SequelizeConnectionRefusedError') {
                            return { status: 400, msg: 'Erro de conexão ao Banco' }
                        }
                        else {
                            return { status: 400, msg: 'Erro atualizando Livro, tente novamente' }
                        }
                    }
                    updateds.push('Autor')
            }
            if(publisher){
                const transaction = await sequelize.transaction()
                let updatePublisher
                    try {
                        updatePublisher = await BooksRepository.update(
                            {
                                publisher: publisher,
                            },
                            { where: { name: bookName } },
                            { transaction }
                        )
                        await transaction.commit()
                    }
                    //IN CASE OF ERROR
                    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
                    catch (err) {
                        await transaction.rollback()
                        if (err.name == 'SequelizeConnectionRefusedError') {
                            return { status: 400, msg: 'Erro de conexão ao Banco' }
                        }
                        else {
                            return { status: 400, msg: 'Erro atualizando Livro, tente novamente' }
                        }
                    }
                    updateds.push('Editora')
            }
            if(publiDate){
                const transaction = await sequelize.transaction()
                let updatePubliDate
                    try {
                        updatePubliDate = await BooksRepository.update(
                            {
                                publi_date: publiDate,
                            },
                            { where: { name: bookName } },
                            { transaction }
                        )
                        await transaction.commit()
                    }
                    //IN CASE OF ERROR
                    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
                    catch (err) {
                        await transaction.rollback()
                        if (err.name == 'SequelizeConnectionRefusedError') {
                            return { status: 400, msg: 'Erro de conexão ao Banco' }
                        }
                        else {
                            return { status: 400, msg: 'Erro atualizando Livro, tente novamente' }
                        }
                    }
                    updateds.push('Data de Publicação')
            }
            if(stock){
                const transaction = await sequelize.transaction()
                let updateStock
                    try {
                         updateStock = await BooksRepository.update(
                            {
                                stock
                            },
                            { where: { name: bookName } },
                            { transaction }
                        )
                        await transaction.commit()
                    }
                    //IN CASE OF ERROR
                    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
                    catch (err) {
                        await transaction.rollback()
                        if (err.name == 'SequelizeConnectionRefusedError') {
                            return { status: 400, msg: 'Erro de conexão ao Banco' }
                        }
                        else {
                            return { status: 400, msg: 'Erro atualizando Livro, tente novamente' }
                        }
                    }
                    updateds.push('Estoque')
            }

            for(let i of updateds){
                response+= `${i}, `
            }

            
            console.log(response)
            let returnStr = response.slice(0, -2)

            return {status: 201, msg: `Para o Livro ${bookName} foram atualizados os seguintes campos: ${returnStr} `}
        }
    }
    //MISSING PARAMETERS
    else {
        return { status: 400, msg: 'Parametros insuficientes, tente novamente' }
    }
}


//DELETE BOOK BY IBSN OR BOOKNAME
BooksBusiness.deleteBookBusiness = async (isbn, bookName) => {
    //CHECK PARAMS
    if (isbn || bookName) {
        let getBook
        if (isbn) {
            try {
                getBook = await BooksRepository.findOne({
                    where: {
                        isbn: isbn
                    }
                })
            }
            //IN CASE OF ERROR
            //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
            catch (err) {
                if (err.name == 'SequelizeConnectionRefusedError') {
                    return { status: 400, msg: 'Erro de conexão ao Banco' }
                } else {
                    return { status: 400, msg: 'Erro buscando Livros, tente novamente' }
                }
            }

            console.log(getBook)
            if (getBook != null) {
                const transaction = await sequelize.transaction()
                let removeBook
                try {
                    removeBook = await BooksRepository.destroy({
                        where: {
                            isbn: isbn
                        },

                    },
                        { transaction })
                }
                //IN CASE OF ERROR
                //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
                catch (err) {
                    await transaction.rollback()

                    if (err.name == 'SequelizeConnectionRefusedError') {
                        return { status: 400, msg: 'Erro de conexão ao Banco' }
                    } else {
                        return { status: 400, msg: 'Erro buscando Livros, tente novamente' }
                    }
                }
                return { status: 201, msg: `${getBook.name} removido com sucesso` }
            } else {
                return { status: 400, msg: 'Livro Inexistente' }
            }

        }
        if (bookName) {
            try {
                //GET ALL BOOKS WHERE BOOKANME IS THE SAME AS THE PARAMETER RECEIVED AND STOCK IS GREATER THAN 0
                getBook = await BooksRepository.findOne({
                    where: {
                        name: bookName
                    }
                })
            }
            //IN CASE OF ERROR
            //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
            catch (err) {
                if (err.name == 'SequelizeConnectionRefusedError') {
                    return { status: 400, msg: 'Erro de conexão ao Banco' }
                } else {
                    return { status: 400, msg: 'Erro buscando Livros, tente novamente' }
                }
            }
            console.log(getBook)
            if (getBook != null) {
                const transaction = await sequelize.transaction()
                let removeBook
                try {
                    removeBook = await BooksRepository.destroy({
                        where: {
                            name: {
                                [Op.like]: `%${bookName}%`
                            }
                        }
                    }, { transaction })
                    await transaction.commit()
                }
                //IN CASE OF ERROR
                //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
                catch (err) {
                    await transaction.rollback()
                    if (err.name == 'SequelizeConnectionRefusedError') {
                        return { status: 400, msg: 'Erro de conexão ao Banco' }
                    } else {
                        return { status: 400, msg: 'Erro buscando Livros, tente novamente' }
                    }
                }
                return { status: 201, msg: `${bookName} removido com sucesso` }
            } else {
                return { status: 400, msg: 'Livro inexistente' }
            }

        }

    }
    //MISSING PARAMETERS
    else {
        return { status: 400, msg: 'Parametros insuficientes, tente novamente' }
    }
}

module.exports = BooksBusiness