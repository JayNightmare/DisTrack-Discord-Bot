// src/configs/config.js
require("dotenv").config();

module.exports = {
    DISCORD_TOKEN: process.env.TEST_TOKEN,
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 3000,
};
