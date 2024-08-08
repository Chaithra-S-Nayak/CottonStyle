const generateEmailTemplate = ({ recipientName, bodyContent }) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0">
    <div
      style="
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 10px;
      "
    >
      <div
        style="
          text-align: center;
          padding: 10px;
          background-color: #f4f4f4;
          border-bottom: 1px solid #ccc;
        "
      >
        <div style="font-size: 20px; font-weight: 300; margin: 0">
          Tshirt Galaxy
        </div>
      </div>
      <p>Hello ${recipientName},</p>
      ${bodyContent}
      <div
        style="
          text-align: center;
          padding: 10px;
          background-color: #f4f4f4;
          border-top: 1px solid #ccc;
          font-size: 12px;
          color: #999;
        "
      >
        <p>&copy; 2024 Tshirt Galaxy. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;

const getAdminLoginOtpEmailTemplate = (otp) => `
    <p>
      We received a request to log into your admin account. Please use the OTP
      below to proceed with the login:
    </p>
    <p style="font-size: 20px; font-weight: 300; margin: 20px 0">${otp}</p>
    <p>The OTP will expire in 5 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
`;

const getOtpEmailTemplate = (otp) => `
    <p>
      We received a request to reset your password. Please use the OTP below to
      reset your password:
    </p>
    <p style="font-size: 20px; font-weight: 300; margin: 20px 0">${otp}</p>
    <p>The OTP will expire in 5 minutes.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
`;

const getActivationEmailTemplate = (activationUrl) => `
    <p>
      Thank you for registering with Tshirt Galaxy! Please click the button below
      to activate your account:
    </p>
    <a
      href="${activationUrl}"
      style="
        display: inline-block;
        padding: 10px 20px;
        margin: 20px 0;
        font-size: 16px;
        color: white;
        background-color: #4caf50;
        text-decoration: none;
        border-radius: 5px;
      "
      >Activate Account</a
    >
    <p>If you did not register for this account, please ignore this email.</p>
`;

const getAdminNotificationEmailTemplate = (name, email, phoneNumber) => `
    <p>We are pleased to inform you that a new seller has been activated:</p>
    <p>Name: ${name}</p>
    <p>Email: ${email}</p>
    <p>Phone Number: ${phoneNumber}</p>
    <p>
      Please reach out to them if you have any questions or need further
      information.
    </p>
`;

const getAccountDeletionEmailTemplate = (adminEmail) => `
    <p>
      We regret to inform you that your account has been deleted from
      Tshirt Galaxy.
    </p>
    <p>
      If you have any questions or concerns, please contact our support team at
      ${adminEmail}.
    </p>
    <p>Thank you for your understanding.</p>
`;

const getShopDeletionEmailTemplate = (adminEmail) => `
    <p>
      We regret to inform you that your seller account has been deleted from
      Tshirt Galaxy.
    </p>
    <p>
      If you have any questions or concerns, please contact our support team at
      ${adminEmail}.
    </p>
    <p>Thank you for your understanding.</p>
`;

const getReturnRequestEmailTemplate = (
  orderId,
  productId,
  reason,
  requestType
) => `
    <p>A return/exchange request has been made for the following order:</p>
    <p>Order ID: ${orderId}</p>
    <p>Product ID: ${productId}</p>
    <p>Reason: ${reason}</p>
    <p>Request Type: ${requestType}</p>
    <p>Please review the request and take the necessary action.</p>
`;

const getWithdrawRequestEmailTemplate = (amount) => `
    <p>We have received your withdrawal request for an amount of ${amount}.</p>
    <p>The process is now underway and will take 3-7 days to complete.</p>
    <p>Thank you for your patience.</p>
`;

const getWithdrawConfirmationEmailTemplate = (amount) => `
    <p>
      Your withdrawal request for the amount of ${amount} has been confirmed by
      the admin.
    </p>
    <p>The process is now underway and will take 3-7 days to complete.</p>
    <p>Thank you for your patience.</p>
`;

const getOrderCreationEmailTemplate = (orderId) => `
    <p>You have received a new order with ID: ${orderId}.</p>
    <p>Please review the order details and prepare for shipping:</p>
    <p>Thank you for using Tshirt Galaxy!</p>
`;

const getOutOfStockEmailTemplate = (productName, productId) => `
    <p>
      We wanted to inform you that the product ${productName} (ID: ${productId})
      is currently out of stock.
    </p>
    <p>Please restock the product to avoid missing out on future sales.</p>
    <p>Thank you for your attention.</p>
`;

const getOrderRefundEmailTemplate = (orderId, status) => `
    <p>
      Your order refund has been processed successfully.Please find the details
      below:
    </p>
    <p>Order ID: ${orderId}</p>
    <p>Refund Status: ${status}</p>
`;

module.exports = {
  getAdminLoginOtpEmailTemplate,
  getOtpEmailTemplate,
  generateEmailTemplate,
  getAdminNotificationEmailTemplate,
  getActivationEmailTemplate,
  getAccountDeletionEmailTemplate,
  getShopDeletionEmailTemplate,
  getReturnRequestEmailTemplate,
  getWithdrawRequestEmailTemplate,
  getWithdrawConfirmationEmailTemplate,
  getOrderCreationEmailTemplate,
  getOutOfStockEmailTemplate,
  getOrderRefundEmailTemplate,
};
