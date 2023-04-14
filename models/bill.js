const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bill: {
    type: String,
    required: true,
  },
  bill_price: {
    type: Number,
    required: true,
  },
  due_date: {
    type: String,
    required: true,
  },
  countDown_days: {
    type: Number,
    required: true,
  },
  frequency: {
    type: Number,
    required: true,
  },
  due_status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Bill", billSchema);
