// Function to format time based on duration in seconds
function formatTime(seconds) {
    const years = Math.floor(seconds / (365 * 24 * 3600));
    seconds %= 365 * 24 * 3600;
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60); // Remaining seconds

    let timeString = '';
    if (years) timeString += `${years} yr${years > 1 ? 's' : ''} `;
    if (days) timeString += `${days} day${days > 1 ? 's' : ''} `;
    if (hours) timeString += `${hours} hr${hours > 1 ? 's' : ''} `;
    if (minutes) timeString += `${minutes} min${minutes > 1 ? 's' : ''} `;
    if (seconds || timeString === '') timeString += `${seconds} sec${seconds > 1 ? 's' : ''}`;

    return timeString.trim();
}

module.exports = { formatTime };
