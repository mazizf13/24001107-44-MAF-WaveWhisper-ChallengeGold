const express = require("express");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const ErrorHandler = require("./utils/ErrorHandler");
const app = express();
const port = 3000;

// Connect to mongodb
mongoose
  .connect("mongodb://127.0.0.1/wave_whisper")
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/beaches", require("./routes/beaches"));
app.use("/beaches/:beach_id/reviews", require("./routes/reviews"));

app.all("*", (req, res, next) => {
  next(new ErrorHandler("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oops! Something Went Wrong.";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
