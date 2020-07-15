const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controller/admin");
const routeProtection = require("../protectionMiddleW/routeProtection");

const router = express.Router();

router.get("/add-product", routeProtection, adminController.getAddProduct);

router.post(
  "/add-product",
  routeProtection,
  [
    body("title", "title must contain letter and numbers only.")
      .isString()
      .trim(),
    body("price", "price must be float").isFloat().trim(),
    body("description", "description length must bound in 5-400 chracter")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  adminController.postAddProduct
);

router.get("/edit-product", routeProtection, adminController.getEditProduct);

router.post("/edit-product", routeProtection, adminController.postEditProduct);

router.get(
  "/edit-product/:productId",
  routeProtection,
  adminController.getEditProduct
);

router.get("/product-list", routeProtection, adminController.getProductList);

router.delete(
  "/delete-product/:productId",
  routeProtection,
  adminController.deleteProduct
);

module.exports.routes = router;
