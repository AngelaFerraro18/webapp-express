//importo express
const express = require('express');

//importo il controller
const movieControllers = require('../controllers/movieControllers');

const router = express.Router();
//importo multer
const upload = require('../middleware/multer');

//index
router.get('/', movieControllers.index);

//show
router.get('/:id', movieControllers.show);

//store review
router.post('/:id/reviews', movieControllers.storeReview);

//store movie
router.post('/', upload.single('image'), movieControllers.storeMovie);

module.exports = router;