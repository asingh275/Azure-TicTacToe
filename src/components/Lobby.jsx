import React, { useState } from 'react';
import { generateRoomCode } from '../utils/gameLogic';

/**
 * Lobby Component
 * Room creation and joining interface
 */
function Lobby({ onCreateRoom, onJoinRoom }) {
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');

    const handleCreateRoom = () => {
        const code = generateRoomCode(4);
        onCreateRoom(code);
    };

    const handleJoinRoom = () => {
        if (!roomCode || roomCode.length < 4) {
            setError('Please enter a valid room code');
            return;
        }
        setError('');
        onJoinRoom(roomCode.toUpperCase());
    };

    const handleInputChange = (e) => {
        setError('');
        setRoomCode(e.target.value.toUpperCase());
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleJoinRoom();
        }
    };

    return (
        <div className="lobby">
            <div className="terminal-window">
                <h1 className="neon-text">TIC-TAC-TOE</h1>
                <h2 className="neon-text">CYBER TERMINAL v1.0</h2>

                <div className="ascii-decoration">
                    ╔═══════════════════════════════╗
                </div>

                <div className="lobby-actions">
                    <button onClick={handleCreateRoom} className="neon-text">
                        [ CREATE NEW ROOM ]
                    </button>

                    <div className="divider">
                        <span className="neon-text">- OR -</span>
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="ROOM CODE"
                            value={roomCode}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            maxLength={4}
                            className="neon-text"
                        />
                        {error && (
                            <div style={{ color: 'var(--error-red)', marginTop: '0.5rem', fontSize: '1.2rem' }}>
                                {error}
                            </div>
                        )}
                    </div>

                    <button onClick={handleJoinRoom} className="purple neon-text">
                        [ JOIN ROOM ]
                    </button>
                </div>

                <div className="ascii-decoration" style={{ marginTop: '2rem' }}>
                    ╚═══════════════════════════════╝
                </div>

                <div style={{ marginTop: '2rem', fontSize: '1rem', color: 'var(--amber)', opacity: 0.7 }}>
                    <p>&gt; FIRST PLAYER IS X (GREEN)</p>
                    <p>&gt; SECOND PLAYER IS O (PURPLE)</p>
                </div>
            </div>
        </div>
    );
}

export default Lobby;
