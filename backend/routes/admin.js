const express = require('express');
const router = express.Router();

// import admin account authentication method
const {authenticate_admin} = require('../controllers/accounts')

// import add products method
const {
  adminAddProduct,
  adminEditProduct,
  adminDeleteProduct,
  adminAddDiscount,
  adminEditDiscount,
  adminGetAllUsers,
  adminGetAllAdmins,
  adminGetSingleUser,
  adminSet
} = require('../controllers/admin');



router.post('/admin/products/add', authenticate_admin, adminAddProduct);
router.put('/admin/products/edit', authenticate_admin, adminEditProduct);
router.delete('/admin/products/delete', authenticate_admin, adminDeleteProduct);
router.post('/admin/discounts/add', authenticate_admin, adminAddDiscount);
router.put('/admin/discounts/edit', authenticate_admin, adminEditDiscount);
router.get('/admin/get_all', authenticate_admin, adminGetAllUsers);
router.get('/admin/manage', authenticate_admin, adminGetAllAdmins);
router.get('/admin/manage/:customer_id', authenticate_admin, adminGetSingleUser);
router.put('/admin/update', authenticate_admin, adminSet);



// export the routes so they can be imported
module.exports = router;