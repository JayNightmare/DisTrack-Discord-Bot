<div align=center>
  <img src="images/distrack.png" width=225 radius=10 />
</div>
  
<div align=center>
  <h1>
    DisTrack - Discord Coding Tracker Bot
  </h1>
</div>
 
DisTrack is a Discord bot that integrates with a VSCode extension to help you track your coding activities, including time spent coding, languages used, achievements, and streaks.

> Bot Invite: https://discord.com/oauth2/authorize?client_id=1305258645906526328

> Bot Version: beta@v0.7.8

> Extension: 
- [Source Code](https://github.com/JayNightmare/DisTrack-VSCode-Extension)
- [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=JayNightmare.dis-track)

> Extension Version: beta@v0.5.9

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Commands](#commands)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Coding Session Tracking**: Automatically tracks coding sessions when you start VSCode.
- **Language-Specific Time Tracking**: Records the time spent in each programming language.
- **Discord Integration**: Shows a real-time status in Discord, including the file and language.
- **Achievements**: Gain achievements for milestones based on your total coding time.
- **Profile Management**: View coding stats and achievements through a Discord bot.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/JayNightmare/DisTrack-Discord-Bot
   ```
2. **Install Dependencies**:
   ```bash
   cd DisTrack-VSCode-Extension
   npm install
   ```
3. **Setup MongoDB**:
   - Ensure MongoDB is installed and running.
   - Create a database and note the connection URI.

## Configuration

1. **MongoDB Setup**:
   - Ensure the IP address for your server is whitelisted in MongoDB Atlas or your MongoDB instance.
   
## Usage

1. **Start VSCode**:
   - When you start VSCode, the extension will automatically begin a coding session and track your active language and coding time.
   
2. **Link Discord**:
   - Click on the status bar item "Link to Discord" and enter your Discord ID to enable activity tracking and achievements through the Discord bot.

3. **Stop Coding Session**:
   - When you close VSCode, the session ends, and your session data is saved to the MongoDB database.

## Commands

- **Profile**: Displays your coding profile, including total coding time, language stats, and achievements.
- **Leaderboard**: View the top users based on total coding time
- **Achievements**: Lists the milestones you’ve achieved
- **Compare**: Compares your stats against another user's stats
- **Freeze Streak**: Freezes your streak
- **Help**: Shows all commands and info about the bot
- **Recents**: Shows information from recent session
- **Set Bio**: Sets the bio for the profile command
- **Bug Reports and Suggestions**: Sends your feedback to the developement team so we can improve the extension and bot

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit changes:
   ```bash
   git commit -m "Add a feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request.

## License

This project is licensed under the Creative Commons Legal Code License. See the [LICENSE](LICENSE) file for more details.
