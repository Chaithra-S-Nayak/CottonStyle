const mongoose = require('mongoose');
const textLineSchema = new mongoose.Schema({
  text: { type: String, required: [true, "Please enter text for the line!"] },
  fontSize: { type: Number, required: [true, "Please enter font size for the line!"] },
  fontStyle: { type: String, required: [true, "Please enter font style for the line!"] },
  color: { type: String, required: [true, "Please enter color for the line!"] },
});

const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: [true, "Please enter image URL for the banner!"] },
  textLines: [textLineSchema],
});

const themeSchema = new mongoose.Schema({
  primaryColor: { type: String, required: [true, "Please enter primary color for the theme!"] },
  secondaryColor: { type: String, required: [true, "Please enter secondary color for the theme!"] },
});

const adminOptionsSchema = new mongoose.Schema({
  logoUrl: { type: String, required: [true, "Please enter logo URL!"] },
  theme: themeSchema,
  banners: [bannerSchema],
  gstTax: { type: Number, required: [true, "Please enter GST tax!"] },
  deliveryFee: { type: Number, required: [true, "Please enter delivery fee!"] },
  thresholdFee: { type: Number, required: [true, "Please enter threshold fee!"] },
});

module.exports = mongoose.model('AdminOptions', adminOptionsSchema);
