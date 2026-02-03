module.exports = async function (context, req) {
    context.log('NEGOTIATE CALLED');
    context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
            message: "Functions are ALIVE!",
            time: new Date().toISOString()
        }
    };
};
