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
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      await User.register(user, password);
      req.flash("success_msg", "You are registered and can logged in");
      res.redirect("/login");
    } catch (error) {
      req.flash("error_msg", error.message);
      res.redirect("/register");
    }
  })
);

module.exports = router;
