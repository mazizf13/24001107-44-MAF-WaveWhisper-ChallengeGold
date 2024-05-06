const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const beachSchema = new Schema({
  title: String,
  cost: Number,
  description: String,
  location: String,
  image: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

beachSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Beach", beachSchema);
