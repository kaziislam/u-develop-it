const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

router.post('/vote', ({ body }, res) => {
    // Data validation
    const errors = inputCheck(body, 'voter_id', 'candidate_id');
    if(errors) {
        res.status(400).json({ error: errors });
        return;
    } 

    const sql = `insert into votes (voter_id, candidate_id) values (?,?)`;
    const params = [body.voter_id, body.candidate_id];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        } 
        res.json({
            message: 'success',
            data: body,
            changes: result.affectedRows
        });
    });
});

router.get('/votes', (req, res) => {
    const sql = `select candidates.*, parties.name as party_name, count(candidate_id) as count
    from votes
    left join candidates on votes.candidate_id = candidates.id
    left join parties on candidates.party_id = parties.id
    group by candidate_id order by count desc;`

    db.query(sql, (err, rows) => {
        if(err) {
            res.json(500).json({ error: err.message})
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

module.exports = router;