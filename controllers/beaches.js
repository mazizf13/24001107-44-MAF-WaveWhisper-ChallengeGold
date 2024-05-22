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
  const { id } = req.params;
  const beach = await Beach.findById(id);

  if (beach.images.length > 0) {
    beach.images.forEach((image) => {
      fs.unlink(image.url, (err) => new ErrorHandler(err));
    });
  }

  await beach.deleteOne();

  req.flash("success_msg", "Beach deleted successfully");
  res.redirect("/beaches");
};

module.exports.destroyImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body;

    if (!images || images.length === 0) {
      req.flash("error_msg", "Please select at least one image");
      return res.redirect(`/beaches/${id}/update`);
    }

    images.forEach((image) => {
      fs.unlinkSync(image);
    });

    await Beach.findByIdAndUpdate(id, {
      $pull: { images: { url: { $in: images } } },
    });

    req.flash("success_msg", "Succesfully deleted images");
    return res.redirect(`/beaches/${id}/update`);
  } catch (error) {
    req.flash("error_msg", "Failed to delete images");
    return res.redirect(`/beaches/${id}/update`);
  }
};
