import React from 'react';

/**
 * GameBoard Component
 * Main game grid with move handling
 */
function GameBoard({
    board,
    currentPlayer,
    playerRole,
    roomCode,
    onCellClick,
    waitingForOpponent
}) {
    const handleCellClick = (index) => {
        if (board[index] || currentPlayer !== playerRole) {
            return; // Cell filled or not player's turn
        }
        onCellClick(index);
    };

    const renderCell = (index) => {
        const value = board[index];
        const cellClass = `cell ${value ? value.toLowerCase() : ''} ${value ? 'filled' : ''}`;

        return (
            <div
                key={index}
                className={cellClass}
                onClick={() => handleCellClick(index)}
            >
                {value && <span className="neon-text">{value}</span>}
            </div>
        );
    };

    return (
        <div className="terminal-window">
            <h1 className="neon-text">TIC-TAC-TOE</h1>

            <div className="room-code-display">
                <span className="neon-text">ROOM CODE:</span>
                <span className="code neon-text">{roomCode}</span>
            </div>

            {waitingForOpponent ? (
                <div className="game-info">
                    <p className="current-player neon-text loading">
                        &gt; WAITING FOR OPPONENT
                    </p>
                </div>
            ) : (
                <div className="game-info">
                    <p className="neon-text">
                        &gt; YOU ARE: <span style={{
                            color: playerRole === 'X' ? 'var(--neon-green)' : 'var(--electric-purple)',
                            textShadow: `0 0 10px ${playerRole === 'X' ? 'var(--neon-green)' : 'var(--electric-purple)'}`
                        }}>{playerRole}</span>
                    </p>
                    <p className="current-player neon-text">
                        &gt; CURRENT TURN: <span style={{
                            color: currentPlayer === 'X' ? 'var(--neon-green)' : 'var(--electric-purple)',
                            textShadow: `0 0 10px ${currentPlayer === 'X' ? 'var(--neon-green)' : 'var(--electric-purple)'}`
                        }}>{currentPlayer}</span>
                    </p>
                    {currentPlayer === playerRole && (
                        <p style={{ color: 'var(--amber)', fontSize: '1.3rem', marginTop: '0.5rem' }}>
                            &gt;&gt; YOUR TURN &lt;&lt;
                        </p>
                    )}
                </div>
            )}

            <div className="game-board">
                {[...Array(9)].map((_, index) => renderCell(index))}
            </div>

            <div className="ascii-decoration">
                ┌─────────────────────────────┐<br />
                │ X = GREEN | O = PURPLE │<br />
                └─────────────────────────────┘
            </div>
        </div>
    );
}

export default GameBoard;
