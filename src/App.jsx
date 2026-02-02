import React, { useState, useEffect } from 'react';
import './App.css';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import GameOver from './components/GameOver';
import NetworkStatus from './components/NetworkStatus';
import webPubSubClient from './utils/webPubSubClient';
import { checkWinner, isBoardFull, createEmptyBoard, getNextPlayer } from './utils/gameLogic';

// Game phases
const PHASE = {
  LOBBY: 'LOBBY',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
};

function App() {
  // Game state
  const [phase, setPhase] = useState(PHASE.LOBBY);
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [roomCode, setRoomCode] = useState('');
  const [playerRole, setPlayerRole] = useState(null); // 'X' or 'O'
  const [playerId, setPlayerId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  // Initialize player ID from localStorage or create new one
  useEffect(() => {
    let id = localStorage.getItem('tictactoe-playerId');
    if (!id) {
      id = 'player-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('tictactoe-playerId', id);
    }
    setPlayerId(id);
  }, []);

  // Set up WebSocket connection status listener
  useEffect(() => {
    webPubSubClient.onConnectionStatus((connected) => {
      setIsConnected(connected);
    });

    // Listen for messages
    webPubSubClient.onMessage((message) => {
      handleWebSocketMessage(message);
    });

    // In development mode, listen to localStorage events for cross-tab sync
    if (import.meta.env.DEV) {
      const handleStorageChange = (e) => {
        if (e.key === 'tictactoe-move') {
          const message = JSON.parse(e.newValue);
          if (message.room === roomCode && message.playerId !== playerId) {
            handleOpponentMove(message);
          }
        } else if (e.key === 'tictactoe-join') {
          const message = JSON.parse(e.newValue);
          if (message.room === roomCode && message.playerId !== playerId) {
            setWaitingForOpponent(false);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [roomCode, playerId]);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'MOVE':
        if (message.playerId !== playerId) {
          handleOpponentMove(message);
        }
        break;
      case 'JOIN_ROOM':
        if (message.playerId !== playerId) {
          setWaitingForOpponent(false);
        }
        break;
      default:
        break;
    }
  };

  // Handle opponent's move
  const handleOpponentMove = (message) => {
    const newBoard = [...board];
    newBoard[message.index] = message.player;
    setBoard(newBoard);
    setCurrentPlayer(getNextPlayer(message.player));

    // Check for game over
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setPhase(PHASE.GAME_OVER);
    } else if (isBoardFull(newBoard)) {
      setWinner('DRAW');
      setPhase(PHASE.GAME_OVER);
    }
  };

  // Create a new room
  const handleCreateRoom = async (code) => {
    setRoomCode(code);
    setPlayerRole('X');
    setCurrentPlayer('X');
    setBoard(createEmptyBoard());
    setWaitingForOpponent(true);
    setPhase(PHASE.PLAYING);

    // Connect to WebSocket
    await webPubSubClient.connect(code, playerId);
    webPubSubClient.joinRoom('X');
  };

  // Join an existing room
  const handleJoinRoom = async (code) => {
    setRoomCode(code);
    setPlayerRole('O');
    setCurrentPlayer('X');
    setBoard(createEmptyBoard());
    setWaitingForOpponent(false);
    setPhase(PHASE.PLAYING);

    // Connect to WebSocket
    await webPubSubClient.connect(code, playerId);
    webPubSubClient.joinRoom('O');
  };

  // Handle cell click
  const handleCellClick = (index) => {
    // Validate move
    if (board[index] || currentPlayer !== playerRole || waitingForOpponent) {
      return;
    }

    // Update board
    const newBoard = [...board];
    newBoard[index] = playerRole;
    setBoard(newBoard);

    // Send move to server
    webPubSubClient.sendMove(index, playerRole);

    // Switch turns
    setCurrentPlayer(getNextPlayer(playerRole));

    // Check for winner
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setPhase(PHASE.GAME_OVER);
      return;
    }

    // Check for draw
    if (isBoardFull(newBoard)) {
      setWinner('DRAW');
      setPhase(PHASE.GAME_OVER);
    }
  };

  // Rematch
  const handleRematch = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setWinner(null);
    setPhase(PHASE.PLAYING);

    // Notify opponent of rematch
    if (import.meta.env.DEV) {
      window.localStorage.setItem('tictactoe-rematch', JSON.stringify({
        room: roomCode,
        playerId,
        timestamp: Date.now()
      }));
    }
  };

  // New game
  const handleNewGame = () => {
    setPhase(PHASE.LOBBY);
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setRoomCode('');
    setPlayerRole(null);
    setWinner(null);
    setWaitingForOpponent(false);
    webPubSubClient.disconnect();
  };

  return (
    <div className="app-container">
      <NetworkStatus isConnected={isConnected || import.meta.env.DEV} />

      {phase === PHASE.LOBBY && (
        <Lobby
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}

      {phase === PHASE.PLAYING && (
        <GameBoard
          board={board}
          currentPlayer={currentPlayer}
          playerRole={playerRole}
          roomCode={roomCode}
          onCellClick={handleCellClick}
          waitingForOpponent={waitingForOpponent}
        />
      )}

      {phase === PHASE.GAME_OVER && (
        <GameOver
          winner={winner}
          playerRole={playerRole}
          onRematch={handleRematch}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
}

export default App;
