const mongoose = require("mongoose")

const connectToMongo = (URL) => {
    return mongoose.connect(URL)
}

module.exports = connectToMongo