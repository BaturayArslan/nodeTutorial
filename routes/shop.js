const express = require("express");
const path = require("path");

const shopController = require("../controller/shop");
const erorController = require("../controller/eror");

const router = express.Router();

router.get("/favicon.ico", erorController.eror204);

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

// router.get("/checkout", shopController.getCheckout);

router.get("/product-details", shopController.getProductDetails);

router.get("/product-details/:productId", shopController.getProductDetails);

// router.get("/cart", shopController.getCart);

// router.post("/cart", shopController.postCart);

// router.post("/cart-delete-item", shopController.cartDeleteItem);

// router.post("/createOrder", shopController.postOrder);

module.exports = router;
