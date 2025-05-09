//importo express
const express = require('express');

//importo routers
const movieRouters = require('./routers/movieRouters')

//importo i middleware per la gestiore degli errori
const errorsHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const port = process.env.PORT || 3000;

//decodifico con il body-parser
app.use(express.json());

//rendo accessibili li immagini in public
app.use(express.static('public'));

app.use('/movies', movieRouters);

//gestione error: 500
app.use(errorsHandler);

//gestione error:404
app.use(notFound);

app.listen(port, () => {
    console.log(`Server in listening on port: ${port}`);
})