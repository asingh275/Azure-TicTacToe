# Retro Arcade Tic-Tac-Toe 🎮

A multiplayer Tic-Tac-Toe game with a stunning 1980s retro-arcade CRT terminal aesthetic. Features real-time synchronization using Azure Web PubSub.

## 🎨 Features

- **Retro-Arcade Aesthetic**: 1980s CRT terminal style with scanlines, neon glow effects, and glitch animations
- **Multiplayer**: Real-time room-based matchmaking with dynamic room codes
- **Azure Integration**: WebSocket synchronization via Azure Web PubSub
- **Reconnection Support**: LocalStorage-based player ID persistence
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Development Mode

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to play locally.

**Note**: In development mode, multiplayer sync works via localStorage events. Open two browser tabs to test multiplayer functionality.

### Production Deployment

This app is ready for Azure Static Web Apps deployment.

#### Prerequisites

1. Azure account
2. GitHub repository
3. Azure Web PubSub resource

#### Deployment Steps

1. **Create Azure Web PubSub Resource**
   - Go to Azure Portal
   - Create a new Web PubSub resource
   - Copy the connection string

2. **Deploy to Azure Static Web Apps**
   - Create a new Static Web App in Azure Portal
   - Connect to your GitHub repository
   - Set build configuration:
     - App location: `/`
     - API location: `api`
     - Output location: `dist`

3. **Configure Environment Variables**
   - In Azure Portal, go to your Static Web App
   - Navigate to Configuration
   - Add application setting:
     - Name: `WEBPUBSUB_CONNECTION_STRING`
     - Value: Your Web PubSub connection string

4. **Build and Deploy**
   ```bash
   npm run build
   ```
   
   Push to GitHub to trigger automatic deployment.

## 🎮 How to Play

1. **Create a Room**: Click "CREATE NEW ROOM" to generate a unique 4-character code
2. **Share the Code**: Give the room code to your opponent
3. **Join a Room**: Enter the room code and click "JOIN ROOM"
4. **Play**: First player is X (green), second player is O (purple)
5. **Win Condition**: Get three in a row horizontally, vertically, or diagonally

## 🛠 Technology Stack

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS with retro-arcade theme
- **Backend**: Azure Functions (Node.js)
- **Real-time**: Azure Web PubSub (WebSockets)
- **Deployment**: Azure Static Web Apps

## 📁 Project Structure

```
retro-tictactoe/
├── src/
│   ├── components/
│   │   ├── Lobby.jsx          # Room creation/joining
│   │   ├── GameBoard.jsx      # Game grid
│   │   ├── GameOver.jsx       # End game screen
│   │   └── NetworkStatus.jsx  # Connection indicator
│   ├── utils/
│   │   ├── gameLogic.js       # Game rules
│   │   └── webPubSubClient.js # WebSocket client
│   ├── App.jsx                # Main orchestrator
│   ├── App.css                # Retro styling
│   └── main.jsx               # Entry point
├── api/
│   └── negotiate/
│       ├── index.js           # WebSocket auth
│       └── function.json      # Azure config
└── staticwebapp.config.json   # Deployment config
```

## 🎨 Design Elements

- **Color Palette**:
  - Neon Green (#39FF14) - Player X
  - Electric Purple (#BF00FF) - Player O
  - Amber (#FFBF00) - System messages
- **Font**: VT323 (Google Fonts)
- **Effects**: CRT flicker, scanlines, neon glow, glitch animations

## 📝 License

MIT License - Feel free to use this project for learning or personal use.

## 🙏 Credits

Built with ❤️ using modern web technologies and retro aesthetics.
