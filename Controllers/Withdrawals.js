// CREATE NEW WITHDRAW.✔️
// GET ALL WITHDRAWS FOR AUTHENTICATED STUDENT. ✔️
// GIVEBACK BOOK. ✔️

const {
    createWithdrawalBusiness,
    getAllWithdrawalsBusiness,
    givebackBusiness,
} = require('../Business/Withdrawals.js')

var Controller = {}

// CREATE NEW WITHDRAWAL: REQUIRED PARAMS(NAME, REGID)
Controller.createWithdrawalController = async (req, res) => {
    const { reg_id } = req
    const { name } = req.body
    let result = await createWithdrawalBusiness(name, reg_id)
    res.status(result.status).json(result.msg)
}

//GET ALL THE WITHDRAWALS FOR AUTHENTICATED STUDENT
Controller.getAllWithdrawalsController = async (req, res) => {
    const {reg_id} = req
    let result = await getAllWithdrawalsBusiness(reg_id)
    res.status(200).json(result)
}

// GIVEBACK BOOK: REQUIRED PARAMS(NAME, REGID)
Controller.givebackController = async (req, res) => {
    const { reg_id } = req
    const { name } = req.body
    let result = await givebackBusiness(name, reg_id)
    res.status(result.status).json(result.msg)
    
}


module.exports = Controller