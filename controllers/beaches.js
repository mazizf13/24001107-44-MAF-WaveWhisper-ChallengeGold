const Beach = require("../models/beach");
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler");

module.exports.index = async (req, res) => {
  const beaches = await Beach.find();
  res.render("beaches/index", { beaches });
};

module.exports.store = async (req, res, next) => {
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  const beach = new Beach(req.body.beach);
  beach.author = req.user._id;
  beach.images = images;

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
  const beach = await Beach.findByIdAndUpdate(req.params.id, {
    ...req.body.beach,
  });

  if (req.files && req.files.length > 0) {
    beach.images.forEach((image) => {
      fs.unlink(image.url, (err) => new ErrorHandler(err));
    });

    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));
    beach.images = images;
    await beach.save();
  }

  req.flash("success_msg", "Beach updated successfully");
  res.redirect(`/beaches/${req.params.id}`);
};

module.exports.destroy = async (req, res) => {
  await Beach.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Beach deleted successfully");
  res.redirect("/beaches");
};
