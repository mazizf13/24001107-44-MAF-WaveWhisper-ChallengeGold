const express = require("express");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const asyncHandler = require("./utils/asyncHandler");
const ErrorHandler = require("./utils/ErrorHandler");

const app = express();
const port = 3000;

// Models
const Beach = require("./models/beach");
const { error } = require("console");

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/beaches",
  asyncHandler(async (req, res) => {
    const beaches = await Beach.find();
    res.render("beaches/index", { beaches });
  })
);

app.get("/beaches/create", (req, res) => {
  res.render("beaches/create");
});

app.post(
  "/beaches",
  asyncHandler(async (req, res, next) => {
    const beach = new Beach(req.body.beach);
    await beach.save();
    res.redirect("/beaches");
  })
);

app.get(
  "/beaches/:id",
  asyncHandler(async (req, res) => {
    const beach = await Beach.findById(req.params.id);
    res.render("beaches/detail", { beach });
  })
);

app.get(
  "/beaches/:id/update",
  asyncHandler(async (req, res) => {
    const beach = await Beach.findById(req.params.id);
    res.render("beaches/update", { beach });
  })
);

app.put(
  "/beaches/:id",
  asyncHandler(async (req, res) => {
    await Beach.findByIdAndUpdate(req.params.id, {
      ...req.body.beach,
    });
    res.redirect("/beaches");
  })
);

app.delete(
  "/beaches/:id",
  asyncHandler(async (req, res) => {
    await Beach.findByIdAndDelete(req.params.id);
    res.redirect("/beaches");
  })
);

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
