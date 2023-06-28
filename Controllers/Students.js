// CREATE NEW STUDENT.✔️
// SIGNIN STUDENT(JWT AUTHENTICATION WITH MIDDLEWARE). ✔️
// GET STUDENT INFO WITH REQ.REG_ID(NEED TO BE AUTHENTICATED). ✔️


const { 
    createStudentBusiness,
    getAllStudentsBusiness,
    getStudentByRegBusiness,
    signInBusiness,
    updateStudentBusiness,
    deleteStudentBusiness
} = require('../Business/Students')


var Controller = {}

//SIGNIN: REQUIRED PARAMS(REGID AND PASSWORD)
//STUDENT NEED TO BE ALREADY REGISTERED
//RETURN JWT IN CASE OF SIGNIN PROCEED
Controller.signInController = async(req, res) => {
    const {regId, password} = req.body
    let result = await signInBusiness(regId, password)
    if(result.status == 202){
        res.status(result.status).json(result.tokens)
    }else{
        res.status(result.status).json(result.msg)
    }
    
}

//CREATE NEW STUDENT: REQUIRED PARAMS(NAME, PASSWORD AND PHONE)
Controller.createStudentController = async (req, res) => {
    const {name, password, phone} = req.body
    let result = await createStudentBusiness(name, password, phone)
    res.status(result.status).json(result.msg)
}


//GET STUDENT BY REGISTRATION NUMBER
Controller.getStudentByRegController = async (req, res) => {
    const {regId} = req
    let result = await getStudentByRegBusiness(regId)
    res.status(result.status).json(result.msg)
}

//UPDATE STUDENT BY REGID AND SELECTED INFO
Controller.updateStudentByRegIdController = async (req, res) => {
    const {regId} = req
    const {name, phone} = req.body
    let result = await updateStudentBusiness(regId, name, phone)
    res.status(result.status).json(result.msg)
}
//DELETE STUDENT BY REGISTRATION NUMBER
Controller.deleteStudentByRegIdController = async (req, res) => {
    const {regId} = req
    let result = await deleteStudentBusiness(regId)
    res.status(result.status).json(result.msg)
}



module.exports = Controller