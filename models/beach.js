const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const beachSchema = new Schema({
  title: String,
  cost: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("Beach", beachSchema);
