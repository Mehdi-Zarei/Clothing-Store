const express = require("express");
const router = express.Router();

//*Middleware
const authGuard = require("../../middlewares/authGuard");

//* Controller
const {
  getAll,
  getOne,
  toggleBanStatus,
  changeRole,
} = require("./user.controller");

//* Routes
router.route("/").get(authGuard(["ADMIN"]), getAll);
router.route("/:id").get(authGuard(["ADMIN"]), getOne);
router.route("/:id/ban").patch(authGuard(["ADMIN"]), toggleBanStatus);
router.route("/:id/role").patch(authGuard(["ADMIN"]), changeRole);

module.exports = router;
