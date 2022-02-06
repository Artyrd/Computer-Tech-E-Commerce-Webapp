const express = require('express');
const router = express.Router();

const {
    register_account,
    login_account,
    forgot_password,
    reset_password,
    edit_profile,
    get_profile,
    check_user_customerid
} = require('../controllers/accounts');

router.post('/accounts/register', register_account);
router.post('/accounts/login', login_account);
router.post('/accounts/forgot_password', forgot_password);
router.post('/accounts/reset_password', reset_password);

router.get('/profile/:customerid', check_user_customerid, get_profile)
router.put('/profile/edit/:customerid', check_user_customerid, edit_profile)

module.exports = router;