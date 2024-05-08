const Beach = require("../models/beach");
const Review = require("../models/review");

module.exports.store = async (req, res) => {
  const { beach_id } = req.params;

  const review = new Review(req.body.review);
  review.author = req.user._id;
  await review.save();

  const beach = await Beach.findById(beach_id);
  beach.reviews.push(review);
  await beach.save();

  req.flash("success_msg", "Review added successfully");
  res.redirect(`/beaches/${beach_id}`);
};

module.exports.destroy = async (req, res) => {
  const { beach_id, review_id } = req.params;
  await Beach.findByIdAndUpdate(beach_id, {
    $pull: { reviews: review_id },
  });
  await Review.findByIdAndDelete(review_id);
  req.flash("success_msg", "Review deleted successfully");
  res.redirect(`/beaches/${beach_id}`);
};
