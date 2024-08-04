const mongoose = require("mongoose");

const sizeChartSchema = new mongoose.Schema({
  size: { type: String },
  chestSize: { type: String },
  waistSize: { type: String },
  lengthSize: { type: String },
});

const adminOptionsSchema = new mongoose.Schema({
  gstTax: { type: Number, required: [true, "Please enter GST tax!"] },
  deliveryFee: { type: Number, required: [true, "Please enter delivery fee!"] },
  thresholdFee: {
    type: Number,
    required: [true, "Please enter threshold fee!"],
  },
  fabric: { type: [String] },
  color: { type: [String] },
  sizeChart: { type: [sizeChartSchema], default: [] },
});

module.exports = mongoose.model("AdminOptions", adminOptionsSchema);
