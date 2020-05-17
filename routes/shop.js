const express = require("express");
const path = require("path");

const shopController = require("../controller/shop");
const erorController = require("../controller/eror");
const routeProtection = require("../protectionMiddleW/routeProtection");

const router = express.Router();

router.get("/favicon.ico", erorController.eror204);

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

// router.get("/checkout", shopController.getCheckout);

router.get("/product-details", shopController.getProductDetails);

router.get("/product-details/:productId", shopController.getProductDetails);

router.get("/cart", routeProtection, shopController.getCart);

router.post("/cart", routeProtection, shopController.postCart);

router.post(
  "/cart-delete-item",
  routeProtection,
  shopController.cartDeleteItem
);

router.post("/createOrder", routeProtection, shopController.postOrder);

module.exports = router;
