const Beach = require("../models/beach");
const Review = require("../models/review");

module.exports.isAuthorBeach = async (req, res, next) => {
  const { id } = req.params;
  let beach = await Beach.findById(id);

  if (!beach.author.equals(req.user._id)) {
    req.flash("error_msg", "Not authorized");
    return res.redirect("/beaches");
  }

  next();
};

module.exports.isAuthorReview = async (req, res, next) => {
  const { beach_id, review_id } = req.params;
  let review = await Review.findById(review_id);

  if (!review.author.equals(req.user._id)) {
    req.flash("error_msg", "Not authorized");
    return res.redirect(`/beaches/${beach_id}`);
  }

  next();
};
