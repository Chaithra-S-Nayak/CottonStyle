const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const ReturnRequest = require("../model/returnRequest");
const Razorpay = require("razorpay");
const Product = require("../model/product");
const sendNotification = require("../utils/notification");
const sendMail = require("../utils/sendMail");
const {
  generateEmailTemplate,
  getOrderCreationEmailTemplate,
  getOutOfStockEmailTemplate,
  getOrderRefundEmailTemplate,
} = require("../utils/emailTemplates");
require("dotenv").config();
// Function to calculate total price for items in a shop's cart
const calculateTotalPrice = (items) =>
  items.reduce((total, item) => total + item.discountPrice * item.qty, 0);

// Function to notify about out-of-stock products
const notifyOutOfStock = async (product) => {
  const shop = await Shop.findById(product.shopId);
  const bodyContent = getOutOfStockEmailTemplate(product.name, product._id);
  const outOfStockHtmlContent = generateEmailTemplate({
    recipientName: shop.name,
    bodyContent,
  });
  await sendNotification(
    "stock",
    `Product ${product.name} (ID: ${product._id}) is out of stock`,
    null,
    shop._id
  );
  try {
    await sendMail({
      email: shop.email,
      subject: "Product Out of Stock",
      html: outOfStockHtmlContent,
    });
  } catch (mailError) {
    console.error("Error sending email:", mailError);
  }
};

// Function to update product stock and sold_out count
const updateProductStock = async (id, qty) => {
  const product = await Product.findById(id);
  if (!product) {
    //suppose product was deleted after getting order
    return;
  }
  product.stock -= qty;
  product.sold_out += qty;
  if (product.stock <= 0) await notifyOutOfStock(product);
  await product.save({ validateBeforeSave: false });
};

// Function to update seller's available balance only after 7 days of delivery
const updateSellerBalance = async (sellerId, amount, deliveredAt) => {
  const currentDate = new Date();
  const deliveryDate = new Date(deliveredAt);
  const daysDifference = Math.floor(
    (currentDate - deliveryDate) / (1000 * 60 * 60 * 24)
  );

  if (daysDifference >= 7) {
    const seller = await Shop.findById(sellerId);
    seller.availableBalance += amount;
    await seller.save();
  } else {
    // Schedule a check for the balance update after the remaining days
    const remainingDays = 7 - daysDifference;
    setTimeout(async () => {
      const seller = await Shop.findById(sellerId);
      seller.availableBalance += amount;
      await seller.save();
    }, remainingDays * 24 * 60 * 60 * 1000); // Convert days to milliseconds
  }
};

// Create new order
router.post(
  "/create-order",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const {
      cart,
      shippingAddress,
      user,
      paymentInfo,
      coupon,
      sellerDeliveryFees,
      gstPercentage,
    } = req.body;
    // Group cart items by shopId
    const shopItemsMap = new Map();
    for (const item of cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }
    // Create an order for each shop
    const orders = [];
    for (const [shopId, items] of shopItemsMap) {
      let totalPrice = calculateTotalPrice(items);
      // Apply coupon discount if applicable
      if (coupon && coupon.shopId === shopId) {
        totalPrice -= parseFloat(coupon.couponDiscount);
      }
      // Add seller delivery fee if applicable and greater than 0
      const deliveryFee =
        sellerDeliveryFees && sellerDeliveryFees[shopId] !== undefined
          ? parseFloat(sellerDeliveryFees[shopId])
          : 0;
      totalPrice += deliveryFee;
      // Create the order
      const order = await Order.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice,
        gstPercentage,
        paymentInfo,
        coupon: coupon && coupon.shopId === shopId ? coupon : null, // Only include coupon if it matches the shopId
        shopId,
        sellerDeliveryFees: deliveryFee > 0 ? deliveryFee : null, // Only include delivery fee if greater than 0
      });
      orders.push(order);
      for (const o of order.cart) {
        await updateProductStock(o._id, o.qty);
      }
      const shop = await Shop.findById(shopId);
      const bodyContent = getOrderCreationEmailTemplate(order._id);
      const newOrderHtmlContent = generateEmailTemplate({
        recipientName: shop.name,
        bodyContent,
      });
      await sendNotification(
        "order",
        `New order created with ID: ${order._id}`,
        null,
        shop._id
      );
      try {
        await sendMail({
          email: shop.email,
          subject: "New order created",
          html: newOrderHtmlContent,
        });
      } catch (mailError) {
        console.error("Error sending email:", mailError);
      }
    }
    res.status(201).json({ success: true, orders });
  })
);

// Get all orders of a user
router.get(
  "/get-all-orders/:userId",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ "user._id": req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  })
);

// Get a single order by its ID
router.get(
  "/get-order/:orderId",
  catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }
    res.status(200).json({ success: true, order });
  })
);

// Get all orders of a seller
router.get(
  "/get-seller-all-orders/:shopId",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ "cart.shopId": req.params.shopId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  })
);

// Update order status (Seller)
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    order.status = req.body.status;
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "Succeeded";
      const serviceCharge = order.totalPrice * 0.1; // service charge
      await updateSellerBalance(
        req.seller.id,
        order.totalPrice - serviceCharge,
        order.deliveredAt
      );
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, order });
  })
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
router.put(
  "/order-refund-success/",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const { orderId, refundAmount, returnRequestId, products } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    try {
      const refund = await razorpay.payments.refund(order.paymentInfo.id, {
        amount: refundAmount * 100,
      });

      if (refund.status === "processed") {
        const updatedCart = order.cart.map((item) => {
          // Find the product in the products array to be updated
          const productUpdate = products.find(
            (p) => p.productId === item._id.toString()
          );
          if (productUpdate) {
            return {
              ...item,
              returnRequestType: "Refund",
              returnRequestStatus: "Approved Refund",
            };
          }
          return item;
        });
        order.cart = updatedCart;
        order.status = "Approved Refund";
        // Update returnOrExchange field in the order
        order.returnOrExchange = {
          returnRequestId: returnRequestId,
          requestType: "Return",
        };
        const returnRequest = await ReturnRequest.findById(returnRequestId);
        returnRequest.refundInit = true;
        await returnRequest.save();
        await order.save();
        res.status(200).json({ success: true, message: "Refund Successful!" });
      } else {
        return res
          .status(500)
          .json({ success: false, message: "Razorpay refund failed" });
      }
    } catch (error) {
      console.error("Razorpay refund error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Razorpay refund error" });
    }
  })
);

router.put(
  "/order-exchange-success/",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const { orderId, returnRequestId, products } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update the cart items based on the products array
    const updatedCart = order.cart.map((item) => {
      // Find the product in the products array to be updated
      const productUpdate = products.find(
        (p) => p.productId === item._id.toString()
      );
      if (productUpdate) {
        return {
          ...item,
          size: productUpdate.newSize,
          returnRequestType: "Exchange",
          returnRequestStatus: "Approved Exchange",
        };
      }
      return item;
    });

    // Update the order with new cart data and status
    order.cart = updatedCart;
    order.status = "Approved Exchange";
    order.returnOrExchange = {
      returnRequestId: returnRequestId,
      requestType: "Exchange",
    };

    const returnRequest = await ReturnRequest.findById(returnRequestId);
    returnRequest.exchangeInit = true;
    await returnRequest.save();
    await order.save();
    res.status(200).json({
      success: true,
      message: "Exchange approved and updated successfully",
    });
  })
);

router.put(
  "/update-exchange-status",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const { orderId, status } = req.body;
    console.log(status);
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update the exchange status for each product that has returnRequestType "Exchange"
    const updatedCart = order.cart.map((item) => {
      if (item.returnRequestType === "Exchange") {
        return {
          ...item,
          returnRequestStatus: status,
        };
      }
      return item;
    });
    order.cart = updatedCart;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Exchange status updated successfully",
      updatedCart,
    });
  })
);

// Get all orders (Admin)
router.get(
  "/admin-all-orders",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(201).json({ success: true, orders });
  })
);

module.exports = router;
