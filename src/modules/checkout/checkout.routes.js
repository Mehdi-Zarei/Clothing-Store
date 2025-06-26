const express = require("express");
const router = express.Router();

//* Controllers
const { createCheckout, verifyCheckout } = require("./checkout.controller");

//* Middlewares
const authGuard = require("../../middlewares/authGuard");

//* Routes
router.route("/").post(authGuard(), createCheckout);
router.route("/verify").get(authGuard(), verifyCheckout);

module.exports = router;
