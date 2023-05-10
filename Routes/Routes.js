const Router = require('express').Router();
const API_URL = process.env.API_URL

//AUTH MIDDLEWARE
const isAuth = require('../Middlewares/Auth')

const {
    getAllBooksController,
    getAllBooksByParamsController
} = require('../Controllers/Books')


const {
    createStudentController,
    getStudentByRegController,
    signInController
} = require('../Controllers/Students')

const {
    createWithdrawalController,
    getAllWithdrawalsController,
    givebackController
} = require('../Controllers/Withdrawals');

const {
     createAuthorController, 
     getAllAuthorsController 
} = require('../Controllers/Authors');

// RETURN ALL BOOKS
Router.get(`${API_URL}/books`, isAuth, getAllBooksController)

// RETURN BOOKS BY AUTHOR OR BOOK NAME
Router.post(`${API_URL}/books`, isAuth, getAllBooksByParamsController)


//RETURN STUDENT INFO BY REGISTRATION NUMBER/REG_ID
Router.get(`${API_URL}/students`, isAuth, getStudentByRegController)

//CREATE NEW STUDENT
Router.post(`${API_URL}/students`, createStudentController)

Router.post(`${API_URL}/withdraw`, isAuth, createWithdrawalController)

Router.get(`${API_URL}/withdraw`, isAuth, getAllWithdrawalsController)

Router.post(`${API_URL}/giveback`, isAuth, givebackController)

Router.post(`${API_URL}/signin`, signInController)


Router.get(`${API_URL}/authors`, isAuth, getAllAuthorsController)
Router.post(`${API_URL}/authors`, createAuthorController)

module.exports = Router