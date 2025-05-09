//importo express
const express = require('express');

//importo il controller
const movieControllers = require('../controllers/movieControllers');

const router = express.Router();

//index
router.get('/', movieControllers.index);

//show
router.get('/:id', movieControllers.show);

module.exports = router;