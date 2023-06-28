const Router = require('express').Router()
const API_URL = process.env.API_URL

//AUTH MIDDLEWARE
const isAuth = require('../Middlewares/Auth')

const {
    createBookController,
    getAllBooksController,
    getAllBooksByParamsController,
    deleteBookController
} = require('../Controllers/Books')


const {
    createStudentController,
    getStudentByRegController,
    signInController,
    updateStudentByRegIdController,
    deleteStudentByRegIdController
} = require('../Controllers/Students')

const {
    createWithdrawalController,
    getAllWithdrawalsController,
    givebackController
} = require('../Controllers/Withdrawals')

const {
     createAuthorController, 
     getAllAuthorsController 
} = require('../Controllers/Authors')
const { deleteBookBusiness } = require('../Business/Books')


//============= STUDENTS ===================================================================================================
//CREATE NEW STUDENT
Router.post(`${API_URL}/students`, createStudentController)

//STUDENT AUTHENTICATION, RETURN JWT
Router.post(`${API_URL}/signin`, signInController)

//RETURN STUDENT INFO BY REGISTRATION NUMBER/REG_ID
Router.get(`${API_URL}/students`, isAuth, getStudentByRegController)

//REMOVE STUDENT BY REGISTRATION NUMBER
Router.put(`${API_URL}/students`, isAuth, updateStudentByRegIdController)

//REMOVE STUDENT BY REGISTRATION NUMBER
Router.delete(`${API_URL}/students`, isAuth, deleteStudentByRegIdController)
//============= STUDENTS ===================================================================================================


//============= BOOKS ======================================================================================================

//CREATE NEW BOOK, ISBN, NAME, AUTHOR, PUBLISHER, PUBLI_DATE, STOCK AS PARAMETER
Router.post(`${API_URL}/book`, isAuth, createBookController)

//RETURN ALL AVAILABLE BOOKS
Router.get(`${API_URL}/books`, isAuth, getAllBooksController)

//RETURN BOOKS BY PARAM, NAME OR AUTHOR
Router.post(`${API_URL}/books`, isAuth,getAllBooksByParamsController)

//DELETE BOOK BY ISBN OR BOOKNAME
Router.delete(`${API_URL}/books`, isAuth, deleteBookController)
//============= BOOKS ======================================================================================================


//============= AUTHORS ====================================================================================================
//CREATE NEW AUTHOR, NAME AND COUNTRY AS PARAMETERS
Router.post(`${API_URL}/authors`, createAuthorController)

//GET ALL AUTHORS
Router.get(`${API_URL}/authors`, getAllAuthorsController)
//============= AUTHORS ====================================================================================================



//============= WITHDRAWS AND GIVEBACK =====================================================================================
//WITHDRAW A BOOK, BOOKNAME AND REQ.REG_ID AS PARAMS
Router.post(`${API_URL}/withdraw`, isAuth, createWithdrawalController)

//GET ALL WITHDRAWS FOR AUTHENTICATED STUDENT
Router.get(`${API_URL}/withdraw`, isAuth, getAllWithdrawalsController)

//RETURN A BOOK, BOOKNAME AND REQ.REG_ID AS PARAMS
Router.post(`${API_URL}/giveback`, isAuth, givebackController)
//============= WITHDRAWS AND GIVEBACK =====================================================================================



module.exports = Router