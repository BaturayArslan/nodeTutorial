const express = require("express");
const path = require("path");

const adminController = require("../controller/admin");

const router = express.Router();

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", adminController.postAddProduct);

router.get("/edit-product", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.get("/product-list", adminController.getProductList);

router.get("/delete-product/:productId", adminController.deleteProduct);

module.exports.routes = router;
