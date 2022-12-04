const mysql = require('mysql2');

// Connect to the Database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username
        user: 'elections',
        // MySQL password
        password: 'P@$$w0rd2033!',
        database: 'election_1'
    },
    console.log('Connected to the election database!')
);


module.exports = db;