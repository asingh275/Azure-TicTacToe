import React from 'react';

/**
 * NetworkStatus Component
 * Displays real-time connection status in terminal style
 */
function NetworkStatus({ isConnected }) {
    return (
        <div className={`network-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="neon-text">
                &gt; STATUS: {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
        </div>
    );
}

export default NetworkStatus;
