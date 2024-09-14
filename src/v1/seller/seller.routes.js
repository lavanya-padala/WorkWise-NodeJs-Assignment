const express = require('express');
const {addProduct,deleteProduct,editProduct}=require("./seller.controller")
const {validateAddProduct}=require("./seller.validation")
const router = express.Router();

router.post("/add-product",validateAddProduct,addProduct);
router.post("/delete-product/:productId",deleteProduct);
router.post("/edit-product/:productId",editProduct);


module.exports = router;
