require("dotenv").config();

module.exports = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 3000,
    PREMIUM_REPORT_WH: process.env.PREMIUM_REPORT_WH,
    BUG_REPORT_WH: process.env.BUG_REPORT_WH,
    SUGGESTION_REPORT_WH: process.env.SUGGESTION_REPORT_WH
};
