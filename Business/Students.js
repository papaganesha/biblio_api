// CREATE NEW STUDENT.✔️
// SIGNIN STUDENT(JWT AUTHENTICATION WITH MIDDLEWARE). ✔️
// GET STUDENT INFO WITH REQ.REG_ID(NEED TO BE AUTHENTICATED). ✔️


const StudentsRepository = require("../Models/Students.js")
const sequelize = require('../Models/Connect.js')


StudentsBusiness = {}

//AUTHENTICATION: REQUIRED PARAMS(REG_ID, PASSWORD)
//RETURN JWT(JSON WEB TOKEN) IN CASE OF SIGNIN
StudentsBusiness.signInBusiness = async (reg_id, password) => {
    if (reg_id && password) {
        //CREATE VARIABLE TO CALL REPOSITORES
        let student
        try {
            //GET STUDENT WHERE REGISTRATION_ID IS THE SAME AS THE PARAMETER RECEIVED
            student = await StudentsRepository.findOne({ where: { reg_id: reg_id } })
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Erro de conexão ao Banco' }
            }
            else {
                return { status: 400, msg: 'Erro ao autenticar Estudante, tente novamente' }
            }
        }

        if (student != null) {
            //CASE PASSWORD MATCHES
            if (student.authenticate(password)) {
                const tokens = await student.generateToken(student.reg_id)
                console.log(tokens.accessToken)
                return { status: 202, tokens}
            }
            //CASE PASSWORD DONT MATCH
            else {
                return { status: 401, msg: 'Senha incorreta' }
            }
        } else {
            return { status: 400, msg: 'Estudante não existe, tente novamente' }
        }
    }
    //MISSING PARAMETERS
    else {
        return { status: 400, msg: 'Parametros insuficientes, tente novamente' }
    }
}




//CREATE STUDENT: REQUIRED PARAMS(NAME, PASSWORD, PHONE)
//RETURN NEW STUDENT REG_ID
StudentsBusiness.createStudentBusiness = async (name, password, phone) => {
    //CHECK PARAMETERS
    if (name && password && phone) {
        const transaction = await sequelize.transaction()

        //CREATE VARIABLE TO CALL REPOSITORIES
        let create
        try {
            //CREATE NEW STUDENT WITH REQUIRED RECEIVED PARAMETERS
            create = await StudentsRepository.create({
                name,
                password,
                phone
            }, { transaction })
            await transaction.commit()
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            await transaction.rollback()
            if (err.name == 'SequelizeUniqueConstraintError') {
                return { status: 400, msg: 'Estudante com este telefone já existe' }
            }
            else if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Erro de conexão ao Banco' }
            }
            else {
                return { status: 400, msg: 'Erro criando Estudante, tente novamente' }
            }
        }

        //console.log(transaction)
        //IF THE INSERTION HAS OCCURRED
        return { status: 201, msg: { id: create.reg_id } }

    }else{
        return { status: 400, msg: 'Parametros insuficientes, tente novamente' }
    }

}


//GET STUDENT INFO WITH REG_ID ON REQUISITION(AUTH)
//RETURN STUDENT INFO
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
            return { status: 400, msg: 'Erro de conexão ao Banco' }
        }
        else {
            return { status: 400, msg: 'Erro criando Estudante, tente novamente' }
        }
    }

    //IF STUDENT IS NULL OR INVALID
    if (student == null || student.length == 0) {
        return { status: 400, msg: "Estudante não existe, tente novamente" }
    }
    //RETURNING STUDENT
    else {
        return { status: 200, msg: student }
    }
}

//CREATE STUDENT: REQUIRED PARAMS(NAME, PASSWORD, PHONE)
//RETURN NEW STUDENT REG_ID
StudentsBusiness.updateStudentBusiness = async (regId, name, phone) => {
    //CHECK PARAMETER
    console.log(name, phone)
    if (name || phone) {
        let getStudent
        try {
            //GET STUDENT
            getStudent = await StudentsRepository.findOne({
                where: {
                    reg_id: regId
                }
            })

        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Erro de conexão ao Banco' }
            }
            else {
                return { status: 400, msg: 'Erro deletando Estudante, tente novamente' }
            }
        }

        if (getStudent != null) {
            const transaction = await sequelize.transaction()
            if (name && phone) {
                let updateNameAndPhone
                try {
                    updateNameAndPhone = await StudentsRepository.update(
                        {
                            name: name,
                            phone: phone
                        },
                        { where: { reg_id: regId } },
                        { transaction }
                    )
                    await transaction.commit()
                }
                //IN CASE OF ERROR
                //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
                catch (err) {
                    await transaction.rollback()
                    if (err.name == 'SequelizeUniqueConstraintError') {
                        return { status: 400, msg: 'Estudante com este telefone já existe' }
                    }
                    else if (err.name == 'SequelizeConnectionRefusedError') {
                        return { status: 400, msg: 'Erro de conexão ao Banco' }
                    }
                    else {
                        return { status: 400, msg: 'Erro atualizando Estudante, tente novamente' }
                    }
                }
                return {status: 201, msg: `Nome: ${getStudent.name} e telefone ${getStudent.name} atualizados para ${name} e ${phone}`}

            }
            if (name) {
                let updateName
                try {
                    updateName = await StudentsRepository.update(
                        { name: name },
                        { where: { reg_id: regId } },
                        { transaction }
                    )
                    await transaction.commit()
                }
                //IN CASE OF ERROR
                //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
                catch (err) {
                    await transaction.rollback()
                    if (err.name == 'SequelizeConnectionRefusedError') {
                        return { status: 400, msg: 'Erro de conexão ao Banco' }
                    }
                    else {
                        return { status: 400, msg: 'Erro atualizando Estudande, tente novamente' }
                    }
                }
                return {status: 201, msg: `Nome de ${getStudent.name} atualizado para ${name}`}

            }
            if (phone) {
                let updatePhone
                try {
                    updatePhone = await StudentsRepository.update(
                        { phone: phone },
                        { where: { reg_id: regId } },
                        { transaction }
                    )
                    await transaction.commit()
                }
                //IN CASE OF ERROR
                //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
                catch (err) {
                    await transaction.rollback()
                    if (err.name == 'SequelizeUniqueConstraintError') {
                        return { status: 400, msg: 'Estudante com este telefone ja existe' }
                    }
                    else if (err.name == 'SequelizeConnectionRefusedError') {
                        return { status: 400, msg: 'Erro de conexão ao Banco' }
                    }
                    else {
                        return { status: 400, msg: 'Erro atualizando Estudante, tente novamente' }
                    }
                }
                return {status: 201, msg: `Telefone ${getStudent.phone} atualizado para ${phone}`}
            }
            
        }
        //MISSING PARAMETERS
        else {
            return { status: 400, msg: 'Parametros insuficientes, tente novamente' }
        }
    } else {
        return { status: 400, msg: `Estudante não existe, tente novamente` }
    }

}

//DELETE STUDENT: REQUIRED PARAMS(REGID, NEED TO BE AUTHENTICATED)
//RETURN MESSAGES
StudentsBusiness.deleteStudentBusiness = async (regId) => {
    //CHECK PARAMETERS
    let getStudent
    try {
        //student NEW STUDENT WITH REQUIRED RECEIVED PARAMETERS
        getStudent = await StudentsRepository.findOne({
            where: {
                reg_id: regId
            }
        })

    }
    //IN CASE OF ERROR
    //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
    catch (err) {
        if (err.name == 'SequelizeConnectionRefusedError') {
            return { status: 400, msg: 'Erro de conexão ao Banco' }
        }
        else {
            return { status: 400, msg: 'Erro deletando Estudante, tente novamente' }
        }
    }

    if (getStudent != null) {
        const transaction = await sequelize.transaction()

        //CREATE VARIABLE TO CALL REPOSITORIES
        let deleteStudent
        try {
            //CREATE NEW STUDENT WITH REQUIRED RECEIVED PARAMETERS
            deleteStudent = await StudentsRepository.destroy({
                where: {
                    reg_id: regId
                }
            }, { transaction })
            await transaction.commit()
        }
        //IN CASE OF ERROR
        //CHECK FOR ERROR.NAME, AND RETURN RESPONSE STATUS AND MSG WITH ERROR DESCRIPTION
        catch (err) {
            await transaction.rollback()
            if (err.name == 'SequelizeConnectionRefusedError') {
                return { status: 400, msg: 'Erro de conexão ao Banco' }
            }
            else {
                return { status: 400, msg: 'Erro deletando Estudante, tente novamente' }
            }
        }

        //console.log(transaction)
        //IF THE INSERTION HAS OCCURRED
        return { status: 201, msg: `${getStudent.name} is removed with sucess` }

    } else {
        return { status: 400, msg: `Student doenst exists, try again` }
    }

}

module.exports = StudentsBusiness