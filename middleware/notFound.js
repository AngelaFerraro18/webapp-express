//creo una funzione per gestire l'errore 404 not Found
function notFound(req, res, next) {
    res.status(404).json({
        status: 404,
        error: "Not Found"
    });
}


module.exports = notFound;