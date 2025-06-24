const express = require("express");
const router = express.Router();

//* Middleware
const authGuard = require("../../middlewares/authGuard");
const { bodyValidator } = require("../../middlewares/validator");
const {
  categorySchema,
  updateCategorySchema,
} = require("./category.validator");

//* Controllers
const {
  getAll,
  create,
  update,
  remove,
  getOne,
} = require("./category.controller");

//* Routes
router
  .route("/")
  .get(getAll)
  .post(authGuard(["ADMIN"]), bodyValidator(categorySchema), create);

router
  .route("/:id")
  .get(getOne)
  .patch(authGuard(["ADMIN"]), bodyValidator(updateCategorySchema), update)
  .delete(authGuard(["ADMIN"]), remove);

module.exports = router;
