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


//show
function show(req, res) {

    //ricavo l'id per identificare il singolo movie
    let id = parseInt(req.params.id);

    //query per visualizzare un movie
    const sql = `SELECT * FROM movies WHERE id= ?`;

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) return res.status(404).json({
            error: 'Movie non trovato!'
        });
        res.json(results[0]);
    })

}

module.exports = { index, show };