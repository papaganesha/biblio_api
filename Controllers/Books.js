//Listar e buscar todos os clientes E cliente especifico por ID.✔️


const { 
    getAllBooksBusiness,
    getBooksByAuthorBusiness,
    getBooksByNameBusiness
 } = require('../Business/Books')

var Controller = {}

//GET ALL THE STUDENTS(BUSCA TODOS OS ESTUDANTES)
Controller.getAllBooksController = async (req, res) => {
    let allBooks = await getAllBooksBusiness()
    // console.log("=> ",allBooks)
    res.status(200).json(allBooks)
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