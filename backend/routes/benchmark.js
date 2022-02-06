const express = require('express');
const router = express.Router();

// other imports here, such as from controllers
const {
  calculateBenchmark
} = require('../controllers/benchmark');



router.post('/api/benchmark', calculateBenchmark);


// export the routes so they can be imported
module.exports = router;