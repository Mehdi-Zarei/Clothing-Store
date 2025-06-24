const express = require("express");
const router = express.Router();

//* Middlewares
const authGuard = require("../../middlewares/authGuard");

//* Controllers
const {
  create,
  getAll,
  getOne,
  remove,
  update,
} = require("./product.controller");

//* Uploader
const { multerStorage } = require("../../utils/multer");
const upload = multerStorage("public/images/products", 10, [".jpg", ".jpeg"]);

//* Routes
router
  .route("/")
  .post(authGuard(["ADMIN"]), upload.array("images", 10), create)
  .get(getAll);

router
  .route("/:id")
  .get(getOne)
  .delete(authGuard(["ADMIN"]), remove)
  .patch(authGuard(["ADMIN"]), update);

module.exports = router;
