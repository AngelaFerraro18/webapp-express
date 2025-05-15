//importo connection
const connection = require('../data/db');
const slugify = require('slugify');

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

    //ricavo lo slug per identificare il singolo movie
    let slug = req.params.slug;

    //query per visualizzare un movie
    const sqlMovie = `SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS mean_votes
    FROM
        movies
    LEFT JOIN
        reviews ON movies.id = reviews.movie_id
    WHERE movies.slug = ?
    GROUP BY movies.id`;

    connection.query(sqlMovie, [slug], (err, movieResults) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (movieResults.length === 0 || movieResults[0]?.id === null) return res.status(404).json({
            error: 'Movie non trovato!'
        });

        const movie = {
            ...movieResults[0],
            image: process.env.IMAGE_PATH + 'movies_cover/' + movieResults[0].image
        };

        const movieId = movieResults[0].id;

        //query per visualizzare le reviews
        const sqlReview = `SELECT reviews.* 
                        FROM
                            reviews
                    JOIN movies ON movies.id = reviews.movie_id
                    WHERE reviews.movie_id =?`

        connection.query(sqlReview, [movieId], (err, reviewRes) => {
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

//store movie
function storeMovie(req, res) {

    const { title, director, abstract } = req.body;

    const imageName = req.file.filename;

    const sql = `INSERT INTO db_movies.movies (title, director, abstract, image, slug) 
    VALUES (?, ?, ?, ?, ?);`

    const slug = slugify(title, {
        lower: true,
        trim: true
    })

    connection.query(sql, [title, director, abstract, imageName, slug], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed!' });
        res.status(201).json({
            message: 'A new movie is added!'
        })
    })
}

module.exports = { index, show, storeReview, storeMovie };