const express = require("express");
const Beach = require("../models/beach");
const { beachSchema } = require("../schemas/beach");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("../utils/asyncHandler");
const isValidObjectId = require("../middleware/isValidObjectId");

const router = express.Router();

const validateBeach = (req, res, next) => {
  const { error } = beachSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const beaches = await Beach.find();
    res.render("beaches/index", { beaches });
  })
);

router.get("/create", (req, res) => {
  res.render("beaches/create");
});

router.post(
  "/",
  validateBeach,
  asyncHandler(async (req, res, next) => {
    const beach = new Beach(req.body.beach);
    await beach.save();
    req.flash("success_msg", "Beach added succesfully");
    res.redirect("/beaches");
  })
);

router.get(
  "/:id",
  isValidObjectId("/beaches"),
  asyncHandler(async (req, res) => {
    const beach = await Beach.findById(req.params.id).populate("reviews");
    res.render("beaches/detail", { beach });
  })
);

router.get(
  "/:id/update",
  isValidObjectId("/beaches"),
  asyncHandler(async (req, res) => {
    const beach = await Beach.findById(req.params.id);
    res.render("beaches/update", { beach });
  })
);

router.put(
  "/:id",
  isValidObjectId("/beaches"),
  validateBeach,
  asyncHandler(async (req, res) => {
    await Beach.findByIdAndUpdate(req.params.id, {
      ...req.body.beach,
    });
    req.flash("success_msg", "Beach updated successfully");
    res.redirect(`/beaches/${req.params.id}`);
  })
);

router.delete(
  "/:id",
  isValidObjectId("/beaches"),
  asyncHandler(async (req, res) => {
    await Beach.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Beach deleted successfully");
    res.redirect("/beaches");
  })
);

module.exports = router;
