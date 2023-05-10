const StudentsRepository = require("../Models/Students.js")

StudentsBusiness = {}

//StudentsBusiness.findAllStudents = async () => {}
StudentsBusiness.signInBusiness = async (reg_id, password) => {
    const student = await StudentsRepository.findOne({ where: { reg_id: reg_id }});
    //CASE PASSWORD MATCHES
    if(student.authenticate(password)){
        const token = await student.generateToken(student.reg_id);
        return {status: 202, token: token}
    }else{
        return {status: 401, msg: 'Wrong password'}
    }
}


StudentsBusiness.createStudentBusiness = async (name, password, phone) => {
    const create = await StudentsRepository.create({
        name,
        password,
        phone
    }).catch(err => {
        return {status: 400, msg: err.message}
    })

    return {status: 201, msg: create}
}


StudentsBusiness.getStudentByRegBusiness = async (reg_id) => {
    const student = await StudentsRepository.findOne({ where: { reg_id: reg_id } })
    if (student == null || student.length == 0) {
        return "Inexistent Student"
    }
    else {
        return student
    }
}

module.exports = StudentsBusiness