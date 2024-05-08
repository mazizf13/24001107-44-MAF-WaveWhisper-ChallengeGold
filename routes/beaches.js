const express = require("express");
const BeachController = require("../controllers/beaches");
const { beachSchema } = require("../schemas/beach");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("../utils/asyncHandler");
const isValidObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth");
const { isAuthorBeach } = require("../middlewares/isAuthor");

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

router.get("/", asyncHandler(BeachController.index));

router.get("/create", isAuth, (req, res) => {
  res.render("beaches/create");
});

router.post("/", isAuth, validateBeach, asyncHandler(BeachController.store));

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

module.exports = router;
