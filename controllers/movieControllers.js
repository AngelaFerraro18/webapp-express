//importo connection
const connection = require('../data/db');

//index
function index(req, res) {

    //query per visualizzare tutti i film
    const sql = `SELECT * FROM movies`;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({
            error: 'Database query error!'
        });
        res.json(results);
    })
}

module.exports = { index };