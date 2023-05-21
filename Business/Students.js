const StudentsRepository = require("../Models/Students.js")

StudentsBusiness = {}

//AUTHENTICATION: REQUIRED PARAMS(REG_ID, PASSWORD)
//RETURN JWT(JSON WEB TOKEN) IN CASE OF SIGNIN
StudentsBusiness.signInBusiness = async (reg_id, password) => {
    if (reg_id && password) {
        //CREATE VARIABLE TO CALL REPOSITORES
        let student
        try {
            //GET STUDENT WHERE REGISTRATION_ID IS THE SAME AS THE PARAMETER RECEIVED
            student = await StudentsRepository.findOne({ where: { reg_id: reg_id } });
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Connection with DB error' }
            }
            else {
                return { status: 400, msg: 'Error while signIn Student, try again' }
            }
        }

        //CASE PASSWORD MATCHES
        if (student.authenticate(password)) {
            const token = await student.generateToken(student.reg_id);
            return { status: 202, token: token }
        }
        //CASE PASSWORD DONT MATCH
        else {
            return { status: 401, msg: 'Wrong password' }
        }
    }
    //MISSING PARAMETERS
    else {
        return { status: 400, msg: 'Missing parameters, try again' }
    }
}


//CREATE STUDENT: REQUIRED PARAMS(NAME, PASSWORD, PHONE)
//RETURN NEW STUDENT REG_ID
StudentsBusiness.createStudentBusiness = async (name, password, phone) => {
    //CHECK PARAMETERS
    if (name && password && phone) {
        //CREATE VARIABLE TO CALL REPOSITORIES
        let create
        try {
            //CREATE NEW STUDENT WITH REQUIRED RECEIVED PARAMETERS
            create = await StudentsRepository.create({
                name,
                password,
                phone
            })
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            if (err.name == 'SequelizeUniqueConstraintError') {
                return { status: 400, msg: 'Student with this phone already exists' }
            }
            else if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Connection with DB error' }
            }
            else {
                return { status: 400, msg: 'Error while creating Student, try again' }
            }
        }

        //IF THE INSERTION HAS OCCURRED
        return { status: 201, msg: { id: create.reg_id } }

    }

}


//GET USER INFO WITH REG_ID ON REQUISITION(AUTH)
//RETURN USER INFO
StudentsBusiness.getStudentByRegBusiness = async (reg_id) => {
    //CREATE VARIABLE TO CALL REPOSITORIES
    let student
    try {
        //GET STUDENT WHERE REGISTRATION_ID IS THE SAME AS THE PARAMETER RECEIVED
        student = await StudentsRepository.findOne({ where: { reg_id: reg_id } })
    }
    //IN CASE OF ERROR
    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
    catch (err) {
        if (err.name == 'SequelizeConnectionRefusedError') {
            return { status: 400, msg: 'Connection with DB error' }
        }
        else {
            return { status: 400, msg: 'Error while creating Student, try again' }
        }
    }

    //IF STUDENT IS NULL OR INVALID
    if (student == null || student.length == 0) {
        return { status: 400, msg: "Inexistent Student" }
    }
    //RETURNING STUDENT
    else {
        return { status: 200, msg: student }
    }
}

module.exports = StudentsBusiness