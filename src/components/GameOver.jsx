import React from 'react';

/**
 * GameOver Component
 * Victory/Draw screen with rematch options
 */
function GameOver({ winner, onRematch, onNewGame, playerRole }) {
    const isWinner = winner === playerRole;
    const isDraw = winner === 'DRAW';

    let message;
    let messageColor;

    if (isDraw) {
        message = '>>> DRAW <<<';
        messageColor = 'var(--amber)';
    } else if (isWinner) {
        message = '>>> YOU WIN <<<';
        messageColor = playerRole === 'X' ? 'var(--neon-green)' : 'var(--electric-purple)';
    } else {
        message = '>>> YOU LOSE <<<';
        messageColor = 'var(--error-red)';
    }

    return (
        <div className="game-over">
            <div className="terminal-window">
                <h1 className="neon-text">GAME OVER</h1>

                <div className="ascii-decoration">
                    ╔═══════════════════════════════╗
                </div>

                <div
                    className="winner-message neon-text"
                    style={{
                        color: messageColor,
                        textShadow: `0 0 15px ${messageColor}, 0 0 30px ${messageColor}`
                    }}
                >
                    {message}
                </div>

                {!isDraw && (
                    <div style={{
                        fontSize: '2rem',
                        color: winner === 'X' ? 'var(--neon-green)' : 'var(--electric-purple)',
                        marginBottom: '2rem'
                    }}>
                        {isWinner ? '🏆 VICTORY 🏆' : '💀 DEFEAT 💀'}
                    </div>
                )}

                <div className="ascii-decoration">
                    ╚═══════════════════════════════╝
                </div>

                <div className="ascii-decoration" style={{ marginTop: '2rem' }}>
                    ┌─────────────────────────────┐<br />
                    │  ██████╗  █████╗ ████████╗ │<br />
                    │ ██╔════╝ ██╔══██╗╚══██╔══╝ │<br />
                    │ ██║  ███╗███████║   ██║    │<br />
                    │ ██║   ██║██╔══██║   ██║    │<br />
                    │ ╚██████╔╝██║  ██║   ██║    │<br />
                    │  ╚═════╝ ╚═╝  ╚═╝   ╚═╝    │<br />
                    └─────────────────────────────┘
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={onRematch} className="amber neon-text">
                        [ REMATCH ]
                    </button>
                    <button onClick={onNewGame} className="neon-text">
                        [ NEW GAME ]
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameOver;
