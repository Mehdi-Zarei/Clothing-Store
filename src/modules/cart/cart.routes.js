const express = require("express");
const router = express.Router();

//* Controllers
const { get, addToCart, removeFromCart } = require("./cart.controller");

//* Middlewares
const authGuard = require("../../middlewares/authGuard");

//* Routes
router.route("/").get(authGuard(), get);

router
  .route("/:productId")
  .post(authGuard(), addToCart)
  .delete(authGuard(), removeFromCart);

module.exports = router;
