// CREATE NEW BOOK.✔️
// GET ALL BOOKS BY AVAILABILITY. ✔️
// GET ALL BOOKS BY PARAMS(BOOKNAME OR AUTHOR) ✔️

const { 
    getAllBooksBusiness,
    getBooksByAuthorBusiness,
    getBooksByNameBusiness,
    createBookBusiness,
    updateBookBusiness,
    deleteBookBusiness
 } = require('../Business/Books')

var Controller = {}

//CREATE A NEW BOOK
Controller.createBookController = async (req, res) => {
    const {isbn, name, author, publisher, publi_date, stock} = req.body
    let result = await createBookBusiness(isbn, name, author, publisher, publi_date, stock)
    res.status(result.status).json(result.msg)
}

//GET ALL THE AVAILABLE BOOKS
Controller.getAllBooksController = async (req, res) => {
    console.debug("BOOKS", req)
    let result = await getAllBooksBusiness()
    res.status(result.status).json(result.msg)
}


//GET ALL THE AVAILABLE BOOKS BY PARAMS(BOOKNAME OR AUTHOR)
Controller.getAllBooksByParamsController = async (req, res) => {
    const { author, name } = req.body
    let result
    console.log("=> ",author)
    if(author){
        result = await getBooksByAuthorBusiness(author)
    }
    if(name){
        result = await getBooksByNameBusiness(name)
    }
    res.status(result.status).json(result.msg)
}

//UPDATE BOOK BY BOOKNAME
Controller.updateBooksByNameController = async (req, res) => {
    const {regId} = req
    const {name, newName, author, publisher, publiDate, stock} = req.body
    console.log(regId, req.body)
    let result = await updateBookBusiness(regId, name, newName, author, publisher, publiDate, stock)
    res.status(result.status).json(result.msg)
}

//DELETE BOOK BY BOOKNAME OR ISBN
Controller.deleteBookController = async (req, res) => {
    const { isbn, bookName } = req.body
    console.log(req.body)
    result = await deleteBookBusiness(isbn, bookName)
    res.status(result.status).json(result.msg)
}

module.exports = Controller