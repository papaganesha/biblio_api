//Listar e buscar todos os clientes E cliente especifico por ID.✔️


// const {  } = require('../Bussiness/Books')
const { 
    createStudentBusiness,
    getAllStudentsBusiness,
    getStudentByRegBusiness,
    signInBusiness
} = require('../Business/Students')


var Controller = {}

//SIGIN
Controller.signInController = async(req, res) => {
    const {reg_id, password} = req.body
    let result = await signInBusiness(reg_id, password)
    if(result.status == 202){
        res.status(result.status).json(result.token)
    }else{
        res.status(result.status).json(result.msg)
    }
    
}

//GET ALL THE STUDENTS(BUSCA TODOS OS ESTUDANTES)
Controller.createStudentController = async (req, res) => {
    const {name, password, phone} = req.body
    let result = await createStudentBusiness(name, password, phone)
    res.status(result.status).json(result.msg)
}


//GET STUDENT BY REGISTRATION NUMBER(PEGA ESTUDANTE PELO NUMERO DE MATRICULA)
Controller.getStudentByRegController = async (req, res) => {
    const {reg_id} = req
    let result = await getStudentByRegBusiness(reg_id)
    res.status(result.status).json(result.msg)
}

module.exports = Controller