const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// adding Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World!'
//     });
// });

// db.query(`select * from candidates where id = 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });



// default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
});