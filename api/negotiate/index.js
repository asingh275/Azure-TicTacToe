const { WebPubSubServiceClient } = require('@azure/web-pubsub');

module.exports = async function (context, req) {
    context.log('Processing negotiate request');

    // 1. Safe GET check for testing
    if (req.method === 'GET') {
        const hasKey = !!process.env.WEBPUBSUB_CONNECTION_STRING;
        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: {
                status: "Ready",
                message: "Endpoint alive.",
                webPubSubConfigured: hasKey,
                note: hasKey ? "Ready to play!" : "Missing WEBPUBSUB_CONNECTION_STRING variable in Azure Portal."
            }
        };
        return;
    }

    // 2. Safe Body check (prevent 500 crash if body is null)
    const body = req.body || {};
    const { roomCode, playerId } = body;

    if (!roomCode || !playerId) {
        context.res = {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
            body: { error: 'roomCode and playerId are required in POST body' }
        };
        return;
    }

    try {
        const connectionString = process.env.WEBPUBSUB_CONNECTION_STRING;

        if (!connectionString) {
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: { error: 'WEBPUBSUB_CONNECTION_STRING is not set in Azure Environment Variables.' }
            };
            return;
        }

        const serviceClient = new WebPubSubServiceClient(connectionString, 'tictactoe');
        const token = await serviceClient.getClientAccessToken({
            userId: playerId,
            groups: [`room-${roomCode}`],
            expirationTimeInMinutes: 60
        });

        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: { url: token.url }
        };
    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: { error: 'Internal Server Error', details: error.message }
        };
    }
};
