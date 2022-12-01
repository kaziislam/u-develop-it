const e = require('express');
const express = require('express');
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3001;
const app = express();

// adding Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to the Database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username
        user: 'elections',
        // MySQL password
        password: 'P@$$W0rd!',
        database: 'election_1'
    },
    console.log('Connected to the election database!')
);

// get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `select candidates.*, parties.name
                as party_name
                from candidates
                left join parties
                on candidates.party_id = parties.id;
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// get a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `select candidates.*, parties.name
                as party_name
                from candidates
                left join parties
                on candidates.party_id = parties.id
                where candidates.id = ?;
    `;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

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

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `delete from candidates where id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found!'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});


// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `insert into candidates (first_name, last_name, industry_connected)
            values (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// Update a candidate's party
app.put('/api/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `update candidates set party_id = ?
                where id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows){
            res.json({
                message: 'Candidate not found!'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// get all parties
app.get('/api/parties', (req, res) => {
    const sql = `select * from parties`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// get a single party
app.get('/api/party/:id', (req, res) => {
    const sql = `select * from parties where id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// delete a party
app.delete('/api/party/:id', (req, res) => {
    const sql = `delete from parties where id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            // checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
                message: "Party not found!"
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});