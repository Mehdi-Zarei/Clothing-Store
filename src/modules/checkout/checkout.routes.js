const express = require("express");
const router = express.Router();

//* Controllers
const { createCheckout, verifyCheckout } = require("./checkout.controller");

//* Middlewares
const authGuard = require("../../middlewares/authGuard");
const { bodyValidator } = require("../../middlewares/validator");
const {
  checkoutSchema,
  verifyCheckoutSchema,
} = require("./checkout.validator");

//* Routes
router
  .route("/")
  .post(authGuard(), bodyValidator(checkoutSchema), createCheckout);
router
  .route("/verify")
  .get(authGuard(), bodyValidator(verifyCheckoutSchema), verifyCheckout);

module.exports = router;
