// FUNCTIONS
// CREATE NEW WITHDRAWAL, WITH BOOK NAME AND REG_ID. 
// REMOVE WITHDRAWAL BY WITHDRAWAL_ID OR STUDENT REG_ID.

const { Sequelize, Op } = require('sequelize')
const WithdrawalsRepository = require("../Models/Withdrawals.js")
const StudentsRepository = require("../Models/Students.js")
const BooksRepository = require("../Models/Books.js")
const { addWeeksToDate, daysBetween } = require("../Services/Date.js")


WithdrawalsBusiness = {}


WithdrawalsBusiness.createWithdrawalBusiness = async (bookName, regId) => {
    //CHECK FOR BOOK STOCK
    const book = await BooksRepository.findOne({ where: { name: bookName } })
        .catch(err => {
            console.log(err.message.slice(18, err.message.length))
        })



    // CASE BOOK DOENST EXISTS
    if (book == null || book.length == 0) {
        return { msg: "Inexistent book" }
    } else {
        // CASE BOOK DOENTS HAVE STOCK
        if (book.stock == 0) {
            return { msg: "Unavailable book" }
        }
    }

    //CHECK FOR STUDENT WITHDRAWALS NBR
    const student = await StudentsRepository.findOne({ where: { reg_id: regId } })
        .catch(err => {
            return { msg: err.message.slice(18, err.message.length) }
        })


    //console.log(book)
    if (student == null || student.length == 0) {
        return { msg: "Inexistent student" }
    } else {
        if (student.withdraw > 0 && student.withdraw >= 3) {
            return { msg: "Student cant withdraw no more" }
        } else {
            //CREATE NEW WITHDRAWAL
            const create = await WithdrawalsRepository.create({
                book_isbn: book.isbn,
                student_reg: student.reg_id,
                start_date: new Date().toISOString(),
                return_date: addWeeksToDate(new Date(), 1).toISOString()
            }).catch(err => {
                //console.log(err.message.slice(18, err.message.length))
                return { msg: err.message.slice(18, err.message.length) }
            })


            console.log(`=> ${new Date().toISOString()} => ${addWeeksToDate(new Date(), 1).toISOString()}`)

            console.log(`=> create => ${create.affectedRows}`)
            //REMOVE STOCK FROM BOOK
            let newStock = book.stock - 1
            const updateBook = await BooksRepository.update(
                { stock: newStock },
                { where: { isbn: book.isbn } }
            ).catch(err => {
                console.log(err.message.slice(18, err.message.length))
                return { msg: err.message.slice(18, err.message.length) }
            })


            //ADD WITHDRAW TO STUDENT
            let newWithDraw = student.withdraw + 1
            const updateStudent = await StudentsRepository.update(
                { withdraw: newWithDraw },
                { where: { reg_id: student.reg_id } }
            ).catch(err => {
                console.log(err.message.slice(18, err.message.length))
                return { msg: err.message.slice(18, err.message.length) }
            })

            if (updateBook && updateStudent) {
                return { msg: "Withdrawal registered" }
            }

        }
    }

}

WithdrawalsBusiness.getAllWithdrawalsBusiness = async (reg_id) => {
    const withdrawals = await WithdrawalsRepository.findAll({where:{student_reg: reg_id}});
    if (withdrawals == null || withdrawals.length == 0) {
        return "Not a single withdrawal registered"
    }
    else {
        return withdrawals
    }
}


// WithdrawalsBusiness.getAllWithdrawalsByIdBusiness = async () => {
//     const withdrawals = await WithdrawalsRepository.findAll();
//     if (withdrawals == null || withdrawals.length == 0) {
//         // return "Not a single withdrawal registered"
//         return 
//     }
//     else {
//         return withdrawals
//     }
// }

// WithdrawalsBusiness.getAllWithdrawalsByIdBusiness = async (withdrawal_id) => {
//     const withdrawals = await WithdrawalsRepository.findAll({
//         where: {
//             withdrawal_id: withdrawal_id,
//         }
//     })

//     if (withdrawals == null || withdrawals.length == 0) {
//         return "Inexistent withdrawal"
//     }
//     else {
//         return withdrawals
//     }
// }

// WithdrawalsBusiness.getAllWithdrawalsByRegIdBusiness = async (student_reg) => {
//     // CHECK STUDENT
//     const student = await StudentsRepository.findOne({
//         where: {
//             reg_id: student_reg,
//         }
//     }).catch(err => {
//         return {msg: err.message.slice(18, err.message.length)}
//     })

//     if(student == null){
//         return {msg :"Inexistent student"}
//     }
//     const withdrawals = await WithdrawalsRepository.findAll({
//         where: {
//             student_reg: student_reg,
//         }
//     })

//     if (withdrawals == null || withdrawals.length == 0) {
//         return "Not a single withdrawal registered for this student"
//     }
//     else {
//         return withdrawals
//     }
// }


// RETURN A BOOK
// PARAMS: BOOKS.BOOK_NAME, STUDENTS.REG_ID
// DONT NEED CHECK IF USER EXISTS, BECAUSE OF AUTH
// GET USER OBJECT WITH STUDENTS.REG_ID AND EXTRACT WITHDRAW VALUE
// FIND BOOKS.ISBN AND BOOKS.STOCK WITH BOOKNAME
// DO CHECKS ON STOCK AND WITHDRAW NUMBERS
// GET WITHDRAW ROW WITH ISBN AND REG_ID
// CREATE NOW DATE
// COMPARE WITHDRAW.RETURN_DATE WITH NOW DATE, TO CALCULATE LATE DAYS
// ERRORS: IF USER HAS 2 WITHDRAWS OF THE SAME BOOK, WHEN HE DOES GIVEBACK, BOTH ARE FINISHED
// ERRORS: IF USER HAS 2 WITHDRAWS OF THE SAME BOOK, ONE ALREADY FINISHED, WHEN HE DOES GIVEBACK, CANT VERIFY WHAT ROW TO REDEFINE
WithdrawalsBusiness.givebackBusiness = async (bookName, reg_id) => {
    // CHECK STUDENT
    const student = await StudentsRepository.findOne({
        where: {
            reg_id: reg_id,
        }
    }).catch(err => {
        return { status:400, msg: err.message.slice(18, err.message.length) }
    })


        //CHECK IF BOOK EXISTS
        const book = await BooksRepository.findOne({
            where: {
                name: bookName,
            }
        }).catch(err => {
            return { status:400, msg: err.message.slice(18, err.message.length) }
        })

        if (book == null) {
            return { status:400, msg: 'Inexistent book' }
        }
        else {
            const withdrawals = await WithdrawalsRepository.findAll({
                where: {
                    student_reg: reg_id,
                    book_isbn: book.isbn,
                    giveback_date: null
                }
            }).catch(err => {
                return { status:400, msg: err.message.slice(18, err.message.length) }
            })

            //console.log("==> ", withdrawal)

            if (withdrawals == null || withdrawals.length == 0) {
                return {status: 400, msg: "Not a single withdrawal registered for this student"}
            }
            else {
                // console.log(withdrawal.giveback_date)
                // if(withdrawal.giveback_date == null && withdrawal.done == 0) {
                //     //CALCULATE DIFF BETWEEN RETURN_DATE AND GIVEBACK_DATE
                // let now = new Date().toISOString()
                // let diference = daysBetween(withdrawal.return_date, now)
                // console.log("==> ", parseInt(diference))
                // if (diference > 0) {
                //     const updateWithdrawal = await WithdrawalsRepository.update(
                //         { giveback_date: now, late: parseInt(diference), done: 1  },
                //         { where: { book_isbn: book.isbn } }
                //     ).catch(err => {
                //         console.log(err.message.slice(18, err.message.length))
                //         return { status: 400, msg: err.message.slice(18, err.message.length) }
                //     })

                //     const updateStudent = await StudentsRepository.update(
                //         { withdraw: student.withdraw - 1},
                //         { where: { reg_id: student.reg_id } }
                //     ).catch(err => {
                //         console.log(err.message.slice(18, err.message.length))
                //         return { status: 400, msg: err.message.slice(18, err.message.length) }
                //     })

                //     const updateBook = await BooksRepository.update(
                //         { stock: book.stock + 1},
                //         { where: { isbn: book.isbn } }
                //     ).catch(err => {
                //         console.log(err.message.slice(18, err.message.length))
                //         return { msg: err.message.slice(18, err.message.length) }
                //     })

                //     return { status:201, msg: `Book returned with ${diference} late` }
                // }
                // else {
                //     const updateWithdrawal = await WithdrawalsRepository.update(
                //         { giveback_date: now, late: 0, done: 1 },
                //         { where: { book_isbn: book.isbn } }
                //     ).catch(err => {
                //         console.log(err.message.slice(18, err.message.length))
                //         return { status:400,  msg: err.message.slice(18, err.message.length) }
                //     })

                //     const updateStudent = await StudentsRepository.update(
                //         { withdraw: student.withdraw - 1},
                //         { where: { reg_id: student.reg_id } }
                //     ).catch(err => {
                //         console.log(err.message.slice(18, err.message.length))
                //         return { status:400, msg: err.message.slice(18, err.message.length) }
                //     })

                //     const updateBook = await BooksRepository.update(
                //         { stock: book.stock + 1},
                //         { where: { isbn: book.isbn } }
                //     ).catch(err => {
                //         console.log(err.message.slice(18, err.message.length))
                //         return { status:400, msg: err.message.slice(18, err.message.length) }
                //     })
                    
                //     return { status:201, msg: 'Book returned with no late' }
                // }
                // }
                // else{
                //     return { status:201, msg: 'Already returned book' }
                // }   
                return{status: 200, msg: withdrawals}
            }
    }

}




module.exports = WithdrawalsBusiness