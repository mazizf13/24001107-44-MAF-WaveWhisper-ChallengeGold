const express = require("express");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");

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
    console.error("Error connectingg to MongoDB:", error);
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

app.get("/beaches", async (req, res) => {
  const beaches = await Beach.find();
  res.render("beaches/index", { beaches });
});

app.get("/beaches/create", (req, res) => {
  res.render("beaches/create");
});

app.post("/beaches", async (req, res) => {
  const beach = new Beach(req.body.beach);
  await beach.save();
  res.redirect("/beaches");
});

app.get("/beaches/:id", async (req, res) => {
  const beach = await Beach.findById(req.params.id);
  res.render("beaches/detail", { beach });
});

app.get("/beaches/:id/update", async (req, res) => {
  const beach = await Beach.findById(req.params.id);
  res.render("beaches/update", { beach });
});

app.put("/beaches/:id", async (req, res) => {
  await Beach.findByIdAndUpdate(req.params.id, {
    ...req.body.beach,
  });
  res.redirect("/beaches");
});

app.delete("/beaches/:id", async (req, res) => {
  await Beach.findByIdAndDelete(req.params.id);
  res.redirect("/beaches");
});

app.get("/seed/beach", async (req, res) => {
  const beach = new Beach({
    title: "Kuta Beach",
    cost: "$20/person",
    description:
      "You won’t find peace and quiet here, but it’s still worth a visit. Shop at the Beachwalk Mall, go surfing, or watch the sunset with a Bintang.",
    location: "Badung, Bali",
  });

  await beach.save();
  res.send(beach);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
