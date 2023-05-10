const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require("./Connect.js")

const Author = sequelize.define('author', {
    // Model attributes are defined here
    author_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    // Other model options go here
    tableName: 'authors',
});

sequelize.sync().then(() => {
    console.log('Authors table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = Author