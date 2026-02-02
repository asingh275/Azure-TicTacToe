/**
 * Azure Web PubSub Client
 * Handles WebSocket connection and real-time communication
 */

class WebPubSubClient {
    constructor() {
        this.ws = null;
        this.roomCode = null;
        this.playerId = null;
        this.messageHandlers = [];
        this.connectionStatusCallbacks = [];
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    /**
     * Initialize WebSocket connection
     * @param {string} roomCode - Room identifier
     * @param {string} playerId - Unique player identifier
     */
    async connect(roomCode, playerId) {
        this.roomCode = roomCode;
        this.playerId = playerId;

        try {
            // In development mode, we'll simulate the connection
            // In production with Azure, this would call the negotiate endpoint
            const isDevelopment = import.meta.env.DEV;

            if (isDevelopment) {
                // Development mode: use local simulation
                console.log('[WebPubSub] Development mode - using local state sync');
                this.notifyConnectionStatus(true);
                return true;
            } else {
                // Production mode: connect to Azure Web PubSub
                const response = await fetch('/api/negotiate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roomCode, playerId })
                });

                if (!response.ok) {
                    throw new Error('Failed to negotiate WebSocket connection');
                }

                const { url } = await response.json();

                this.ws = new WebSocket(url);

                this.ws.onopen = () => {
                    console.log('[WebPubSub] Connected');
                    this.reconnectAttempts = 0;
                    this.notifyConnectionStatus(true);
                };

                this.ws.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    this.handleMessage(message);
                };

                this.ws.onerror = (error) => {
                    console.error('[WebPubSub] Error:', error);
                    this.notifyConnectionStatus(false);
                };

                this.ws.onclose = () => {
                    console.log('[WebPubSub] Disconnected');
                    this.notifyConnectionStatus(false);
                    this.attemptReconnect();
                };

                return true;
            }
        } catch (error) {
            console.error('[WebPubSub] Connection failed:', error);
            this.notifyConnectionStatus(false);
            return false;
        }
    }

    /**
     * Attempt to reconnect with exponential backoff
     */
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('[WebPubSub] Max reconnection attempts reached');
            return;
        }

        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        this.reconnectAttempts++;

        console.log(`[WebPubSub] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

        setTimeout(() => {
            this.connect(this.roomCode, this.playerId);
        }, delay);
    }

    /**
     * Send a move to the server
     * @param {number} index - Cell index (0-8)
     * @param {string} player - 'X' or 'O'
     */
    sendMove(index, player) {
        const message = {
            type: 'MOVE',
            room: this.roomCode,
            index,
            player,
            playerId: this.playerId,
            timestamp: Date.now()
        };

        if (import.meta.env.DEV) {
            // Development mode: emit message to local handlers
            console.log('[WebPubSub] Sending move (local):', message);
            // In dev mode, we'll handle this through localStorage events
            window.localStorage.setItem('tictactoe-move', JSON.stringify(message));
        } else {
            // Production mode: send via WebSocket
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(message));
            } else {
                console.error('[WebPubSub] Cannot send move - not connected');
            }
        }
    }

    /**
     * Join a room
     * @param {string} playerRole - 'X' or 'O'
     */
    joinRoom(playerRole) {
        const message = {
            type: 'JOIN_ROOM',
            room: this.roomCode,
            playerId: this.playerId,
            playerRole,
            timestamp: Date.now()
        };

        if (import.meta.env.DEV) {
            console.log('[WebPubSub] Joining room (local):', message);
            window.localStorage.setItem('tictactoe-join', JSON.stringify(message));
        } else {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(message));
            }
        }
    }

    /**
     * Handle incoming messages
     * @param {Object} message - Message object
     */
    handleMessage(message) {
        console.log('[WebPubSub] Received:', message);
        this.messageHandlers.forEach(handler => handler(message));
    }

    /**
     * Register a message handler
     * @param {Function} callback - Handler function
     */
    onMessage(callback) {
        this.messageHandlers.push(callback);
    }

    /**
     * Register a connection status callback
     * @param {Function} callback - Status callback
     */
    onConnectionStatus(callback) {
        this.connectionStatusCallbacks.push(callback);
    }

    /**
     * Notify all status callbacks
     * @param {boolean} isConnected
     */
    notifyConnectionStatus(isConnected) {
        this.connectionStatusCallbacks.forEach(callback => callback(isConnected));
    }

    /**
     * Disconnect from the server
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.messageHandlers = [];
        this.connectionStatusCallbacks = [];
    }

    /**
     * Check if connected
     * @returns {boolean}
     */
    isConnected() {
        if (import.meta.env.DEV) {
            return true; // Always "connected" in dev mode
        }
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

// Export singleton instance
export default new WebPubSubClient();
