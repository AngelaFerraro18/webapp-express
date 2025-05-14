//importo connection
const { text } = require('express');
const connection = require('../data/db');

//index
function index(req, res) {

    const { search } = req.query;

    //creo un'array per i parametri
    const searchParams = [];

    //query per visualizzare tutti i film
    let sql = `SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS mean_votes
    FROM
        movies
    LEFT JOIN
        reviews ON movies.id = reviews.movie_id`;

    if (search) {
        sql += ` 
        WHERE title LIKE ? OR director LIKE ? OR abstract LIKE ?
        `;
        searchParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` GROUP BY movies.id`;

    connection.query(sql, searchParams, (err, results) => {
        if (err) return res.status(500).json({
            error: 'Database query error!'
        });
        res.json(results.map(result => ({
            ...result,
            image: process.env.IMAGE_PATH + 'movies_cover/' + result.image
        })));
    })
}


//show
function show(req, res) {

    //ricavo l'id per identificare il singolo movie
    let id = parseInt(req.params.id);

    //query per visualizzare un movie
    const sql = `SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS mean_votes
    FROM
        movies
    LEFT JOIN
        reviews ON movies.id = reviews.movie_id
    WHERE movies.id = ?`;

    connection.query(sql, [id], (err, movieResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (movieResults.length === 0) return res.status(404).json({
            error: 'Movie non trovato!'
        });

        const movie = {
            ...movieResults[0],
            image: process.env.IMAGE_PATH + 'movies_cover/' + movieResults[0].image
        };

        //query per visualizzare le reviews
        const sql = `SELECT reviews.* 
                        FROM
                            reviews
                    JOIN movies ON movies.id = reviews.movie_id
                    WHERE reviews.movie_id =?`

        connection.query(sql, [id], (err, reviewRes) => {
            if (err) return res.status(500).json({ error: 'Database query failed!' });
            movie.reviews = reviewRes;
            res.json(movie);
        })
    })

}

//store review
function storeReview(req, res) {

    let id = parseInt(req.params.id);

    const { name, vote, text } = req.body;

    const sql = `INSERT INTO db_movies.reviews (movie_id, name, vote, text) 
    VALUES (?, ?, ?, ?);`

    connection.query(sql, [id, name, vote, text], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed!' });
        res.status(201).json({
            message: 'A new review is added!',
            review: { movie_id: id, name, vote, text }
        })
    })
}

module.exports = { index, show, storeReview };