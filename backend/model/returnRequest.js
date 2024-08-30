const mongoose = require("mongoose");

const returnRequestSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  shopId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  product: [
    {
      productId: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      discountPrice: {
        type: Number,
        required: true,
      },
      paidAmount: {
        type: Number,
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
      requestType: {
        type: String,
        enum: ["Return", "Exchange"],
        required: true,
      },
      selectedSize: {
        type: String,
      },
      images: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
      coupon: {
        name: String,
        couponDiscountPercentage: Number,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ReturnRequest", returnRequestSchema);
