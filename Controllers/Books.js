//Listar e buscar todos os clientes E cliente especifico por ID.✔️


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
    // console.log("=> ",allBooks)
    res.status(result.status).json(result.msg)
}

//GET ALL THE STUDENTS(BUSCA TODOS OS ESTUDANTES)
Controller.getAllBooksController = async (req, res) => {
    let result = await getAllBooksBusiness()
    // console.log("=> ",allBooks)
    res.status(result.status).json(result.msg)
}


//GET ALL THE STUDENTS(BUSCA TODOS OS ESTUDANTES)
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
    res.status(200).json(result)
}

module.exports = Controller