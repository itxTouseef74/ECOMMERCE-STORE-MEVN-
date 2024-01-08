const mongoose = require("mongoose")

function connectDB() {
  return new Promise((resolve, reject) => {
    const mongoURL = `mongodb+srv://touseefhussain:Touseef2252@multi-tenancy.nps71wk.mongodb.net/?retryWrites=true&w=majority`
    mongoose
      .connect(mongoURL)
      .then((conn) => {
        console.log('connected')
        resolve(conn)
      })
      .catch((error) => reject(error))
  })
}

module.exports = connectDB
