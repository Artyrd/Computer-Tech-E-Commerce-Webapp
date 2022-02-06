const express = require('express');
const router = express.Router();

const {
  salesGetPopularAdmin,
  salesGetPopularByCategoryAdmin,
  salesStatsOverall,
  salesStatsByCategory,
  salesStatsByProductId,
  salesStatsByProductName,
  salesGetPopular,
  salesGetPopularByCategory
} = require('../controllers/sales');



const {
  authenticate_admin
} = require('../controllers/accounts');
const {
  check_user
} = require('../controllers/accounts');


router.get('/admin/sales/popular', authenticate_admin, salesGetPopularAdmin);

router.get('/admin/sales/popular/category/:category', authenticate_admin, salesGetPopularByCategoryAdmin);

router.get('/admin/sales/statistics/overall', authenticate_admin, salesStatsOverall);

router.get('/admin/sales/statistics/category/:category', authenticate_admin, salesStatsByCategory);

router.get('/admin/sales/statistics/product/id/:productid', authenticate_admin, salesStatsByProductId);

router.get('/admin/sales/statistics/product/name/:name', authenticate_admin, salesStatsByProductName);


// public routes

router.get('/api/sales/popular', salesGetPopular);

router.get('/api/sales/popular/category/:category', salesGetPopularByCategory);


// export the routes so they can be imported
module.exports = router;