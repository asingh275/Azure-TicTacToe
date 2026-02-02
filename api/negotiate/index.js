const { WebPubSubServiceClient } = require('@azure/web-pubsub');

module.exports = async function (context, req) {
    context.log('Processing negotiate request');

    // Get room code and player ID from request
    const { roomCode, playerId } = req.body;

    if (!roomCode || !playerId) {
        context.res = {
            status: 400,
            body: { error: 'roomCode and playerId are required' }
        };
        return;
    }

    try {
        // Get connection string from environment variable
        const connectionString = process.env.WEBPUBSUB_CONNECTION_STRING;

        if (!connectionString) {
            throw new Error('WEBPUBSUB_CONNECTION_STRING not configured');
        }

        // Create service client
        const serviceClient = new WebPubSubServiceClient(
            connectionString,
            'tictactoe' // Hub name
        );

        // Generate client access token
        // Group players by room code for isolated communication
        const token = await serviceClient.getClientAccessToken({
            userId: playerId,
            groups: [`room-${roomCode}`],
            expirationTimeInMinutes: 60
        });

        // Return the WebSocket URL
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                url: token.url
            }
        };
    } catch (error) {
        context.log.error('Error generating token:', error);
        context.res = {
            status: 500,
            body: { error: 'Failed to generate connection token' }
        };
    }
};
