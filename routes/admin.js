const express = require("express");
const path = require("path");

const adminController = require("../controller/admin");
const routeProtection = require("../protectionMiddleW/routeProtection");

const router = express.Router();

router.get("/add-product", routeProtection, adminController.getAddProduct);

router.post("/add-product", routeProtection, adminController.postAddProduct);

router.get("/edit-product", routeProtection, adminController.getEditProduct);

router.post("/edit-product", routeProtection, adminController.postEditProduct);

router.get(
  "/edit-product/:productId",
  routeProtection,
  adminController.getEditProduct
);

router.get("/product-list", routeProtection, adminController.getProductList);

router.get(
  "/delete-product/:productId",
  routeProtection,
  adminController.deleteProduct
);

module.exports.routes = router;
