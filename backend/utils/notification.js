const Notification = require("../model/notification");

const sendNotification = async (type, message, adminId, shopId) => {
  try {
    // Save notification to the database
    await Notification.create({
      adminId: adminId || undefined,
      shopId: shopId || undefined,
      message,
      type,
    });

    console.log(`Notification sent: Type - ${type}, Message - ${message}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = sendNotification;
