const App = require('./App')
const Student = require("./Models/Students.js")
const Book = require("./Models/Books.js")
const Author = require("./Models/Authors.js")
const Withdrawal = require("./Models/Withdrawals.js")


console.log('\n=============================================== BiblioAPI ================================================')

//CREATE STUDENTS TABLE
Student

//CREATE BOOKS TABLE
Book

//CREATE AUTHORS TABLE
Author

//CREATE WITHDRAWALS TABLE
Withdrawal


App.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port 3000 ✔️`)
})
