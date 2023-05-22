// CREATE NEW BOOK.✔️
// GET ALL BOOKS BY AVAILABILITY. ✔️
// GET ALL BOOKS BY PARAMS(BOOKNAME OR AUTHOR) ✔️

const { 
    getAllBooksBusiness,
    getBooksByAuthorBusiness,
    getBooksByNameBusiness,
    createBookBusiness
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
    let result = await getAllBooksBusiness()
    res.status(result.status).json(result.msg)
}


//GET ALL THE AVAILABLE BOOKS BY PARAMS(BOOKNAME OR AUTHOR)
Controller.getAllBooksByParamsController = async (req, res) => {
    const { author, name} = req.body
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

module.exports = Controller