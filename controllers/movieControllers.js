//importo connection
const connection = require('../data/db');

//index
function index(req, res) {

    //query per visualizzare tutti i film
    const sql = `SELECT movies.*, AVG(reviews.vote) AS mean_votes
    FROM
        movies
    LEFT JOIN
        reviews ON movies.id = reviews.movie_id
        GROUP BY movies.id`;

    connection.query(sql, (err, results) => {
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
    const sql = `SELECT * FROM movies WHERE id= ?`;

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

module.exports = { index, show };