const express = require('express');
const {searchProducts,addToCart,removeFromCart}=require("./buyer.controller")
const router = express.Router();

//all the buyer routes
router.get("/search-products", searchProducts); 
router.post("/add-to-cart",addToCart);
router.delete('/remove-from-cart/:productId', removeFromCart);

module.exports = router;
