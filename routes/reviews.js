const express = require("express");
const ReviewController = require("../controllers/reviews");
const asyncHandler = require("../utils/asyncHandler");
const isValidObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth");
const { isAuthorReview } = require("../middlewares/isAuthor");
const { validateReview } = require("../middlewares/validator");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuth,
  isValidObjectId("/beaches"),
  validateReview,
  asyncHandler(ReviewController.store)
);

router.delete(
  "/:review_id",
  isAuth,
  isAuthorReview,
  isValidObjectId("/beaches"),
  asyncHandler(ReviewController.destroy)
);

module.exports = router;
