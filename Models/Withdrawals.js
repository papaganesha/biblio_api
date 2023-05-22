const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require("./Connect.js")


const Withdrawal = sequelize.define('withdrawal', {
    // Model attributes are defined here
    withdrawal_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    book_isbn: {
        type: DataTypes.UUID,
        allowNull: false, 
    },
    student_reg: {
        type: DataTypes.UUID,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    giveback_date : { 
        type: DataTypes.DATE,
        allowNull: true,
    },
    late:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    done:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
}, {
    // Other model options go here
    tableName: 'withdrawals'
})
sequelize.sync().then(() => {
    console.log('Withdrawals table created successfully!')}).catch((error) => {
    console.error('Unable to create table : ', error)})
module.exports = Withdrawal