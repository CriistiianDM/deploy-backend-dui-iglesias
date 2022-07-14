const {Pool} = require('pg');
const {db} = require('./config');

const database = new Pool({
    connectionString: db.connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});


//exportar la conexion a la base de datos
module.exports = database;