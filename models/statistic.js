const mongoose = require("mongoose");

const statisticSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  expense: {
    type: String,
    required: true,
  },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  bill: { type: mongoose.Schema.Types.ObjectId, ref: "Bill" },
  place_id: {
    type: String,
  },
});

module.exports = mongoose.model("Statistic", statisticSchema);
