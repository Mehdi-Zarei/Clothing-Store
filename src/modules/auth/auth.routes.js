const express = require("express");
const router = express.Router();

//* Controller
const {
  send,
  verify,
  register,
  login,
  me,
  logout,
  refreshAccessToken,
} = require("./auth.controller");

//* Middlewares
const authGuard = require("../../middlewares/authGuard");
const { bodyValidator } = require("../../middlewares/validator");
const {
  sentOtpSchema,
  verifyOtpSchema,
  registerSchema,
  loginSchema,
} = require("./auth.validator");

router.route("/send").post(bodyValidator(sentOtpSchema), send);
router.route("/verify").post(bodyValidator(verifyOtpSchema), verify);
router.route("/register").post(bodyValidator(registerSchema), register);
router.route("/login").post(bodyValidator(loginSchema), login);
router.route("/me").get(authGuard(), me);
router.route("/logout").post(authGuard(), logout);
router.route("/refresh").get(authGuard(), refreshAccessToken);

module.exports = router;
