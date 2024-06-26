const express = require("express");
const BeachController = require("../controllers/beaches");
const asyncHandler = require("../utils/asyncHandler");
const isValidObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth");
const { isAuthorBeach } = require("../middlewares/isAuthor");
const { validateBeach } = require("../middlewares/validator");
const upload = require("../configs/multer");

const router = express.Router();

router.get("/", asyncHandler(BeachController.index));

router.get("/create", isAuth, (req, res) => {
  res.render("beaches/create");
});

router.post(
  "/",
  isAuth,
  upload.array("image", 5),
  validateBeach,
  asyncHandler(BeachController.store)
);

router.get(
  "/:id",
  isValidObjectId("/beaches"),
  asyncHandler(BeachController.detail)
);

router.get(
  "/:id/update",
  isAuth,
  isAuthorBeach,
  isValidObjectId("/beaches"),
  asyncHandler(BeachController.edit)
);

router.put(
  "/:id",
  isAuth,
  isAuthorBeach,
  isValidObjectId("/beaches"),
  upload.array("image", 5),
  validateBeach,
  asyncHandler(BeachController.update)
);

router.delete(
  "/:id",
  isAuth,
  isAuthorBeach,
  isValidObjectId("/beaches"),
  asyncHandler(BeachController.destroy)
);

router.delete(
  "/:id/images",
  isAuth,
  isAuthorBeach,
  isValidObjectId("/beaches"),
  asyncHandler(BeachController.destroyImage)
);

module.exports = router;
