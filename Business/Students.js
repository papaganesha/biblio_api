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
        //RETURN 1 IN CASE STUDENT PHONE ALREADY EXISTS
        //RETURN 2 IN CASE OF OTHER ERROR
        if(err.name == 'SequelizeUniqueConstraintError'){
            return 1
        }else{
            return 2
        }
    })

    if(create == 1 || create == 2){
        if(create == 1){
            return {status: 201, msg: 'Student with this phone already exists'}
        }else{
            return {status: 201, msg: 'Error while creating Student, try again'}
        }
    }else{
        return {status: 201, msg: create.reg_id}
    }
    

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