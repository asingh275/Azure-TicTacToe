/**
 * Game Logic Utilities
 * Pure functions for Tic-Tac-Toe game rules and validation
 */

// All possible winning combinations (rows, columns, diagonals)
const WINNING_LINES = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

/**
 * Check if there's a winner on the board
 * @param {Array} board - Array of 9 cells ('X', 'O', or null)
 * @returns {string|null} - 'X', 'O', or null
 */
export function checkWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return 'X' or 'O'
    }
  }
  return null;
}

/**
 * Check if the board is completely filled
 * @param {Array} board - Array of 9 cells
 * @returns {boolean}
 */
export function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

/**
 * Validate if a move is legal
 * @param {Array} board - Current board state
 * @param {number} index - Cell index (0-8)
 * @param {string} currentPlayer - 'X' or 'O'
 * @param {string} playerRole - This player's role ('X' or 'O')
 * @returns {boolean}
 */
export function isValidMove(board, index, currentPlayer, playerRole) {
  // Check if cell is empty
  if (board[index] !== null) {
    return false;
  }
  
  // Check if it's this player's turn
  if (currentPlayer !== playerRole) {
    return false;
  }
  
  return true;
}

/**
 * Get the next player
 * @param {string} currentPlayer - 'X' or 'O'
 * @returns {string} - 'O' or 'X'
 */
export function getNextPlayer(currentPlayer) {
  return currentPlayer === 'X' ? 'O' : 'X';
}

/**
 * Create an empty board
 * @returns {Array} - Array of 9 null values
 */
export function createEmptyBoard() {
  return Array(9).fill(null);
}

/**
 * Generate a random room code
 * @param {number} length - Length of the code (default 4)
 * @returns {string} - Random alphanumeric code
 */
export function generateRoomCode(length = 4) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar looking chars
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
