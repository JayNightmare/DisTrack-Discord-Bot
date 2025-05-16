const User = require('../models/User.js');

async function getUserYearlyStats(userId) {
    try {
        const currentYear = new Date().getFullYear();

        // Define the start and end of the year
        const startOfYear = new Date(currentYear, 0, 1); // January 1st, 00:00:00
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59); // December 31st, 23:59:59

        // Query sessions within the year
        const sessions = await User.find({
            userId,
            lastSessionDate: { $gte: startOfYear, $lte: endOfYear }, // Adjust for your date field
        });

        if (!sessions || sessions.length === 0) {
            throw new Error(`No stats found for user with ID ${userId} for ${currentYear}`);
        }

        return sessions;
    } catch (error) {
        console.error("Error fetching user stats:", error);
        throw error;
    }
}

// Create a getAllUsers function to fetch all users
async function getAllUsers() {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            throw new Error("No users found in the database");
        }
        return users;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
}

module.exports = {
    getUserYearlyStats,
    getAllUsers
};