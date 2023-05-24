// CREATE NEW WITHDRAW.✔️
// GET ALL WITHDRAWS FOR AUTHENTICATED STUDENT. ✔️
// GIVEBACK BOOK. ✔️

const { Sequelize, Op } = require('sequelize')
const WithdrawalsRepository = require("../Models/Withdrawals.js")
const StudentsRepository = require("../Models/Students.js")
const BooksRepository = require("../Models/Books.js")
const { addWeeksToDate, daysBetween } = require("../Services/Date.js")

const sequelize  = require('../models/Connect.js')


WithdrawalsBusiness = {}


//CREATE A NEW WITHDRAW: REQUIRED PARAMS(BOOKNAME, REGID)
//CHECK IF BOOK WITH BOOKNAME EXISTS AND HAS STOCK
//CHECK IF STUDENT CAN WITHDRAW
//CHECK IF STUDENT DOENST HAVE ANY OPEN WITHDRAWS FOR THE REQUIRED BOOK
//REGISTER WITHDRAW
//RETURN STATUS AND MESSAGES
WithdrawalsBusiness.createWithdrawalBusiness = async (bookName, regId) => {
    //CHECK PARAMETERS
    if (bookName && regId) {
        //CREATE VARIABLE TO CALL REPOSITORES
        let book
        try {
            //GET ONE BOOK WHERE BOOK.NAME = BOOKNAME REQUIRED PARAMETER
            book = await BooksRepository.findOne({ where: { name: bookName } }) 
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Connection with DB error' }
            }
            else {
                return { status: 400, msg: 'Error while searching Book, try again' }
            }
        }
        // CASE BOOK DOENST EXISTS
        if (book == null || book.length == 0) {
            return { status: 400, msg: "Inexistent book" }
        }
        else {
            // CASE BOOK DOENTS HAVE STOCK
            if (book.stock == 0) {
                return { status: 400, msg: "Unavailable book" }
            }
        }

        //CHECK IF STUDENT DOESNT HAVE ANY WITHDRAWS FOR THIS BOOK
        //CREATE VARIABLE TO CALL REPOSITORES
        let withdrawal
        try {
            //GET WITHDRAWS WHERE STUDENT_REG = REGID AND BOOK_ISBN = BOOK.ISBN
            withdrawal = await WithdrawalsRepository.findOne({
                where: {
                    student_reg: regId,
                    book_isbn: book.isbn,
                    giveback_date:{ [Op.eq]: null}
                }
            })
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Connection with DB error' }
            }
            else {
                return { status: 400, msg: 'Error while searching Withdraws, try again' }
            }
        }

        //IN CASE STUDENT ALREADY HAS WITHDRAW FOR THIS BOOK
        if (withdrawal != null) {
            return { status: 400, msg: "Student cant withdraw the same book twice." }
        }

        //CHECK FOR STUDENT WITHDRAWALS NBR
        //CREATE VARIABLE TO CALL REPOSITORES
        let student
        try {
            student = await StudentsRepository.findOne({ where: { reg_id: regId } })
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Connection with DB error' }
            }
            else {
                return { status: 400, msg: 'Error while searching Student info, try again' }
            }
        }

        if (student.withdraw > 0 && student.withdraw >= 3) {
            return { status: 400, msg: "Student cant withdraw no more" }
        } else {
            const transaction = await sequelize.transaction() 

            //CREATE NEW WITHDRAWAL
            //CREATE VARIABLE TO CALL REPOSITORES
            let create
            try {
                create = await WithdrawalsRepository.create({
                    book_isbn: book.isbn,
                    student_reg: student.reg_id,
                    start_date: new Date().toISOString(),
                    return_date: addWeeksToDate(new Date(), 1).toISOString()
                })
                await transaction.commit()
            }
            //IN CASE OF ERROR
            //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
            catch (err) {
                await transaction2.rollback()
                if (err.name == 'SequelizeConnectionRefusedError') {
                    return { status: 400, msg: 'Connection with DB error' }
                }
                else {
                    return { status: 400, msg: 'Error while creating Withdrawal, try again' }
                }
            }


            console.log(`=> ${new Date().toISOString()} => ${addWeeksToDate(new Date(), 1).toISOString()}`)

            console.log(`=> create => ${create.affectedRows}`)
            
            
            const transaction2 = await sequelize.transaction() 

            //REMOVE STOCK FROM BOOK
            let newStock = book.stock - 1
            //CREATE VARIABLE TO CALL REPOSITORES
            let updateBook
            try {
                updateBook = await BooksRepository.update(
                    { stock: newStock },
                    { where: { isbn: book.isbn } }, { transaction2 }
                )
                await transaction2.commit()
            }
            //IN CASE OF ERROR
            //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
            catch (err) {
                await transaction2.rollback()
                if (err.name == 'SequelizeConnectionRefusedError') {
                    return { status: 400, msg: 'Connection with DB error' }
                }
                else {
                    return { status: 400, msg: 'Error while updating Book, try again' }
                }
            }

            const transaction3 = await sequelize.transaction() 

            //ADD WITHDRAW TO STUDENT
            let newWithDraw = student.withdraw + 1
            //CREATE VARIABLE TO CALL REPOSITORES
            let updateStudent
            try {
                updateStudent = await StudentsRepository.update(
                    { withdraw: newWithDraw },
                    { where: { reg_id: student.reg_id } }, { transaction3 }
                )
                await transaction3.commit()
            }
            //IN CASE OF ERROR
            //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
            catch (err) {
                await transaction3.rollback()
                if (err.name == 'SequelizeConnectionRefusedError') {
                    return { status: 400, msg: 'Connection with DB error' }
                }
                else {
                    return { status: 400, msg: 'Error while updating Student, try again' }
                }
            }

            //NEED TO CHECK IF ONE OF THOSE IS NOT GOOD, WHAT TO DO?
            if (updateBook && updateStudent) {
                return { status: 201, msg: "Withdrawal registered" }
            }

        }

    }
    //MISSING PARAMETERS
    else {
        return { status: 400, msg: 'Missing parameters, try again' }
    }

}

WithdrawalsBusiness.getAllWithdrawalsBusiness = async (reg_id) => {
    let withdrawals
    try {
        withdrawals = await WithdrawalsRepository.findAll({ where: { student_reg: reg_id } })
    }
    catch (err) {
        if (err.name == 'SequelizeConnectionRefusedError') {
            return { status: 400, msg: 'Connection with DB error' }
        }
        else {
            return { status: 400, msg: 'Error while getting Withdraws, try again' }
        }
    }

    if (withdrawals == null || withdrawals.length == 0) {
        return { status: 400, msg: "Not a single withdrawal registered" }
    }
    else {
        return { status: 400, msg: withdrawals }
    }
}




// RETURNS A BOOK: REQUIRED PARAMS(BOOKS.BOOK_NAME, STUDENTS.REG_ID)
// DONT NEED CHECK IF USER EXISTS, BECAUSE OF AUTH
// GET USER OBJECT WITH STUDENTS.REG_ID AND EXTRACT WITHDRAW VALUE
// FIND BOOKS.ISBN AND BOOKS.STOCK WITH BOOKNAME
// DO CHECKS ON STOCK AND WITHDRAW NUMBERS
// GET WITHDRAW ROW WITH ISBN AND REG_ID
// CREATE NOW DATE
// COMPARE WITHDRAW.RETURN_DATE WITH NOW DATE, TO CALCULATE LATE DAYS
// UPDATE WITHDRAWS, STUDENT AND BOOKS
// RETURN STATUS AND MESSAGES
WithdrawalsBusiness.givebackBusiness = async (bookName, regId) => {
    //CHECK STUDENT
    //CREATE VARIABLE TO CALL REPOSITORES
    let student
    try {
        //GET STUDENT WHERE STUDENT.REG_ID = REGID
        student = await StudentsRepository.findOne({
            where: {
                reg_id: regId,
            }
        })
    }
    //IN CASE OF ERROR
    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
    catch (err) {
        if (err.name == 'SequelizeConnectionRefusedError') {
            return { status: 400, msg: 'Connection with DB error' }
        }
        else {
            return { status: 400, msg: 'Error while getting Student, try again' }
        }
    }

    

    //CHECK IF BOOK EXISTS
    //CREATE VARIABLE TO CALL REPOSITORES
    let book
    try {
        book = await BooksRepository.findOne({
            where: {
                name: bookName,
            }
        })
    }
    //IN CASE OF ERROR
    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
    catch (err) {
        if (err.name == 'SequelizeConnectionRefusedError') {
            return { status: 400, msg: 'Connection with DB error' }
        }
        else {
            return { status: 400, msg: 'Error while getting Book, try again' }
        }
    }

    if (book == null || book.length == 0) {
        return { status: 400, msg: 'Inexistent book' }
    }

    //CREATE VARIABLE TO CALL REPOSITORES
    let withdrawal
    try {
        withdrawal = await WithdrawalsRepository.findOne({
            where: {
                student_reg: regId,
                book_isbn: book.isbn,
                giveback_date:{ [Op.eq]: null}
            }
        })
    }
    //IN CASE OF ERROR
    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
    catch (err) {
        if (err.name == 'SequelizeConnectionRefusedError') {
            return { status: 400, msg: 'Connection with DB error' }
        }
        else {
            return { status: 400, msg: 'Error while getting Withdrawal, try again' }
        }
    }


    //CHECK IF STUDENT DONT HAVE ANY WITHDRAWS FOR THIS BOOK
    if (withdrawal == null || withdrawal.length == 0) {
        return { status: 400, msg: "Not a single withdrawal registered for this book" }
    }

    if (withdrawal.giveback_date == null) {
        //CALCULATE DIFF BETWEEN RETURN_DATE AND GIVEBACK_DATE
        let now = new Date().toISOString()
        let diference = daysBetween(withdrawal.return_date, now)
        console.log("==> ", parseInt(diference))
        if (diference > 0) {
            const transaction = await sequelize.transaction() 

            //CREATE VARIABLE TO CALL REPOSITORES
            let updateWithdrawal
            try {
                updateWithdrawal = await WithdrawalsRepository.update(
                    { giveback_date: now, late: parseInt(diference), done: 1 },
                    { where: { book_isbn: book.isbn } }
                )
                transaction.commit()
            }
            //IN CASE OF ERROR
            //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
            catch (err) {
                transaction.rollback()
                if (err.name == 'SequelizeConnectionRefusedError') {
                    return { status: 400, msg: 'Connection with DB error' }
                }
                else {
                    return { status: 400, msg: 'Error while updating Withdrawal, try again' }
                }
            }

            const transaction2 = await sequelize.transaction() 
            //CREATE VARIABLE TO CALL REPOSITORES
            let updateStudent
            try {
                updateStudent = await StudentsRepository.update(
                    { withdraw: student.withdraw - 1 },
                    { where: { reg_id: student.reg_id } }
                )
                transaction2.commit()
            }
            //IN CASE OF ERROR
            //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
            catch (err) {
                transaction2.commit()
                if (err.name == 'SequelizeConnectionRefusedError') {
                    return { status: 400, msg: 'Connection with DB error' }
                }
                else {
                    return { status: 400, msg: 'Error while updating Student, try again' }
                }
            }

            const transaction3 = await sequelize.transaction() 
            //CREATE VARIABLE TO CALL REPOSITORES
            let updateBook
            try {
                updateBook = await BooksRepository.update(
                    { stock: book.stock + 1 },
                    { where: { isbn: book.isbn } }
                )
                transaction3.commit()
            }
            //IN CASE OF ERROR
            //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
            catch (err) {
                transaction2.commit()
                if (err.name == 'SequelizeConnectionRefusedError') {
                    return { status: 400, msg: 'Connection with DB error' }
                }
                else {
                    return { status: 400, msg: 'Error while updating Book, try again' }
                }
            }
            //NEED TO CHECK IF ONE OF THOSE IS NOT GOOD, WHAT TO DO?
            if (updateWithdrawal && updateBook && updateStudent) {
                return { status: 201, msg: `Book returned with ${diference} late` }
            }
        }

        else {
            const transaction = await sequelize.transaction() 

            //CREATE VARIABLE TO CALL REPOSITORES
            let updateWithdrawal
            try {
                updateWithdrawal = await WithdrawalsRepository.update(
                    { giveback_date: now, late: 0, done: 1 },
                    { where: { book_isbn: book.isbn } }
                )
                transaction.commit()
            }
            //IN CASE OF ERROR
            //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
            catch (err) {
                transaction.rollback()
                if (err.name == 'SequelizeConnectionRefusedError') {
                    return { status: 400, msg: 'Connection with DB error' }
                }
                else {
                    return { status: 400, msg: 'Error while updating Withdrawal, try again' }
                }
            }

            const transaction2 = await sequelize.transaction() 
            //CREATE VARIABLE TO CALL REPOSITORES
            let updateStudent
            try {
                updateStudent = await StudentsRepository.update(
                    { withdraw: student.withdraw - 1 },
                    { where: { reg_id: student.reg_id } }
                )
                transaction2.commit()
            }
            //IN CASE OF ERROR
            //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
            catch (err) {
                transaction2.commit()
                if (err.name == 'SequelizeConnectionRefusedError') {
                    return { status: 400, msg: 'Connection with DB error' }
                }
                else {
                    return { status: 400, msg: 'Error while updating Student, try again' }
                }
            }

            const transaction3 = await sequelize.transaction() 
            //CREATE VARIABLE TO CALL REPOSITORES
            let updateBook
            try {
                updateBook = await BooksRepository.update(
                    { stock: book.stock + 1 },
                    { where: { isbn: book.isbn } }
                )
                transaction3.commit()
            }
            //IN CASE OF ERROR
            //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
            catch (err) {
                transaction3.rollback()
                if (err.name == 'SequelizeConnectionRefusedError') {
                    return { status: 400, msg: 'Connection with DB error' }
                }
                else {
                    return { status: 400, msg: 'Error while updating Book, try again' }
                }
            }

            //NEED TO CHECK IF ONE OF THOSE IS NOT GOOD, WHAT TO DO?
            if (updateWithdrawal && updateBook && updateStudent) {
                return { status: 201, msg: "Giveback registered" }
            }
        }
    }
    //IN CASE STUDENT ALREADY RETURNED THIS BOOK
    else {
        return { status: 201, msg: 'Already returned book' }
    }
}




module.exports = WithdrawalsBusiness