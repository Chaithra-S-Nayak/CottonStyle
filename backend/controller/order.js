const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const sendNotification = require("../utils/notification");
const sendMail = require("../utils/sendMail");
const {
  generateEmailTemplate,
  getOrderCreationEmailTemplate,
  getOutOfStockEmailTemplate,
  getOrderRefundEmailTemplate,
} = require("../utils/emailTemplates");

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

// Function to update seller's available balance after deducting service charge
const updateSellerBalance = async (sellerId, amount) => {
  const seller = await Shop.findById(sellerId);
  seller.availableBalance += amount;
  await seller.save();
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
        order.totalPrice - serviceCharge
      );
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, order });
  })
);

// Give a refund --must be removed
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    order.status = req.body.status;
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      order,
      message: "Order Refund Request successfully!",
    });
  })
);

// Accept a refund (seller) --must be removed
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    order.status = req.body.status;
    await order.save();
    res
      .status(200)
      .json({ success: true, message: "Order Refund successful!" });
    if (req.body.status === "Refund Success") {
      for (const o of order.cart) {
        const product = await Product.findById(o._id);
        product.stock += o.qty;
        product.sold_out -= o.qty;
        await product.save({ validateBeforeSave: false });
      }
      const seller = await Shop.findById(order.seller);
      if (seller) {
        seller.availableBalance -= seller.availableBalance * 0.1;
        await seller.save();
        const bodyContent = getOrderRefundEmailTemplate(
          order._id,
          order.status
        );
        const html = generateEmailTemplate({
          recipientName: seller.name,
          bodyContent,
        });
        try {
          await sendMail({
            email: seller.email,
            subject: "Order Refund Successful",
            html,
          });
        } catch (mailError) {
          console.error("Error sending email:", mailError);
        }
      }
    }
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
