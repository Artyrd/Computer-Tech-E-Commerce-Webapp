const express = require('express');
const router = express.Router();

// other imports here, such as from controllers
const {
  placeOrder,
  ordersView,
  ordersViewAll,
  ordersEditDetailsAdmin,
  ordersEditDetailsUser,
  ordersUserViewAll,
} = require('../controllers/orders');

// const {
//   salesGetPopular,
//   salesStatsOverall,
//   salesStatsByCategory,
//   salesStatsByProductId,
//   salesStatsByProductName
// } = require('../controllers/sales');

const {
  sendEmailPriceDrop,
  sendEmailIssues
} = require('../controllers/send_email')


const {
  authenticate_admin,
  check_user_customerid
} = require('../controllers/accounts');


// router.get('/products', (req, res, next) => {
//   res.send('There are no products...')
// })

router.post('/checkout/place_order', placeOrder);

// requires admin authentication
router.get('/admin/orders/', authenticate_admin, ordersViewAll);

// requires user or admin authentication, to view their personal order
router.get('/orders/:orderid', ordersView);

// tba: view all orders of the specific customer
router.get('/orders/user/:customerid', check_user_customerid, ordersUserViewAll);

router.put('/admin/orders/edit', authenticate_admin, ordersEditDetailsAdmin);

router.put('/orders/edit/:orderid', check_user_customerid, ordersEditDetailsUser);

router.post('/email/pricedrop', sendEmailPriceDrop);
router.post('/email/issues', sendEmailIssues);

// router.get('/admin/sales/popular', authenticate_admin, salesGetPopular);

// router.get('/admin/sales/statistics/overall', authenticate_admin, salesStatsOverall);

// router.get('/admin/sales/statistics/category/:category', authenticate_admin, salesStatsByCategory);

// router.get('/admin/sales/statistics/product/id/:productid', authenticate_admin, salesStatsByProductId);

// router.get('/admin/sales/statistics/product/name/:name', authenticate_admin, salesStatsByProductName);

// export the routes so they can be imported
module.exports = router;