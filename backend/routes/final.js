const express = require('express');
const router = express.Router();

// 404 error Default response for any other request
router.use((req, res, next) => {
  res.status(404).send('OWO you encountered a 404 error!! :3... Try another url please~ ^^');
});

module.exports = router;