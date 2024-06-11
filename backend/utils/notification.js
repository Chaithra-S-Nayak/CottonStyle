const Notification = require("../model/notification");
const sendMail = require("./sendMail");

const sendNotification = async (type, message, userId, shopId, email) => {
  try {
    // Save notification to the database
    await Notification.create({
      userId: userId || undefined,
      shopId: shopId || undefined,
      message,
      type,
    });

    // Send email notification
    if (email) {
      await sendMail({
        email,
        subject: `Notification: ${type}`,
        message,
      });
    }

    console.log(`Notification sent: Type - ${type}, Message - ${message}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = sendNotification;
