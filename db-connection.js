const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

//Connect to MongoDB
mongoose.connect(uri);

// Get the default connection
const db = mongoose.connection;

// Handle connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))
db.once('open', function() {
    console.log('Connected to MongoDB')
})

module.exports = db;