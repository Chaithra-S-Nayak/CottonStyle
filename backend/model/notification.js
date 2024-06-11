const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: false },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
