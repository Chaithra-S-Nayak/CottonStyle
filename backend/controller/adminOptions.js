const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const AdminOptions = require('../model/adminOptions');

// Get Admin Options
router.get('/admin-options', isAuthenticated, isAdmin('Admin'), catchAsyncErrors(async (req, res) => {
  try {
    const options = await AdminOptions.findOne();
    if (!options) {
      // If no options are found, send a 404 Not Found response
      return res.status(404).json({
        success: false,
        error: 'Admin options not found',
      });
    }
    // Send a 200 OK response with the options
    res.status(200).json({
      success: true,
      options,
    });
  } catch (error) {
    // If an error occurs, send a 500 Internal Server Error response
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
}));


// Update Admin Options
router.put('/admin-options', isAuthenticated, isAdmin('Admin'), catchAsyncErrors(async (req, res) => {
  try {
    const options = await AdminOptions.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    res.status(200).json({
      success: true,
      options,
    });
  } catch (error) {

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', '), // Send a single string with all error messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  }
}));



module.exports = router;

