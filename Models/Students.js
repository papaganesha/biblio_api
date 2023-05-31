const { Sequelize, DataTypes } = require('sequelize')
const useBcrypt = require('sequelize-bcrypt')
const jwt = require('jsonwebtoken')

//IMPORTING SEQUELIZE CONNECTED AND AUTHENTICATED
const sequelize = require("./Connect.js")


const Student = sequelize.define('student', {
    // Model attributes are defined here
    reg_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 50],
                msg: "Password must be at least 8 characters and less than 50 characters"
            },
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    withdraw: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            len: {
                args: [0, 3],
                msg: "Student cant have more than 0 withdraws and cant withdraw more than 3 books"
            },

        }
    },
}, {
    // Other model options go here
    tableName: 'students',
})

Student.prototype.generateToken = async (id) => {
    return jwt.sign({ id: id }, "mestredosmagos", {
        expiresIn: '1h'
    })
}


sequelize.sync().then(() => {
    console.log('Students table created successfully!')
}).catch((error) => {
    console.error('Unable to create table : ', error)
})


useBcrypt(Student)

module.exports = Student