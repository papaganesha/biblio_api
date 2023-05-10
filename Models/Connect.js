const { Sequelize } = require('sequelize');

// const dbName = process.env.DB_NAME; // passar os dados do .env para as constantes
// const dbUser = process.env.DB_USER;
// const dbHost = process.env.DB_HOST;
// const dbPassword = process.env.DB_PASSWORD;

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('biblioteca_api', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });


//exportar
module.exports =  sequelize 