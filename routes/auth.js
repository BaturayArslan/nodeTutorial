const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controller/auth");
const User = require("../model/User");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email", " enter valid email").isEmail().trim(),
    body("password", "invalid password or email")
      .isLength({ min: 6, max: 15 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid Email")
      .custom((value, { req }) => {
        return User.findByEmail(value).then((result) => {
          if (result) {
            return Promise.reject(
              "this email has exist pls enter another one."
            );
          }
        });
      }),
    body(
      "password",
      "password should contain only number and letter and should be min 6 charracter"
    )
      .isLength({ min: 6, max: 15 })
      .isAlphanumeric(),
    body("checkPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match.");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
