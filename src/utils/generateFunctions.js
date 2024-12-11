const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder'); // Use gifencoder instead of gif-encoder
const fs = require('fs');
const path = require('path');

/**
 * Generates an animated GIF avatar with a selected border overlay.
 * @param {string} avatarUrl - The URL of the user's avatar.
 * @param {string} borderName - The folder name containing frames of the selected border animation.
 * @returns {Promise<Buffer>} - The generated avatar image with border as an animated GIF buffer.
 */

async function generateBorderedAvatar(avatarUrl, borderName) {
    try {
        const canvasSize = 128;
        const frameRate = 10; // Set delay between frames in ms

        // Create a GIF encoder
        const encoder = new GIFEncoder(canvasSize, canvasSize);
        const canvas = createCanvas(canvasSize, canvasSize);
        const context = canvas.getContext('2d');

        // Buffer to collect encoded GIF data
        const bufferChunks = [];

        // Set up the encoder
        encoder.createReadStream().on('data', chunk => bufferChunks.push(chunk));
        encoder.start();
        encoder.setRepeat(0); // Loop indefinitely
        encoder.setDelay(frameRate); // Frame delay
        encoder.setQuality(10); // Higher quality, lower speed

        // Load the user's avatar
        const avatar = await loadImage(avatarUrl);

        // Load each frame of the border animation
        const borderFramesPath = path.join(__dirname, '..', 'borders', borderName);
        const borderFrameFiles = fs.readdirSync(borderFramesPath).filter(file => file.endsWith('.png'));

        // Sort frames by file name to ensure correct order
        borderFrameFiles.sort();

        for (const frameFile of borderFrameFiles) {
            const borderFrame = await loadImage(path.join(borderFramesPath, frameFile));

            // Draw avatar and overlay border frame
            context.clearRect(0, 0, canvasSize, canvasSize); // Clear the canvas
            context.drawImage(avatar, 10, 10, 108, 108); // Draw avatar
            context.drawImage(borderFrame, 0, 0, canvasSize, canvasSize); // Overlay border frame

            // Add canvas frame to GIF
            encoder.addFrame(context);
        }

        encoder.finish();

        // Combine buffer chunks into a single buffer
        return Buffer.concat(bufferChunks);
    } catch (e) {
        console.error('Error generating avatar with border:', e.message);
        return null;
    }
}

const generateStatsSummary = (userStats) => {
    const totalHours = userStats.reduce((sum, session) => sum + session.hours, 0);
    const streaks = calculateStreaks(userStats); // Implement streak logic
    const mostProductiveDay = calculateMostProductiveDay(userStats); // Implement logic for this

    return {
        totalHours,
        longestStreak: streaks.longest,
        mostProductiveDay,
    };
};


module.exports = {
    generateBorderedAvatar,
    generateStatsSummary
};
