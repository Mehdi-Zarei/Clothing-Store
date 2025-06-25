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
  removeImages,
} = require("./product.controller");

//* Uploader
const { multerStorage } = require("../../utils/multer");
const { bodyValidator } = require("../../middlewares/validator");
const { removeImagesSchema } = require("./product.validators");
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
  .patch(authGuard(["ADMIN"]), upload.array("images", 10), update);

router.delete(
  "/:id/images",
  authGuard(["ADMIN"]),
  bodyValidator(removeImagesSchema),
  removeImages
);

module.exports = router;
