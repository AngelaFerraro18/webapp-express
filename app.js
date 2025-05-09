//importo express
const express = require('express');

//importo routers
const movieRouters = require('./routers/movieRouters')

const app = express();
const port = process.env.PORT || 3000;

app.use('/movies', movieRouters)

app.listen(port, () => {
    console.log(`Server in listening on port: ${port}`);
})