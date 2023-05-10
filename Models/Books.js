const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require("./Connect.js")


const Book = sequelize.define('book', {
    // Model attributes are defined here
    isbn: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publisher: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    publi_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            min:{
                args: [0],
                msg: "Book stock must be at least 0 or greater than 0"
            }
        }
    },
    img_url:{
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    // Other model options go here
    tableName: 'books',
});

sequelize.sync().then(() => {
    console.log('Books table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = Book