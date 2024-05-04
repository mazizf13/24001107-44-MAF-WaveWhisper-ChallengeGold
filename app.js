const express = require("express");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/seed/beach", async (req, res) => {
  const beach = new Beach({
    title: "Kuta Beach",
    price: "$20",
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
