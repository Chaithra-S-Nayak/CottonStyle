const sendAdminToken = (admin, statusCode, res) => {
  const token = admin.getJwtToken();

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
    options.sameSite = 'none';
  }

  res.status(statusCode).cookie("admin_token", token, options).json({
    success: true,
    admin,
    token,
  });
};

module.exports = sendAdminToken;
