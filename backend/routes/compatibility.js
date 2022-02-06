const express = require('express');
const router = express.Router();

// other imports here, such as from controllers
const {
  checkCompatibility,
  getCompatibilityFields,
  addCompatibilityFields
} = require('../controllers/compatibility');


const {
  authenticate_admin
} = require('../controllers/accounts');
const {
  check_user
} = require('../controllers/accounts');


router.post('/api/compatibility/check', checkCompatibility);
router.get('/api/compatibility/:category/fields', getCompatibilityFields);
router.post('/admin/compatability/add', authenticate_admin, addCompatibilityFields);


// export the routes so they can be imported
module.exports = router;