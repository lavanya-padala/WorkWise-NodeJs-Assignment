const express = require('express');
const authenticate=require('./middlewares/session_authentication')
const loginRoutes = require('./login/login.routes');
const signupRoutes = require('./signup/signup.routes');
const sellerRoutes=require("./seller/seller.routes")
const buyerRoutes=require("./buyer/buyer.routes")
const router= express.Router();

router.all('*', (req, res, next) => {
    if (req.path !== '/user/login' && req.path !== '/user/signup') {
      return authenticate(req, res, next);
    }
    next();
});

router.use('/user/', signupRoutes);
router.use('/user/', loginRoutes);
router.use('/seller',sellerRoutes)
router.use('/buyer',buyerRoutes);

module.exports = router;