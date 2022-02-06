const express = require('express');
const { check_user_customerid } = require('../controllers/accounts');
const router = express.Router();

// other imports here, such as from controllers
const {
  productsView,
  productsViewAll,
  productsViewByCategory,
  productsViewAllFaster,
  productsViewSearch,
  discountsViewActive,
  discountsViewAll,
  discountsViewFromId,
  addWishlist,
  editWishlist,
  clearWishlist,
  getWishlist
} = require('../controllers/products');

const {
  addReview,
  editReview,
  getReviewsFromProductId,
  getReviewsFromOrderId
} = require('../controllers/reviews');

const {
  generateSuggestedProducts
} = require('../controllers/suggest_items');


// /**
//  * DELETE THIS AFTER ITS IMPLEMENTED PROPERLY !!!!
//  * !!!
//  */
// const check_user_orderid = (req, res, next) => {
//   req.body['customerid'] = '1234';
//   next();
// }

router.get('/products/', productsViewAllFaster);
router.get('/products/search', productsViewSearch);
router.get('/products/category/:category', productsViewByCategory);
router.get('/products/view/slow', productsViewAll); // <- legacy code, ignore
router.get('/products/:productid', productsView);

router.get('/products/:productid/reviews', getReviewsFromProductId);
router.post('/products/suggested', generateSuggestedProducts);

router.post('/orders/:orderid/reviews/add', check_user_customerid, addReview);
router.put('/orders/:orderid/reviews/edit', editReview);
router.get('/orders/:orderid/reviews', getReviewsFromOrderId);
router.get('/discounts/view', discountsViewAll);
router.get('/discounts/view/id/:productid', discountsViewFromId);
router.get('/discounts/view/active', discountsViewActive);

router.get('/wishlist/:customerid', check_user_customerid, getWishlist);
router.put('/wishlist/add/:customerid', check_user_customerid, addWishlist);
router.put('/wishlist/edit/:customerid', check_user_customerid, editWishlist);
router.delete('/wishlist/clear/:customerid', check_user_customerid, clearWishlist);


// export the routes so they can be imported
module.exports = router;