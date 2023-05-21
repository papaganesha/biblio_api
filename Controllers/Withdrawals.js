//Listar e buscar todos os clientes E cliente especifico por ID.✔️


const {
    createWithdrawalBusiness,
    getAllWithdrawalsBusiness,
    givebackBusiness,
} = require('../Business/Withdrawals.js')

var Controller = {}

// CREATE NEW WITHDRAWAL (CRIAR NOVA RESERVA)
Controller.createWithdrawalController = async (req, res) => {
    const { reg_id } = req
    const { name } = req.body
    let result = await createWithdrawalBusiness(name, reg_id)
    res.status(result.status).json(result.msg)
}

//GET ALL THE WITHDRAWALS(RETORNA TODAS AS RESERVAS)
Controller.getAllWithdrawalsController = async (req, res) => {
    const {reg_id} = req
    let result = await getAllWithdrawalsBusiness(reg_id)
    res.status(200).json(result)
}

Controller.givebackController = async (req, res) => {
    const { reg_id } = req
    const { name } = req.body
    let result = await givebackBusiness(name, reg_id)
    console.log(result)
    res.status(result.status).json(result.msg)
    
}


module.exports = Controller