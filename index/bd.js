const {Pool} = require('pg');
const {db} = require('./config');

const database = new Pool({
    connectionString: 'postgres://ykrzhhgvjmhzlx:6d4276eac575c62cb1e5f684e4606eec4a0fac83ae104d285e7285203e8567f4@ec2-23-23-151-191.compute-1.amazonaws.com:5432/dg57o3kgp8v9m',
    ssl: {
        rejectUnauthorized: false
    }
});


//exportar la conexion a la base de datos
module.exports = database;