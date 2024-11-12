const { createCanvas, loadImage } = require('canvas');
const path = require('path');

/**
 * Generates an avatar image with a selected border overlay.
 * @param {string} avatarUrl - The URL of the user's avatar.
 * @param {string} borderName - The name of the selected border image file.
 * @returns {Buffer} - The generated avatar image with border as a buffer.
 */

async function generateBorderedAvatar(avatarUrl, borderName) {
    const canvasSize = 128;
    const canvas = createCanvas(canvasSize, canvasSize);
    const context = canvas.getContext('2d');

    // Load the user's avatar
    const avatar = await loadImage(avatarUrl);

    // Draw the avatar onto the canvas
    context.drawImage(avatar, 0, 0, canvasSize, canvasSize);

    // Load the selected border image
    const borderPath = path.join(__dirname, '..', 'borders', borderName);
    const borderImage = await loadImage(borderPath);

    // Draw the border overlay on top of the avatar
    context.drawImage(borderImage, 0, 0, canvasSize, canvasSize);

    // Return the combined image as a buffer
    return canvas.toBuffer();
}

module.exports = { generateBorderedAvatar };
