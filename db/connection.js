const mysql = require('mysql2');

// Connect to the Database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username
        user: 'elections',
        // MySQL password
        password: 'Elections2022!',
        database: 'election_1'
    },
    console.log('Connected to the election database!')
);


module.exports = db;