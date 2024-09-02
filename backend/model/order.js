const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  cart: {
    type: Array,
    required: true,
  },
  shippingAddress: {
    type: Object,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  gstPercentage: {
    type: Number,
    required: true,
  },
  sellerDeliveryFees: {
    type: Number,
  },
  coupon: {
    name: {
      type: String,
    },
    couponDiscountPercentage: {
      type: Number,
    },
    couponDiscount: {
      type: Number,
    },
    shopId: {
      type: String,
    },
  },
  shopId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Processing",
  },
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  paidAt: {
    type: Date,
    default: Date.now(),
  },
  deliveredAt: {
    type: Date,
  },
  invoiceId: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      return "INV" + Date.now();
    },
  },
  returnOrExchange: {
    returnRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReturnRequest",
    },
    requestType: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
