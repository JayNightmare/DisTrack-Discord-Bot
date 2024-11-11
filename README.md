# DisTrack - Discord Coding Tracker Bot

DisTrack is a Discord bot that integrates with a VSCode extension to help you track your coding activities, including time spent coding, languages used, achievements, and streaks.

<iframe src="https://github.com/sponsors/JayNightmare/card" title="Sponsor JayNightmare" height="225" width="600" style="border: 0;"></iframe>

## Table of Contents
- [DisTrack - Discord Coding Tracker Bot](#distrack---discord-coding-tracker-bot)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [Commands](#commands)
  - [Example Usage](#example-usage)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Profile Management**: View your coding profile, including total time coded, current streak, longest streak, and last session time.
- **Achievement Tracking**: Earn achievements for reaching milestones based on your coding time.
- **Language Statistics**: View detailed stats on the languages you’ve coded in.
- **Leaderboard**: Compete with others to see who has the most coding time.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/DisTrack.git
   ```
2. **Install Dependencies**:
   ```bash
   cd DisTrack
   npm install
   ```
3. **MongoDB Setup**:
   - Ensure MongoDB is installed and running.
   - Create a database named `distrack` and note the connection URI.

## Configuration

1. **Set Environment Variables**:
   - Create a `.env` file in the root directory with the following variables:
     ```plaintext
     TOKEN=your_discord_bot_token
     MONGODB_URI=your_mongodb_connection_uri
     CLIENT_ID=your_discord_client_id
     GUILD_ID=your_discord_guild_id
     ```
2. **MongoDB Setup**:
   - Ensure the IP address of your server is whitelisted in MongoDB Atlas or your MongoDB instance.

## Usage

1. **Start the Bot**:
   - Run the following command to start the bot:
     ```bash
     node server.js
     ```

2. **Invite the Bot to Your Server**:
   - Use the OAuth2 URL Generator in the Discord Developer Portal with the necessary bot permissions to invite the bot to your server.

## Commands

- **/profile** `[user]`: Displays your coding profile with total coding time, achievements, and language statistics.
- **/leaderboard**: Shows the top coders based on total coding time.
- **/achievements**: Lists milestones you've achieved based on coding time.
- **/help**: Provides help and usage instructions for each command.

## Example Usage

```
/profile @User
```

This command displays the coding profile of a specified user, showing their coding stats, streaks, and achievements.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit changes:
   ```bash
   git commit -m "Add a new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
