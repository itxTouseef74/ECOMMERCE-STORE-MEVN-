const mongoose = require("mongoose")
require('dotenv').config();
function connectDB() {
  return new Promise((resolve, reject) => {
    const mongodbURL = process.env.MONGODB_URI;
    mongoose
      .connect(mongodbURL)
      .then((conn) => {
        console.log('connected')
        resolve(conn)
      })
      .catch((error) => reject(error))
  })
}

module.exports = connectDB
