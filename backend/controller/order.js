const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const sendNotification = require("../utils/notification");

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
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
          sellerDeliveryFees: deliveryFee > 0 ? deliveryFee : null, // Only include delivery fee if greater than 0
        });

        orders.push(order);

        const shop = await Shop.findById(shopId);
        if (shop) {
          await sendNotification(
            "order",
            `New order created with ID: ${order._id}`,
            null,
            shop._id,
            shop.email
          );
        }
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Function to calculate total price for items in a shop's cart
const calculateTotalPrice = (items) => {
  let total = 0;
  for (const item of items) {
    total += item.discountPrice * item.qty;
  }
  return total;
};

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Route handler to fetch a single order by its ID
router.get(
  "/get-order/:orderId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      // Check if stock is available before processing
      for (const item of order.cart) {
        const product = await Product.findById(item._id);
        if (!product) {
          return next(
            new ErrorHandler(`Product not found with ID: ${item._id}`, 404)
          );
        }
        if (product.stock < item.qty) {
          return next(
            new ErrorHandler(
              `Not enough stock for product ${product.name}. Available stock: ${product.stock}, requested: ${item.qty}`,
              400
            )
          );
        }
      }

      // If status is not "Processing", update stock quantities
      if (req.body.status !== "Processing") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        const serviceCharge = order.totalPrice * 0.1; //service charge
        await updateSellerInfo(order.totalPrice - serviceCharge);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;

        if (product.stock <= 0) {
          const shop = await Shop.findById(product.shopId);
          if (shop) {
            await sendNotification(
              "stock",
              `Product ${product.name} (ID: ${product._id}) is out of stock`,
              null,
              shop._id,
              shop.email
            );
          } else {
            console.error(`Shop not found with ID: ${product.shopId}`);
          }
        }

        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);

        if (!seller) {
          console.error(`Seller not found with ID: ${req.seller.id}`);
          return;
        }

        seller.availableBalance += amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successful!",
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
