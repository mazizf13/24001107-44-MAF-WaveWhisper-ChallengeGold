const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");
const asyncHandler = require("../utils/asyncHandler");
const passport = require("passport");

router.get("/register", AuthController.registerForm);

router.post("/register", asyncHandler(AuthController.register));

router.get("/login", AuthController.loginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: {
      type: "error_msg",
      msg: "Invalid username or password",
    },
  }),
  AuthController.login
);

router.post("/logout", AuthController.logout);

module.exports = router;
