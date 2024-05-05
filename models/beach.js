const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const beachSchema = new Schema({
  title: String,
  cost: Number,
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Beach", beachSchema);
