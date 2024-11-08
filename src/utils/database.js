// src/utils/database.js
const mongoose = require("mongoose");
const { MONGODB_URI } = require("../configs/config");

async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URI); // Options are no longer needed
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

module.exports = { connectToDatabase };
