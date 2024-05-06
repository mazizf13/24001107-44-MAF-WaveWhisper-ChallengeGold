const express = require("express");
const Beach = require("../models/beach");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas/review");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("../utils/asyncHandler");
const isValidObjectId = require("../middlewares/isValidObjectId");

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};

router.post(
  "/",
  isValidObjectId("/beaches"),
  validateReview,
  asyncHandler(async (req, res) => {
    const review = new Review(req.body.review);
    const beach = await Beach.findById(req.params.beach_id);
    beach.reviews.push(review);
    await review.save();
    await beach.save();
    req.flash("success_msg", "Review added successfully");
    res.redirect(`/beaches/${req.params.beach_id}`);
  })
);

router.delete(
  "/:review_id",
  isValidObjectId("/beaches"),
  asyncHandler(async (req, res) => {
    const { beach_id, review_id } = req.params;
    await Beach.findByIdAndUpdate(beach_id, {
      $pull: { reviews: review_id },
    });
    await Review.findByIdAndDelete(review_id);
    req.flash("success_msg", "Review deleted successfully");
    res.redirect(`/beaches/${beach_id}`);
  })
);

module.exports = router;
