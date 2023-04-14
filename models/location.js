const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  place_id: {
    type: String,
    required: true,
  },
  location: {
    type: Object,
    required: true,
  },
  viewport: {
    type: Object,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  expense: {
    type: String,
  },
  date:{
    type: String,
    required: true,
  },

});

module.exports = mongoose.model("Location", locationSchema);
