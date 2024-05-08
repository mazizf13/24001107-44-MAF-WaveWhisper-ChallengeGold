const Beach = require("../models/beach");

module.exports.index = async (req, res) => {
  const beaches = await Beach.find();
  res.render("beaches/index", { beaches });
};

module.exports.store = async (req, res, next) => {
  const beach = new Beach(req.body.beach);
  beach.author = req.user._id;
  await beach.save();
  req.flash("success_msg", "Beach added succesfully");
  res.redirect("/beaches");
};

module.exports.detail = async (req, res) => {
  const beach = await Beach.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  res.render("beaches/detail", { beach });
};

module.exports.edit = async (req, res) => {
  const beach = await Beach.findById(req.params.id);
  res.render("beaches/update", { beach });
};

module.exports.update = async (req, res) => {
  await Beach.findByIdAndUpdate(req.params.id, { ...req.body.beach });
  req.flash("success_msg", "Beach updated successfully");
  res.redirect(`/beaches/${req.params.id}`);
};

module.exports.destroy = async (req, res) => {
  await Beach.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Beach deleted successfully");
  res.redirect("/beaches");
};
