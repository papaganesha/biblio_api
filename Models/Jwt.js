const { Sequelize, DataTypes } = require('sequelize')

const sequelize = require("./Connect.js")

const Token = sequelize.define('token', {
    // Model attributes are defined here
    refresh_token: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true    
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    // Other model options go here
    tableName: 'tokens',
})

sequelize.sync().then(() => {
    console.log('Authors table created successfully!')
}).catch((error) => {
    console.error('Unable to create table : ', error)
})

module.exports = Token