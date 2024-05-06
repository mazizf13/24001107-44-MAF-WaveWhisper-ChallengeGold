const express = require("express");
const router = express.Router();
const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    res.send(req.body);
  })
);

module.exports = router;
