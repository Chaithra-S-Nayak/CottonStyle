require('dotenv').config();
const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB', err);
    });
};

module.exports = connectDatabase;
