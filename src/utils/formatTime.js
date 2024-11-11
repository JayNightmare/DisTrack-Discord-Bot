// Function to format time based on duration in seconds
function formatTime(seconds) {
    if (seconds >= 2 * 365 * 24 * 3600) { // more than 2 years
        return `${(seconds / (365 * 24 * 3600)).toFixed(2)} years`;
    } else if (seconds >= 24 * 3600) { // more than 1 day
        return `${(seconds / (24 * 3600)).toFixed(2)} days`;
    } else if (seconds >= 3600) { // more than 1 hour
        return `${(seconds / 3600).toFixed(2)} hours`;
    } else if (seconds >= 60) { // more than 1 minute
        return `${(seconds / 60).toFixed(2)} minutes`;
    } else {
        return `${seconds.toFixed(2)} seconds`;
    }
}

module.exports = { formatTime };